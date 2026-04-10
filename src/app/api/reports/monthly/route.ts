import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Attendance from '@/models/Attendance';
import Exam from '@/models/Exam';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Expense from '@/models/Expense';
import FounderSalary from '@/models/FounderSalary';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const { searchParams } = new URL(req.url);
        const monthStr = searchParams.get('month');

        if (!monthStr) {
            return NextResponse.json({ message: "Month selection is required" }, { status: 400 });
        }

        // Parse month string (e.g., "April 2026")
        const [monthName, yearStr] = monthStr.split(' ');
        const year = parseInt(yearStr);
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

        // 1. Financial Data
        const fees = await Fee.find({ month: monthStr }).populate('studentId', 'fullName class');
        const salaries = await Salary.find({ month: monthStr }).populate('teacherId', 'name salaryPerHour');
        const expenses = await Expense.find({ month: monthStr });
        const founderSalaries = await FounderSalary.find({ month: monthStr });

        // Financial Summary
        const totalReceived = fees.filter(f => f.paymentStatus === 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const totalReceivable = fees.filter(f => f.paymentStatus !== 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const totalDisbursed = salaries.filter(s => s.paidStatus === 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
        const totalPayable = salaries.filter(s => s.paidStatus !== 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
        const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
        const totalFounderSalaries = founderSalaries.filter(s => s.status === 'paid').reduce((acc, s) => acc + (s.amount || 0), 0);

        // 2. Attendance Data
        const attendanceLogs = await Attendance.find({
            date: { $gte: startDate, $lte: endDate }
        }).populate('studentId', 'fullName').populate('teacherId', 'name').populate('subjectId', 'name').sort({ date: -1 });

        const totalTeachingMinutes = attendanceLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0);
        const totalSessions = attendanceLogs.length;

        // Group attendance by teacher for analysis
        const teacherStats: any = {};
        attendanceLogs.forEach(log => {
            const tName = log.teacherId?.name || 'Unknown';
            if (!teacherStats[tName]) teacherStats[tName] = { minutes: 0, sessions: 0 };
            teacherStats[tName].minutes += log.durationMinutes || 0;
            teacherStats[tName].sessions += 1;
        });

        // 3. Exam Data
        const exams = await Exam.find({
            $or: [
                { examMonth: monthStr },
                { examDate: { $gte: startDate, $lte: endDate } }
            ]
        }).populate('studentId', 'fullName').sort({ examDate: -1 });

        const avgMarksPercent = exams.length > 0 
            ? (exams.reduce((acc, e) => acc + (e.marks / e.maxMarks), 0) / exams.length) * 100 
            : 0;

        return NextResponse.json({
            month: monthStr,
            financials: {
                summary: {
                    totalReceived,
                    totalReceivable,
                    totalDisbursed,
                    totalPayable,
                    totalExpenses,
                    totalFounderSalaries,
                    netProfit: totalReceived - (totalDisbursed + totalExpenses + totalFounderSalaries)
                },
                fees,
                salaries,
                expenses
            },
            attendance: {
                totalSessions,
                totalHours: (totalTeachingMinutes / 60).toFixed(1),
                logs: attendanceLogs,
                teacherStats: Object.entries(teacherStats).map(([name, stats]: any) => ({
                    name,
                    hours: (stats.minutes / 60).toFixed(1),
                    sessions: stats.sessions
                }))
            },
            exams: {
                count: exams.length,
                averagePerformance: avgMarksPercent.toFixed(1),
                records: exams
            }
        });

    } catch (err: any) {
        console.error("Monthly Report Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
