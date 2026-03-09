
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['student']);

        const studentData = await Student.findById(user.id).select('subjects preferredTrainers');
        if (!studentData) return NextResponse.json({ message: 'Student not found' }, { status: 404 });

        const attendanceCount = await Attendance.countDocuments({
            studentId: user.id,
            status: 'Present'
        });

        return NextResponse.json({
            subjectsEnrolled: studentData.subjects?.length || 0,
            teachers: studentData.preferredTrainers || [],
            attendanceSummary: attendanceCount
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
