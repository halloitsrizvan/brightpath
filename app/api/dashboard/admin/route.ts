import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Attendance from '@/models/Attendance';
import Fee from '@/models/Fee';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const totalStudents = await Student.countDocuments({ status: "active" });
        const totalTeachers = await Teacher.countDocuments({ status: "active" });

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const classesThisMonth = await Attendance.countDocuments({ date: { $gte: startOfMonth } });

        // Calculate Monthly Revenue (Real Paid Fees)
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const now = new Date();
        const currentMonthStr = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
        
        const paidFees = await Fee.find({ month: currentMonthStr, paymentStatus: 'paid' });
        const monthlyRevenue = paidFees.reduce((acc, f) => acc + (f.amount || 0), 0);

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
