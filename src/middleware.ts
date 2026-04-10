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

    if (isApiAdminRoute || isAdminDashboard) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            if (isAdminDashboard) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            return NextResponse.json({ message: 'Identity Required' }, { status: 401 });
        }

        try {
            const { payload } = await jwtVerify(token, JWT_SECRET);
            
            // Further role-based checks at the edge
            if (payload.role !== 'admin' && (isAdminDashboard || isApiAdminRoute)) {
                 if (isAdminDashboard) return NextResponse.redirect(new URL('/admin', request.url));
                 return NextResponse.json({ message: 'Insufficient Privilege' }, { status: 403 });
            }
        } catch (error) {
            if (isAdminDashboard) return NextResponse.redirect(new URL('/admin', request.url));
            return NextResponse.json({ message: 'Session Revoked' }, { status: 401 });
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
