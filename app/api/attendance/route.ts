import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Attendance from '@/models/Attendance';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['teacher', 'admin']);
        const body = await req.json();

        // If the user is an admin running the teacher dashboard, 
        // they might not have a Teacher profile to augment.
        const teacherId = user.role === 'teacher' ? user.id : body.teacherId || user.id;

        const attendance = new Attendance({ ...body, teacherId });
        await attendance.save();

        if (user.role === 'teacher') {
            const teacher = await Teacher.findById(user.id);
            if (teacher) {
                teacher.totalTeachingHours += (body.durationMinutes / 60);
                await teacher.save();
            }
        }

        return NextResponse.json(attendance, { status: 201 });
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
        await checkAuth(req, ['admin']);
        const list = await Attendance.find().populate('studentId', 'fullName').populate('teacherId', 'name');
        return NextResponse.json(list);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
