import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Exam from '@/models/Exam';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'student', 'teacher']);
        const list = await Exam.find({ studentId: params.id }).populate('teacherId', 'name');
        return NextResponse.json(list);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
