
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

        // Calculate hours per day for the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfMonth = new Date();
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);
        endOfMonth.setDate(0);
        endOfMonth.setHours(23, 59, 59, 999);

        const attendanceLogs = await Attendance.find({
            studentId: user.id,
            status: 'Present',
            date: { $gte: startOfMonth, $lte: endOfMonth }
        }).select('date durationMinutes');

        // Group by day
        const dailyHoursMap: { [key: string]: number } = {};
        attendanceLogs.forEach(log => {
            const day = new Date(log.date).getDate();
            dailyHoursMap[day] = (dailyHoursMap[day] || 0) + (log.durationMinutes / 60);
        });

        // Fill in all days of the month for the chart
        const daysInMonth = endOfMonth.getDate();
        const performanceData = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            return {
                day: day,
                hours: Number((dailyHoursMap[day] || 0).toFixed(1))
            };
        });

        return NextResponse.json({
            subjectsEnrolled: studentData.subjects?.length || 0,
            teachers: studentData.preferredTrainers || [],
            attendanceSummary: attendanceCount,
            performanceData
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
