import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { assertCanAccessStudent } from '@/lib/api/access';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'student']);
        const { id } = await params;
        await assertCanAccessStudent(user, id);
        const list = await Attendance.find({ studentId: id }).populate('teacherId', 'name');
        return NextResponse.json(list);
    } catch (err: any) {
        return errorResponse(err, 'Student Attendance');
    }
}
