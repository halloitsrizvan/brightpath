import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import Teacher from '@/models/Teacher';
import Student from '@/models/Student';
import { RateLimitService } from '@/lib/services/rateLimitService';
import { loginSchema } from '@/lib/validations/auth';
import { AuditService } from '@/lib/services/auditService';
import { signToken, SESSION_COOKIE_MAX_AGE } from '@/lib/api/auth';

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting: 5 attempts per 15 mins per IP
        const ip = RateLimitService.getIP(req);
        const rl = await RateLimitService.check(`login_${ip}`, 5, 15 * 60 * 1000);
        
        const headers = {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rl.remaining.toString(),
            'X-RateLimit-Reset': rl.reset.toString()
        };

        if (!rl.success) {
            return NextResponse.json({ message: 'Brute-force protection: Too many attempts. Try again in 15 minutes.' }, { status: 429, headers });
        }

        await dbConnect();
        const body = await req.json();
        
        // 2. Schema Validation
        const validation = loginSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ message: 'Institutional Data Violation', errors: validation.error.format() }, { status: 400, headers });
        }

        const { email, password } = validation.data;
        const role = body.role;

        // Per-account limit as well, so rotating IPs cannot brute-force a single account
        const accountRl = await RateLimitService.check(`login_acct_${role}_${email.toLowerCase()}`, 10, 15 * 60 * 1000);
        if (!accountRl.success) {
            return NextResponse.json({ message: 'Brute-force protection: Too many attempts. Try again in 15 minutes.' }, { status: 429, headers });
        }

        const Model = role === 'admin' ? Admin : role === 'teacher' ? Teacher : role === 'student' ? Student : null;
        const user: any = Model ? await Model.findOne({ email }).select('+password') : null;

        // Same response for unknown users and wrong passwords, so accounts cannot be enumerated
        const isMatch = user ? await bcrypt.compare(password, user.password) : false;
        if (!user || !isMatch) {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401, headers });
        }

        // The role always comes from which collection matched, never from the stored document
        const payload = { id: String(user._id), role: role as string };
        const token = signToken(payload);

        await AuditService.log('USER_LOGIN_SUCCESS', {
            id: user._id,
            email: user.email,
            role,
            name: user.name || user.fullName
        }, { ip }, req);

        const response = NextResponse.json({
            user: { 
                id: user._id, 
                name: user.name || user.fullName, 
                email: user.email, 
                role,
                adminRole: user.adminRole || (role === 'admin' ? 'Super Admin' : role)
            }
        });

        response.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_COOKIE_MAX_AGE
        });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
