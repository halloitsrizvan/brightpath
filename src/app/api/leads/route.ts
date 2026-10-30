import { NextRequest, NextResponse, after } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Lead from '@/models/Lead';
import { RateLimitService } from '@/lib/services/rateLimitService';
import { getRequestContext, sendWebsiteLeadEvent, sendCrmStageEvent, LEAD_STAGE_EVENTS } from '@/lib/services/metaConversionsService';

const LEAD_STATUSES = ['pending', 'contacted', 'resolved', 'junk'];
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : undefined);

export async function POST(request: NextRequest) {
    try {
        // Public form: 10 submissions per hour per IP to stop spam and DB flooding
        const ip = RateLimitService.getIP(request);
        const rl = await RateLimitService.check(`lead_${ip}`, 10, 60 * 60 * 1000);
        if (!rl.success) {
            return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
        }

        await dbConnect();
        const body = await request.json();
        const metaContext = getRequestContext(request);

        const phoneNumber = str(body.phoneNumber, 30);
        if (!phoneNumber) return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });

        const lead = await Lead.create({
            fullName: str(body.fullName),
            email: str(body.email),
            phoneNumber,
            whatsappNumber: str(body.whatsappNumber, 30),
            country: str(body.country, 80),
            studentClass: str(body.studentClass, 80),
            userType: ['student', 'parent', 'teacher'].includes(body.userType) ? body.userType : 'student',
            leadType: body.leadType === 'demo' ? 'demo' : 'enquiry',
            status: 'pending',
            fbp: metaContext.fbp,
            fbc: metaContext.fbc,
            metaReportedStages: ['pending']
        });

        after(() => sendWebsiteLeadEvent(lead, metaContext, {
            eventId: str(body.eventId, 100),
            customData: { lead_type: lead.leadType, student_class: lead.studentClass }
        }));

        return NextResponse.json({ message: "Lead captured successfully", id: lead._id }, { status: 201 });
    } catch (error: any) {
        return errorResponse(error, 'POST /api/leads');
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(request, ['admin']);
        const leads = await Lead.find({}).sort({ createdAt: -1 });
        return NextResponse.json(leads);
    } catch (error: any) {
        return errorResponse(error, 'GET /api/leads');
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(request, ['admin']);
        const { id, status, notes, metaLeadId } = await request.json();

        const update: Record<string, any> = {};
        if (status !== undefined) {
            if (!LEAD_STATUSES.includes(status)) return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
            update.status = status;
        }
        if (notes !== undefined) update.notes = str(notes, 5000);
        // Meta Lead Ads IDs are numeric; only admins can attach one
        if (metaLeadId !== undefined) {
            if (metaLeadId && !/^\d{1,20}$/.test(String(metaLeadId))) return NextResponse.json({ message: 'Invalid Meta lead ID' }, { status: 400 });
            update.metaLeadId = metaLeadId ? String(metaLeadId) : undefined;
        }

        const lead = await Lead.findByIdAndUpdate(id, update, { new: true });
        if (!lead) return NextResponse.json({ message: 'Lead not found' }, { status: 404 });

        // Report each CRM stage to Meta only once per lead
        if (status && LEAD_STAGE_EVENTS[status] && !lead.metaReportedStages?.includes(status)) {
            await Lead.updateOne({ _id: lead._id }, { $addToSet: { metaReportedStages: status } });
            after(() => sendCrmStageEvent(lead, status));
        }

        return NextResponse.json(lead);
    } catch (error: any) {
        return errorResponse(error, 'PATCH /api/leads');
    }
}
