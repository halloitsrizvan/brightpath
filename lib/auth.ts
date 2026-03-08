import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from './mongodb';

export async function checkAuth(req: NextRequest, roles: string[] = []) {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        throw new Error('No token, authorization denied');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

        if (roles.length && !roles.includes(decoded.role)) {
            throw new Error('Forbidden: Insufficient permissions');
        }

        return decoded;
    } catch (err) {
        throw new Error('Token is not valid');
    }
}

export function authHandler(handler: Function, roles: string[] = []) {
    return async (req: NextRequest, ...args: any[]) => {
        try {
            const user = await checkAuth(req, roles);
            // Attach user to req (NextRequest is immutable, so we pass context or create a wrapper req if needed
            // but in Next.js 13+, it's simpler to just pass user object into the handler)
            return await handler(req, { ...args[0], user });
        } catch (err: any) {
            if (err.message.includes('Forbidden')) return NextResponse.json({ message: err.message }, { status: 403 });
            return NextResponse.json({ message: err.message }, { status: 401 });
        }
    };
}
