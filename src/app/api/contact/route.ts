import { NextResponse, after } from 'next/server';
import { RateLimitService } from '@/lib/services/rateLimitService';
import { contactEnquirySchema } from '@/lib/validations/contact';
import dbConnect from '@/lib/db/mongodb';
import Lead from '@/models/Lead';
import { getRequestContext, sendWebsiteLeadEvent } from '@/lib/services/metaConversionsService';

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting: 5 enquiries per hour per IP to prevent spam
        const ip = RateLimitService.getIP(req);
        const rl = await RateLimitService.check(`contact_${ip}`, 5, 60 * 60 * 1000);
        
        const headers = {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rl.remaining.toString(),
            'X-RateLimit-Reset': rl.reset.toString()
        };

        if (!rl.success) {
            return NextResponse.json(
                { message: 'Spam Protection: You have submitted too many enquiries. Please try again after an hour or contact us directly via email.' }, 
                { status: 429, headers }
            );
        }

        const body = await req.json();

        // 2. Schema Validation
        const validation = contactEnquirySchema.safeParse(body);
        if (!validation.success) {
            const firstErrorMessage = validation.error.issues[0]?.message || 'Please fill in all required fields.';
            return NextResponse.json(
                { message: firstErrorMessage, errors: validation.error.format() }, 
                { status: 400, headers }
            );
        }

        // 3. Lead Capture in Database
        await dbConnect();
        const contactVal = (body.contact || '').trim();
        const isEmail = contactVal.includes('@');

        const metaContext = getRequestContext(req);

        const lead = await Lead.create({
            fullName: body.name?.trim(),
            phoneNumber: isEmail ? (body.phoneNumber || contactVal) : contactVal,
            email: isEmail ? contactVal : (body.email || 'not-provided@example.com'),
            notes: body.requirements?.trim(),
            studentClass: body.module?.trim(),
            leadType: 'enquiry',
            status: 'pending',
            fbp: metaContext.fbp,
            fbc: metaContext.fbc,
            metaReportedStages: ['pending']
        });

        after(() => sendWebsiteLeadEvent(lead, metaContext, {
            eventId: body.eventId,
            customData: { lead_type: 'enquiry', module: lead.studentClass }
        }));
        
        return NextResponse.json({ 
            message: 'Identity Verified. Proceeding to Secure Institutional Dispatch.',
            success: true 
        }, { headers });

    } catch (err: any) {
        return NextResponse.json({ message: 'Lead Transmission Node Failure' }, { status: 500 });
    }
}
