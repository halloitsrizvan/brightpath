import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['student']);

        const student = await Student.findById(user.id).populate('teacherIds');
        const attendance = await Attendance.find({ studentId: user.id });

        if (!student) return NextResponse.json({ message: 'Student not found' }, { status: 404 });

        return NextResponse.json({
            subjectsEnrolled: student.subjects.length,
            teachers: student.teacherIds,
            attendanceSummary: attendance.length
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
