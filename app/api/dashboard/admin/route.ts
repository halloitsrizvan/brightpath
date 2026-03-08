import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const totalStudents = await Student.countDocuments();
        const totalTeachers = await Teacher.countDocuments();

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        const classesThisMonth = await Attendance.countDocuments({ date: { $gte: startOfMonth } });

        const monthlyRevenue = totalStudents * 100;

        return NextResponse.json({
            totalStudents,
            totalTeachers,
            classesThisMonth,
            monthlyRevenue
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
