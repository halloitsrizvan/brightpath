import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'student']);
        const list = await Attendance.find({ studentId: params.id }).populate('teacherId', 'name');
        return NextResponse.json(list);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
