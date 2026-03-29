import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Expense from '@/models/Expense';
import dbConnect from '@/lib/mongodb';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = params;

        await Expense.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Expense record deleted' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = params;
        const body = await req.json();

        const updated = await Expense.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
