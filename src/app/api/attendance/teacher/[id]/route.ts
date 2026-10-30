import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { assertSelfOrAdmin } from '@/lib/api/access';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;
        assertSelfOrAdmin(user, id, "other teachers' attendance");
        const list = await Attendance.find({ teacherId: id }).populate('studentId', 'fullName');
        return NextResponse.json(list);
    } catch (err: any) {
        return errorResponse(err, 'Teacher Attendance');
    }
}
