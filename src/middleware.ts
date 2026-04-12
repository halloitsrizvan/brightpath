import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const response = NextResponse.next();

    // 1. Add Security Headers
    response.headers.set('X-DNS-Prefetch-Control', 'on');
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Content Security Policy (Basic)
    // Allows Google Fonts, Cloudinary, and institutional assets
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.dicebear.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://res.cloudinary.com https://api.dicebear.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.whatsapp.com;"
    );

    // 2. Edge-Level Auth Protection
    const isApiAdminRoute = pathname.startsWith('/api/admin');
    const isAdminDashboard = pathname.startsWith('/admin-dashboard');
    const isTeacherDashboard = pathname.startsWith('/teacher-dashboard');
    const isStudentDashboard = pathname.startsWith('/student-dashboard');
    
    // Login routes
    const isAdminLogin = pathname === '/admin';
    const isTeacherLogin = pathname === '/teacher';
    const isStudentLogin = pathname === '/student';

    const token = request.cookies.get('token')?.value;

    // A. Redirect Logged-out users away from protected routes
    if (isApiAdminRoute || isAdminDashboard || isTeacherDashboard || isStudentDashboard) {
        if (!token) {
            if (isAdminDashboard) return NextResponse.redirect(new URL('/admin', request.url));
            if (isTeacherDashboard) return NextResponse.redirect(new URL('/teacher', request.url));
            if (isStudentDashboard) return NextResponse.redirect(new URL('/student', request.url));
            return NextResponse.json({ message: 'Identity Required' }, { status: 401 });
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            
            // Further role-based checks
            if (isAdminDashboard && payload.role !== 'admin') {
                 return NextResponse.redirect(new URL('/admin', request.url));
            }
            if (isTeacherDashboard && payload.role !== 'teacher') {
                 return NextResponse.redirect(new URL('/teacher', request.url));
            }
            if (isStudentDashboard && payload.role !== 'student') {
                 return NextResponse.redirect(new URL('/student', request.url));
            }
        } catch (error) {
            if (isAdminDashboard) return NextResponse.redirect(new URL('/admin', request.url));
            if (isTeacherDashboard) return NextResponse.redirect(new URL('/teacher', request.url));
            if (isStudentDashboard) return NextResponse.redirect(new URL('/student', request.url));
            return NextResponse.json({ message: 'Session Revoked' }, { status: 401 });
        }
    }

    // B. Redirect Logged-in users away from login pages
    if (token && (isAdminLogin || isTeacherLogin || isStudentLogin)) {
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            if (payload.role === 'admin' && isAdminLogin) {
                return NextResponse.redirect(new URL('/admin-dashboard', request.url));
            }
            if (payload.role === 'teacher' && isTeacherLogin) {
                return NextResponse.redirect(new URL('/teacher-dashboard', request.url));
            }
            if (payload.role === 'student' && isStudentLogin) {
                return NextResponse.redirect(new URL('/student-dashboard', request.url));
            }
        } catch (e) {
            // Token is invalid, let them stay on the login page
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};
