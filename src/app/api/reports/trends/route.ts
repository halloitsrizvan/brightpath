import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';

// Ensure models
import '@/models/Student';
import '@/models/Teacher';
import '@/models/Subject';
import '@/models/Fee';
import '@/models/Salary';
import '@/models/Expense';
import '@/models/FounderSalary';
import '@/models/Exam';
import '@/models/Attendance';

import Attendance from '@/models/Attendance';
import Exam from '@/models/Exam';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Expense from '@/models/Expense';
import FounderSalary from '@/models/FounderSalary';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const { searchParams } = new URL(req.url);
        const endMonthStr = searchParams.get('month'); // e.g. "September 2026"
        const count = parseInt(searchParams.get('count') || '6');

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        let baseDate = new Date();
        if (endMonthStr) {
            const parts = endMonthStr.trim().split(/\s+/);
            if (parts.length >= 2) {
                const mIdx = monthNames.indexOf(parts[0]);
                const y = parseInt(parts[1]);
                if (mIdx !== -1 && !isNaN(y)) {
                    baseDate = new Date(y, mIdx, 1);
                }
            }
        }

        // Generate the list of months in chronological order
        const monthsList: { full: string; short: string; year: number; start: Date; end: Date }[] = [];
        for (let i = count - 1; i >= 0; i--) {
            const d = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
            const mIndex = d.getMonth();
            const y = d.getFullYear();
            const full = `${monthNames[mIndex]} ${y}`;
            const short = `${shortMonths[mIndex]} '${String(y).slice(-2)}`;
            const start = new Date(y, mIndex, 1);
            const end = new Date(y, mIndex + 1, 0, 23, 59, 59, 999);
            monthsList.push({ full, short, year: y, start, end });
        }

        const trendPoints = await Promise.all(monthsList.map(async (m) => {
            const fees = await Fee.find({ month: m.full });
            const salaries = await Salary.find({ month: m.full });
            const expenses = await Expense.find({ month: m.full });
            const founderSalaries = await FounderSalary.find({ month: m.full });

            const revenue = fees.filter(f => f.paymentStatus === 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
            const receivable = fees.filter(f => f.paymentStatus !== 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
            const payroll = salaries.filter(s => s.paidStatus === 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
            const totalExp = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
            const founderPayouts = founderSalaries.filter(s => s.status === 'paid').reduce((acc, s) => acc + (s.amount || 0), 0);
            const netProfit = revenue - (payroll + totalExp + founderPayouts);

            const attendances = await Attendance.find({
                date: { $gte: m.start, $lte: m.end },
                status: 'Present'
            });
            const minutes = attendances.reduce((acc, a) => acc + (a.durationMinutes || 0), 0);
            const hours = parseFloat((minutes / 60).toFixed(1));
            const sessions = attendances.length;

            const exams = await Exam.find({
                $or: [
                    { examMonth: m.full },
                    { examDate: { $gte: m.start, $lte: m.end } }
                ]
            });
            const examAvg = exams.length > 0 
                ? parseFloat(((exams.reduce((acc, e) => acc + (e.marks / e.maxMarks), 0) / exams.length) * 100).toFixed(1))
                : 0;

            return {
                month: m.full,
                shortMonth: m.short,
                revenue,
                receivable,
                payroll,
                expenses: totalExp,
                netProfit,
                hours,
                sessions,
                examAverage: examAvg,
                profitMargin: revenue > 0 ? parseFloat(((netProfit / revenue) * 100).toFixed(1)) : 0
            };
        }));

        return NextResponse.json({
            trends: trendPoints
        });

    } catch (err: any) {
        console.error("Trends API Error:", err);
        return errorResponse(err);
    }
}
