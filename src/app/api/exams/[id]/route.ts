import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse, AuthUser } from '@/lib/api/auth';

/** Teachers may only work with exams they created; admins with any. */
async function findAccessibleExam(user: AuthUser, id: string) {
    const exam = await Exam.findById(id).select('teacherId').lean() as any;
    if (!exam) return null;
    if (user.role === 'teacher' && String(exam.teacherId) !== user.id) {
        throw new Error("Forbidden: Cannot access other teachers' exams");
    }
    return exam;
}
import Exam from '@/models/Exam';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;
        if (!await findAccessibleExam(user, id)) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
        const exam = await Exam.findById(id).populate('studentId', 'fullName class contactNumber phone');
        if (!exam) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
        return NextResponse.json(exam);
    } catch (err: any) {
        return errorResponse(err, 'Exam');
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;
        if (!await findAccessibleExam(user, id)) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
        const body = await req.json();

        // Remove _id from body to prevent MongoDB update error
        if (body._id) delete body._id;
        // Teachers cannot hand an exam to another teacher or student
        if (user.role === 'teacher') {
            delete body.teacherId;
            delete body.studentId;
        }

        if (Array.isArray(body.paperImages)) {
            body.paperImage = body.paperImages[0] || '';
        }

        const updated = await Exam.findByIdAndUpdate(id, body, { new: true });
        if (!updated) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });

        return NextResponse.json(updated);
    } catch (err: any) {
        return errorResponse(err, 'Exam');
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;
        if (!await findAccessibleExam(user, id)) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });

        const deleted = await Exam.findByIdAndDelete(id);
        if (!deleted) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });

        return NextResponse.json({ message: 'Exam deleted successfully' });
    } catch (err: any) {
        return errorResponse(err, 'Exam');
    }
}
