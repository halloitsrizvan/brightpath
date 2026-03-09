import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Teacher from '@/models/Teacher';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['teacher']);

        const teacherContent = await Teacher.findById(user.id).populate('students');
        if (!teacherContent) return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const classesTakenToday = await Attendance.countDocuments({ teacherId: user.id, date: { $gte: today } });

        const estimatedSalary = (teacherContent.totalTeachingHours || 0) * (teacherContent.salaryPerHour || 0);

        return NextResponse.json({
            totalStudentsAssigned: teacherContent.students.length,
            classesTakenToday,
            totalHoursThisMonth: teacherContent.totalTeachingHours,
            salaryEstimate: estimatedSalary
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
