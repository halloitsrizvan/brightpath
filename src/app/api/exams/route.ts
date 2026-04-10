import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import Exam from '@/models/Exam';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['teacher', 'admin']);
        const body = await req.json();

        const teacherId = user.role === 'teacher' ? user.id : body.teacherId || user.id;

        const newExam = new Exam({
            ...body,
            teacherId,
            paperImage: body.paperImageUrl || 'https://via.placeholder.com/150'
        });

        await newExam.save();
        return NextResponse.json(newExam, { status: 201 });
    } catch (err: any) {
        if (err.message && err.message.includes('Forbidden')) {
            return NextResponse.json({ message: err.message }, { status: 403 });
        }
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'student', 'teacher']);

        let query = {};
        if (user.role === 'student') {
            query = { studentId: user.id };
        } else if (user.role === 'teacher') {
            query = { teacherId: user.id };
        }

        const list = await Exam.find(query)
            .populate('studentId', 'fullName class')
            .populate('teacherId', 'name')
            .sort({ createdAt: -1 });
        return NextResponse.json(list);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
