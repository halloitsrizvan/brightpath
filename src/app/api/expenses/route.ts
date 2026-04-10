import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import Expense from '@/models/Expense';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin']);
        const body = await req.json();

        const now = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthStr = body.month || `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

        const newExpense = new Expense({
            ...body,
            month: monthStr,
            addedBy: user.id
        });

        await newExpense.save();
        return NextResponse.json(newExpense, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const { searchParams } = new URL(req.url);
        const monthFilter = searchParams.get('month');

        let query = {};
        if (monthFilter) {
            query = { month: monthFilter };
        }

        const list = await Expense.find(query).sort({ date: -1 });
        return NextResponse.json(list);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
