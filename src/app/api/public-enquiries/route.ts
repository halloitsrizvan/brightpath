import { NextResponse, after } from 'next/server';
import { errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Lead from '@/models/Lead';
import { RateLimitService } from '@/lib/services/rateLimitService';
import { getRequestContext, sendWebsiteLeadEvent } from '@/lib/services/metaConversionsService';

const str = (v: unknown, max = 200) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined);

/** Tuition-page enquiries, saved as leads so they appear in the admin Leads dashboard. */
export async function POST(request: Request) {
    try {
        // Public form: 10 submissions per hour per IP to stop spam
        const rl = await RateLimitService.check(`enquiry_${RateLimitService.getIP(request)}`, 10, 60 * 60 * 1000);
        if (!rl.success) {
            return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
        }

        const body = await request.json();

        const phoneNumber = str(body.phone, 30);
        if (!phoneNumber) return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });

        await dbConnect();
        const metaContext = getRequestContext(request);

        const parentName = str(body.parentName);
        const board = str(body.board, 80);
        const source = str(body.source) || 'Tuition Page';

        const lead = await Lead.create({
            fullName: str(body.studentName) || parentName,
            email: str(body.email),
            phoneNumber,
            whatsappNumber: str(body.whatsapp, 30),
            country: str(body.country, 80),
            studentClass: str(body.class, 80),
            userType: ['student', 'parent', 'teacher'].includes(body.userType) ? body.userType : 'parent',
            leadType: 'enquiry',
            status: 'pending',
            source,
            notes: [parentName && `Parent: ${parentName}`, board && `Board: ${board}`, `Source: ${source}`]
                .filter(Boolean).join(' • '),
            fbp: metaContext.fbp,
            fbc: metaContext.fbc,
            metaReportedStages: ['pending']
        });

        after(() => sendWebsiteLeadEvent(lead, metaContext, {
            eventId: str(body.eventId, 100),
            customData: { lead_type: 'enquiry', source, category: str(body.category, 80) }
        }));

        return NextResponse.json({ message: "Enquiry submitted successfully" }, { status: 201 });
    } catch (error) {
        return errorResponse(error, 'POST /api/public-enquiries');
    }
}
