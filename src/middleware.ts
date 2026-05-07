import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

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

    let finalResponse: NextResponse;

    // A. Redirect Logged-out users away from protected routes
    if (isApiAdminRoute || isAdminDashboard || isTeacherDashboard || isStudentDashboard) {
        if (!token) {
            if (isAdminDashboard) finalResponse = NextResponse.redirect(new URL('/admin', request.url));
            else if (isTeacherDashboard) finalResponse = NextResponse.redirect(new URL('/teacher', request.url));
            else if (isStudentDashboard) finalResponse = NextResponse.redirect(new URL('/student', request.url));
            else finalResponse = NextResponse.json({ message: 'Identity Required' }, { status: 401 });
        } else {
            try {
                const { payload } = await jwtVerify(token, JWT_SECRET);
                
                if (isAdminDashboard && payload.role !== 'admin') {
                    finalResponse = NextResponse.redirect(new URL('/admin', request.url));
                } else if (isTeacherDashboard && payload.role !== 'teacher') {
                    finalResponse = NextResponse.redirect(new URL('/teacher', request.url));
                } else if (isStudentDashboard && payload.role !== 'student') {
                    finalResponse = NextResponse.redirect(new URL('/student', request.url));
                } else {
                    finalResponse = NextResponse.next();
                }
            } catch (error) {
                if (isAdminDashboard) finalResponse = NextResponse.redirect(new URL('/admin', request.url));
                else if (isTeacherDashboard) finalResponse = NextResponse.redirect(new URL('/teacher', request.url));
                else if (isStudentDashboard) finalResponse = NextResponse.redirect(new URL('/student', request.url));
                else finalResponse = NextResponse.json({ message: 'Session Revoked' }, { status: 401 });
            }
        }
    }
    // B. Redirect Logged-in users away from login pages
    else if (token && (isAdminLogin || isTeacherLogin || isStudentLogin)) {
        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            if (payload.role === 'admin' && isAdminLogin) {
                finalResponse = NextResponse.redirect(new URL('/admin-dashboard', request.url));
            } else if (payload.role === 'teacher' && isTeacherLogin) {
                finalResponse = NextResponse.redirect(new URL('/teacher-dashboard', request.url));
            } else if (payload.role === 'student' && isStudentLogin) {
                finalResponse = NextResponse.redirect(new URL('/student-dashboard', request.url));
            } else {
                finalResponse = NextResponse.next();
            }
        } catch (e) {
            finalResponse = NextResponse.next();
        }
    } else {
        finalResponse = NextResponse.next();
    }

    // Apply Security and Cache Headers to the final response
    finalResponse.headers.set('X-DNS-Prefetch-Control', 'on');
    finalResponse.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    finalResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
    finalResponse.headers.set('X-Content-Type-Options', 'nosniff');
    finalResponse.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    finalResponse.headers.set('X-XSS-Protection', '1; mode=block');
    finalResponse.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.dicebear.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https://res.cloudinary.com https://api.dicebear.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.whatsapp.com https://api.cloudinary.com;"
    );

    // Prevent caching for auth-related pages to fix iPhone/Safari issues
    if (isAdminDashboard || isTeacherDashboard || isStudentDashboard || isAdminLogin || isTeacherLogin || isStudentLogin) {
        finalResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
        finalResponse.headers.set('Pragma', 'no-cache');
        finalResponse.headers.set('Expires', '0');
    }

    return finalResponse;
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
