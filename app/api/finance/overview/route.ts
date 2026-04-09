import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Expense from '@/models/Expense';
import FounderSalary from '@/models/FounderSalary';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month');

        // Fetch student bills
        const feeQuery = month ? { month } : {};
        const allFees = await Fee.find(feeQuery).populate('studentId', 'fullName email class residentialLocation');

        // Fetch tutor salaries
        const salaryQuery = month ? { month } : {};
        const allSalaries = await Salary.find(salaryQuery).populate('teacherId', 'name email phone salaryPerHour');

        // Fetch expenses
        const expenseQuery = month ? { month } : {};
        const allExpenses = await Expense.find(expenseQuery);

        // Fetch founder salaries
        const founderSalQuery = month ? { month } : {};
        const allFounderSalaries = await FounderSalary.find(founderSalQuery);

        // Split into paid/unpaid
        const unpaidFees = allFees.filter(f => f.paymentStatus !== 'paid');
        const paidFees = allFees.filter(f => f.paymentStatus === 'paid');

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
