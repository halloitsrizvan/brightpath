import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import StaffSalary from '@/models/StaffSalary';
import Admin from '@/models/Admin';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month');
        const staffId = searchParams.get('staffId');

        const query: any = {};
        if (month) query.month = month;
        if (staffId) query.staffId = staffId;

        const salaries = await StaffSalary.find(query)
            .populate({
                path: 'staffId',
                select: 'name email adminRole role baseSalary'
            })
            .sort({ createdAt: -1 });

        return NextResponse.json(salaries);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        if (!body.staffId || !body.amount || !body.month) {
            return NextResponse.json({ message: 'Staff, amount and month are required' }, { status: 400 });
        }

        const salary = await StaffSalary.create({
            staffId: body.staffId,
            amount: Number(body.amount),
            month: body.month,
            status: body.status || 'paid',
            paymentDate: body.paymentDate ? new Date(body.paymentDate) : new Date(),
            paymentMethod: body.paymentMethod || 'Bank Transfer',
            notes: body.notes || ''
        });

        const populated = await StaffSalary.findById(salary._id).populate({
            path: 'staffId',
            select: 'name email adminRole role baseSalary'
        });

        return NextResponse.json(populated);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
