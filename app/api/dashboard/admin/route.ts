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

        // DATE RANGES
        const now = new Date();
        const startOfCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPrev = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const classesThisMonth = await Attendance.countDocuments({ date: { $gte: startOfCurrent } });

        // Calculate Monthly Revenue (Real Paid Fees)
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonthStr = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
        
        const paidFees = await Fee.find({ month: currentMonthStr, paymentStatus: 'paid' });
        const monthlyRevenue = paidFees.reduce((acc, f) => acc + (f.amount || 0), 0);

        // AGGREGATION FUNCTION
        const getHoursByDay = async (start: Date, end: Date) => {
            return await Attendance.aggregate([
                {
                    $match: {
                        date: { $gte: start, $lte: end },
                        status: 'Present'
                    }
                },
                {
                    $group: {
                        _id: { $dayOfMonth: "$date" },
                        totalMinutes: { $sum: "$durationMinutes" }
                    }
                },
                {
                    $project: {
                        day: "$_id",
                        hours: { $round: [{ $divide: ["$totalMinutes", 60] }, 1] }
                    }
                }
            ]);
        };

        const [currentHours, prevHours] = await Promise.all([
            getHoursByDay(startOfCurrent, now),
            getHoursByDay(startOfPrev, endOfPrev)
        ]);

        // Unify for dual-line graph
        // We use days 1 to 31. If current month hasn't reached that day, we show 0 (or stop at today)
        // User wants "compare with pre month", so we should show both lines clearly.
        const todayNum = now.getDate();
        const velocityData = Array.from({ length: 31 }, (_, i) => {
            const dayNum = i + 1;
            const cData = currentHours.find(d => d.day === dayNum);
            const pData = prevHours.find(d => d.day === dayNum);
            
            return {
                day: dayNum,
                current: dayNum <= todayNum ? (cData ? cData.hours : 0) : null,
                previous: pData ? pData.hours : 0
            };
        });

        const latestLogs = await Attendance.find()
            .populate('studentId', 'fullName')
            .populate('teacherId', 'name')
            .populate('subjectId', 'subjectName')
            .sort({ date: -1 })
            .limit(3);

        return NextResponse.json({
            totalStudents,
            totalTeachers,
            classesThisMonth,
            monthlyRevenue,
            velocityData, // New unified data
            latestLogs,
            hoursPerDay: velocityData.map(d => ({ day: d.day, hours: d.current || 0 })) // Backward compatibility
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
