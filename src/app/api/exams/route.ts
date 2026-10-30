import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { assertCanAccessStudent } from '@/lib/api/access';
import Exam from '@/models/Exam';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['teacher', 'admin']);
        const body = await req.json();

        const teacherId = user.role === 'teacher' ? user.id : body.teacherId || user.id;
        await assertCanAccessStudent(user, body.studentId);

        const paperImages = Array.isArray(body.paperImages) && body.paperImages.length > 0
            ? body.paperImages
            : (body.paperImageUrl || body.paperImage ? [body.paperImageUrl || body.paperImage] : []);
        const paperImage = paperImages[0] || body.paperImageUrl || body.paperImage || 'https://via.placeholder.com/150';

        const { _id, ...fields } = body;
        const newExam = new Exam({
            ...fields,
            teacherId,
            paperImages,
            paperImage
        });

        await newExam.save();
        return NextResponse.json(newExam, { status: 201 });
    } catch (err: any) {
        return errorResponse(err, 'POST /api/exams');
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
        return errorResponse(err, 'GET /api/exams');
    }
}
