import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Expense from '@/models/Expense';
import FounderSalary from '@/models/FounderSalary';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month');

        // Auto-sync the target month or the current month to ensure absolute real-time accuracy
        const currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date());
        const currentYear = new Date().getFullYear();
        const currentMonthStr = `${currentMonthName} ${currentYear}`;
        const syncMonth = month || currentMonthStr;

        try {
            const { syncFinancialsForMonth } = await import('@/lib/finance-sync');
            await syncFinancialsForMonth(syncMonth);
        } catch (syncErr) {
            console.error("On-the-fly financial sync failed:", syncErr);
        }

        // Fetch student bills: Unpaid fees
        const unpaidFeeQuery: any = { paymentStatus: { $ne: 'paid' } };
        if (month) unpaidFeeQuery.month = month;
        const unpaidFees = await Fee.find(unpaidFeeQuery).populate('studentId', 'fullName email class residentialLocation');

        // Fetch student bills: Paid fees
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let paidFeeQuery: any = { paymentStatus: 'paid' };
        if (month) {
            const [mName, yearStr] = month.split(' ');
            const yearNum = parseInt(yearStr);
            const mIndex = monthNames.indexOf(mName);
            if (mIndex !== -1 && !isNaN(yearNum)) {
                const startOfMonth = new Date(yearNum, mIndex, 1);
                const endOfMonth = new Date(yearNum, mIndex + 1, 0, 23, 59, 59);
                paidFeeQuery = {
                    paymentStatus: 'paid',
                    $or: [
                        { month },
                        { paymentDate: { $gte: startOfMonth, $lte: endOfMonth } }
                    ]
                };
            } else {
                paidFeeQuery = { paymentStatus: 'paid', month };
            }
        }
        let paidFees = await Fee.find(paidFeeQuery)
            .sort({ paymentDate: -1, createdAt: -1 })
            .populate('studentId', 'fullName email class residentialLocation');

        // If any paid fees belong to a multi-settlement, include all sibling fees in that settlement
        const settlementIds = Array.from(new Set(paidFees.map((f: any) => f.settlementId).filter(Boolean)));
        if (settlementIds.length > 0) {
            const existingIdSet = new Set(paidFees.map((f: any) => f._id.toString()));
            const siblings = await Fee.find({
                settlementId: { $in: settlementIds },
                _id: { $nin: Array.from(existingIdSet) }
            }).populate('studentId', 'fullName email class residentialLocation');
            if (siblings.length > 0) {
                paidFees = [...paidFees, ...siblings];
                paidFees.sort((a, b) => new Date(b.paymentDate || b.createdAt).getTime() - new Date(a.paymentDate || a.createdAt).getTime());
            }
        }

        // Fetch tutor salaries
        const salaryQuery = month ? { month } : {};
        const allSalaries = await Salary.find(salaryQuery).populate('teacherId', 'name email phone salaryPerHour');

        // Fetch expenses
        const expenseQuery = month ? { month } : {};
        const allExpenses = await Expense.find(expenseQuery);

        // Fetch founder salaries
        const founderSalQuery = month ? { month } : {};
        const allFounderSalaries = await FounderSalary.find(founderSalQuery);

        const unpaidSalaries = allSalaries.filter(s => s.paidStatus !== 'paid');
        const paidSalaries = allSalaries.filter(s => s.paidStatus === 'paid');

        const paidFounderSalaries = allFounderSalaries.filter(s => s.status === 'paid');

        // Calculate summary statistics
        const totalReceivable = unpaidFees.reduce((acc, fee) => acc + (fee.amount || 0), 0);
        const totalPayable = unpaidSalaries.reduce((acc, salary) => acc + (salary.totalSalary || 0), 0);
        const totalReceived = paidFees.reduce((acc, fee) => acc + (fee.amount || 0), 0);
        const totalDisbursed = paidSalaries.reduce((acc, salary) => acc + (salary.totalSalary || 0), 0);
        const totalExpenses = allExpenses.reduce((acc, exp) => acc + (exp.amount || 0), 0);
        const totalFounderSalaries = paidFounderSalaries.reduce((acc, s) => acc + (s.amount || 0), 0);

        return NextResponse.json({
            unpaidFees,
            paidFees,
            unpaidSalaries,
            paidSalaries,
            summary: {
                totalReceivable,
                totalPayable,
                totalReceived,
                totalDisbursed,
                totalExpenses,
                totalFounderSalaries,
                profit: totalReceived - (totalDisbursed + totalExpenses + totalFounderSalaries),
                netBalance: (totalReceivable + totalReceived) - (totalPayable + totalDisbursed + totalExpenses + totalFounderSalaries)
            }
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
