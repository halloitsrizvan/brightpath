import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import FounderSalary from '@/models/FounderSalary';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();

        const salary = await FounderSalary.findByIdAndUpdate(id, body, { new: true });
        if (!salary) return NextResponse.json({ message: "Salary record not found" }, { status: 404 });

        return NextResponse.json(salary);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        await FounderSalary.findByIdAndDelete(id);
        return NextResponse.json({ message: "Record deleted" });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
