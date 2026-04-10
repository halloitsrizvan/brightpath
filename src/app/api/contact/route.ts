import { NextResponse } from 'next/server';
import { RateLimitService } from '@/lib/services/rateLimitService';
import { contactEnquirySchema } from '@/lib/validations/contact';

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting: 5 enquiries per hour per IP to prevent spam
        const ip = RateLimitService.getIP(req);
        const rl = RateLimitService.check(`contact_${ip}`, 5, 60 * 60 * 1000);
        
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
            return NextResponse.json(
                { message: 'Incomplete or Invalid Institutional Data', errors: validation.error.format() }, 
                { status: 400, headers }
            );
        }

        // Potential growth: log successful lead to database here
        
        return NextResponse.json({ 
            message: 'Identity Verified. Proceeding to Secure Institutional Dispatch.',
            success: true 
        }, { headers });

    } catch (err: any) {
        return NextResponse.json({ message: 'Lead Transmission Node Failure' }, { status: 500 });
    }
}
