import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import Teacher from '@/models/Teacher';
import Student from '@/models/Student';
import Role from '@/models/Role';
import { DEFAULT_ROLES, getRolePermissionsMap, PagePermission } from '@/lib/constants/roles';

// Sessions do not expire in practice: tokens last 10 years and the middleware keeps
// refreshing the cookie (browsers cap a cookie at ~400 days) while the user is active.
export const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 365 * 10;
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 400;

/** Returns the JWT secret, refusing to run with a missing or trivially weak one. */
export function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 16 || secret === 'secret') {
        throw new Error('Server misconfiguration: JWT_SECRET is missing or too weak');
    }
    return secret;
}

export function signToken(payload: { id: string; role: string }) {
    return jwt.sign(payload, getJwtSecret(), { algorithm: 'HS256', expiresIn: TOKEN_TTL_SECONDS });
}

/**
 * Maps admin API paths to the admin page whose permission governs them.
 * `openRead` marks shared reference data (students, subjects, ...) that other admin pages
 * read, so any admin may GET it; writes always need "full" access on the page.
 */
const ADMIN_ROUTE_PERMISSIONS: { prefix: string; pageId: string; openRead?: boolean; superAdminWrite?: boolean }[] = [
    // Admin accounts and role definitions decide everyone's access, so only Super Admins may change them
    { prefix: '/api/admin/roles', pageId: 'founders', openRead: true, superAdminWrite: true },
    { prefix: '/api/admin/founders', pageId: 'founders', superAdminWrite: true },
    { prefix: '/api/admin/staffs', pageId: 'staffs' },
    { prefix: '/api/admin/tasks', pageId: 'tasks' },
    { prefix: '/api/admin/incentives', pageId: 'incentives' },
    { prefix: '/api/admin/blog', pageId: 'blog' },
    { prefix: '/api/admin/goals', pageId: 'dashboard', openRead: true },
    { prefix: '/api/dashboard/admin', pageId: 'dashboard' },
    { prefix: '/api/teacher/incentive-progress', pageId: 'incentives', openRead: true },
    { prefix: '/api/leads', pageId: 'leads' },
    { prefix: '/api/finance', pageId: 'finance' },
    { prefix: '/api/expenses', pageId: 'expenses' },
    { prefix: '/api/reports', pageId: 'reports' },
    { prefix: '/api/students', pageId: 'students', openRead: true },
    { prefix: '/api/teachers', pageId: 'teachers', openRead: true },
    { prefix: '/api/subjects', pageId: 'subjects', openRead: true },
    { prefix: '/api/attendance', pageId: 'attendance', openRead: true },
    { prefix: '/api/exams', pageId: 'exams', openRead: true }
];

export interface AuthUser {
    id: string;
    role: 'admin' | 'teacher' | 'student';
    email?: string;
    name?: string;
    adminRole?: string;
    isSuperAdmin?: boolean;
    permissions?: Record<string, PagePermission>;
}

async function resolveAdminPermissions(admin: any) {
    const roleName = (admin.adminRole || 'Super Admin').trim();
    if (roleName.toLowerCase() === 'super admin') return { isSuperAdmin: true, permissions: undefined };

    const escaped = roleName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const role = await Role.findOne({ name: new RegExp(`^${escaped}$`, 'i') }).lean()
        || DEFAULT_ROLES.find(r => r.name.toLowerCase() === roleName.toLowerCase());

    // Unknown role names only keep full access for founders (the owners); everyone else gets none.
    if (!role) return admin.isFounder
        ? { isSuperAdmin: true, permissions: undefined }
        : { isSuperAdmin: false, permissions: {} };

    return { isSuperAdmin: false, permissions: getRolePermissionsMap(role as any) };
}

function enforceAdminPermission(req: NextRequest, user: AuthUser) {
    if (user.isSuperAdmin) return;

    const pathname = new URL(req.url).pathname;
    const rule = ADMIN_ROUTE_PERMISSIONS.find(r => pathname.startsWith(r.prefix));
    if (!rule) return;

    const isRead = req.method === 'GET' || req.method === 'HEAD';
    const access = user.permissions?.[rule.pageId]?.access || 'none';

    if (isRead && (rule.openRead || access !== 'none')) return;
    if (!isRead && access === 'full' && !rule.superAdminWrite) return;

    throw new Error(`Forbidden: Your role does not have ${isRead ? 'access to' : 'edit rights on'} ${rule.pageId}`);
}

export async function checkAuth(req: NextRequest, roles: string[] = []): Promise<AuthUser> {
    await dbConnect();

    const authHeader = req.headers.get('authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (!token) {
        token = req.cookies.get('token')?.value;
    }

    if (!token) {
        try {
            const cookieStore = await cookies();
            token = cookieStore.get('token')?.value;
        } catch (e) {}
    }

    if (!token) {
        throw new Error('No token, authorization denied');
    }

    let decoded: any;
    try {
        decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] }) as any;
    } catch (err: any) {
        if (err.message?.startsWith('Server misconfiguration')) throw err;
        throw new Error(err.name === 'TokenExpiredError' ? 'jwt expired' : 'Token is not valid');
    }

    // The account must still exist and still hold the role the token claims
    const Model = decoded.role === 'admin' ? Admin : decoded.role === 'teacher' ? Teacher : decoded.role === 'student' ? Student : null;
    const account: any = Model && await Model.findById(decoded.id).select('role adminRole isFounder email name fullName').lean();
    if (!account || (account.role || decoded.role) !== decoded.role) {
        throw new Error('Session Revoked: Token is not valid');
    }

    if (roles.length && !roles.includes(decoded.role)) {
        throw new Error('Forbidden: Insufficient permissions');
    }

    const user: AuthUser = { id: String(decoded.id), role: decoded.role, email: account.email, name: account.name || account.fullName };

    if (user.role === 'admin') {
        Object.assign(user, { adminRole: account.adminRole || 'Super Admin' }, await resolveAdminPermissions(account));
        enforceAdminPermission(req, user);
    }

    return user;
}

/** Maps an error thrown in a route to a safe response, without leaking internals. */
export function errorResponse(err: any, context = 'API') {
    const message: string = err?.message || '';
    if (message.includes('Forbidden')) return NextResponse.json({ message }, { status: 403 });
    if (/authorization denied|Token is not valid|jwt expired|Session Revoked/.test(message)) {
        return NextResponse.json({ message }, { status: 401 });
    }
    if (err?.expose) return NextResponse.json({ message }, { status: 400 });
    if (err?.name === 'ValidationError' || err?.name === 'CastError') {
        return NextResponse.json({ message: 'Invalid request data' }, { status: 400 });
    }
    console.error(`${context} error:`, err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
}

export function authHandler(handler: Function, roles: string[] = []) {
    return async (req: NextRequest, ...args: any[]) => {
        try {
            const user = await checkAuth(req, roles);
            return await handler(req, { ...args[0], user });
        } catch (err: any) {
            if (err.message.includes('Forbidden')) return NextResponse.json({ message: err.message }, { status: 403 });
            return NextResponse.json({ message: err.message }, { status: 401 });
        }
    };
}
