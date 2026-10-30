import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// No fallback: without a real secret every token is rejected instead of being forgeable
const JWT_SECRET = process.env.JWT_SECRET && process.env.JWT_SECRET !== 'secret'
    ? new TextEncoder().encode(process.env.JWT_SECRET)
    : null;

const verifyToken = async (token: string) => {
    if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured');
    return jwtVerify(token, JWT_SECRET, { algorithms: ['HS256'] });
};

// Browsers cap cookie lifetime at ~400 days, so the session cookie is re-issued on every
// dashboard visit; active users therefore stay logged in indefinitely.
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 400;

const isDev = process.env.NODE_ENV !== 'production';
const CONTENT_SECURITY_POLICY = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://connect.facebook.net https://www.googletagmanager.com`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' blob: data: https://res.cloudinary.com https://api.dicebear.com https://www.facebook.com https://www.google-analytics.com https://www.googletagmanager.com https://via.placeholder.com https://www.transparenttextures.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.whatsapp.com https://api.cloudinary.com https://www.facebook.com https://connect.facebook.net https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
].join('; ') + ';';
export async function middleware(request: NextRequest) {
    const host = request.headers.get('host') || '';
    const proto = request.headers.get('x-forwarded-proto') || '';

    // Enforce HTTPS and WWW redirect for production domains
    const isProdDomain = host.includes('brightpatheduvora.com');
    if (isProdDomain && (host === 'brightpatheduvora.com' || proto === 'http')) {
        const targetHost = host === 'brightpatheduvora.com' ? 'www.brightpatheduvora.com' : host;
        const targetUrl = new URL(
            request.nextUrl.pathname + request.nextUrl.search,
            `https://${targetHost}`
        );
        return NextResponse.redirect(targetUrl, 301);
    }

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
                const { payload } = await verifyToken(token);
                
                if (isAdminDashboard && payload.role !== 'admin') {
                    finalResponse = NextResponse.redirect(new URL('/admin', request.url));
                } else if (isTeacherDashboard && payload.role !== 'teacher') {
                    finalResponse = NextResponse.redirect(new URL('/teacher', request.url));
                } else if (isStudentDashboard && payload.role !== 'student') {
                    finalResponse = NextResponse.redirect(new URL('/student', request.url));
                } else if (isApiAdminRoute && payload.role !== 'admin') {
                    finalResponse = NextResponse.json({ message: 'Forbidden: Insufficient permissions' }, { status: 403 });
                } else {
                    finalResponse = NextResponse.next();
                    if (!isApiAdminRoute) {
                        finalResponse.cookies.set({
                            name: 'token',
                            value: token,
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: SESSION_COOKIE_MAX_AGE
                        });
                        // The readable "user" profile cookie used by the dashboards has the same cap
                        const userCookie = request.cookies.get('user')?.value;
                        if (userCookie) {
                            finalResponse.cookies.set({
                                name: 'user',
                                value: userCookie,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                path: '/',
                                maxAge: SESSION_COOKIE_MAX_AGE
                            });
                        }
                    }
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
            const { payload } = await verifyToken(token);
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
    finalResponse.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);

    // Prevent caching for auth-related pages to fix iPhone/Safari issues
    if (isAdminDashboard || isTeacherDashboard || isStudentDashboard || isAdminLogin || isTeacherLogin || isStudentLogin) {
        finalResponse.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
        finalResponse.headers.set('Pragma', 'no-cache');
        finalResponse.headers.set('Expires', '0');
        finalResponse.headers.set('Vary', 'Cookie');
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
