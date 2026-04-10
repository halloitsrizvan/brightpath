import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import Exam from '@/models/Exam';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;
        const list = await Exam.find({ teacherId: id }).populate('studentId', 'fullName class contactNumber phone');
        return NextResponse.json(list);
    } catch (err: any) {
        if (err.message && err.message.includes('Forbidden')) {
            return NextResponse.json({ message: err.message }, { status: 403 });
        }
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
