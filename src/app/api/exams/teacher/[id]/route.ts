import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { assertSelfOrAdmin } from '@/lib/api/access';
import Exam from '@/models/Exam';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;
        assertSelfOrAdmin(user, id, "other teachers' exams");
        const list = await Exam.find({ teacherId: id }).populate('studentId', 'fullName class contactNumber phone');
        return NextResponse.json(list);
    } catch (err: any) {
        return errorResponse(err, 'Teacher Exams');
    }
}
