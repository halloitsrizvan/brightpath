import Student from '@/models/Student';
import type { AuthUser } from '@/lib/api/auth';

const forbidden = (what: string) => new Error(`Forbidden: Cannot access ${what}`);

/** Non-admins may only act on their own record. */
export function assertSelfOrAdmin(user: AuthUser, id: string, what = 'other users\' records') {
    if (user.role !== 'admin' && user.id !== String(id)) throw forbidden(what);
}

/** Students may only see themselves; teachers only students assigned to them. */
export async function assertCanAccessStudent(user: AuthUser, studentId: string) {
    if (user.role === 'admin') return;
    if (user.role === 'student') {
        if (user.id !== String(studentId)) throw forbidden('other students\' records');
        return;
    }
    const assigned = await Student.exists({
        _id: studentId,
        $or: [{ preferredTrainers: user.id }, { 'subjectAssignments.teacherId': user.id }]
    });
    if (!assigned) throw forbidden('students not assigned to you');
}

/** Copies only whitelisted keys, so request bodies cannot set arbitrary fields. */
export function pick<T extends Record<string, any>>(body: T, keys: readonly string[]): Partial<T> {
    const out: Record<string, any> = {};
    for (const key of keys) if (body?.[key] !== undefined) out[key] = body[key];
    return out as Partial<T>;
}

/** Enforces a minimum password strength for new or changed passwords. */
export function assertStrongPassword(password: unknown) {
    if (typeof password !== 'string' || password.length < 8) {
        throw Object.assign(new Error('Password must be at least 8 characters'), { name: 'ValidationError', expose: true });
    }
}
