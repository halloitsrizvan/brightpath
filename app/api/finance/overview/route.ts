
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        // Fetch unpaid student bills
        const unpaidFees = await Fee.find({
            paymentStatus: { $ne: 'paid' }
        }).populate('studentId', 'fullName email class residentialLocation');

        // Fetch unpaid tutor salaries
        const unpaidSalaries = await Salary.find({
            paidStatus: { $ne: 'paid' }
        }).populate('teacherId', 'name email phone salaryPerHour');

        // Calculate summary statistics
        const totalReceivable = unpaidFees.reduce((acc, fee) => acc + (fee.amount || 0), 0);
        const totalPayable = unpaidSalaries.reduce((acc, salary) => acc + (salary.totalSalary || 0), 0);

        return NextResponse.json({
            unpaidFees,
            unpaidSalaries,
            summary: {
                totalReceivable,
                totalPayable,
                netBalance: totalReceivable - totalPayable
            }
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
