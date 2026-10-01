import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import StaffSalary from '@/models/StaffSalary';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();

        const salary = await StaffSalary.findByIdAndUpdate(id, body, { new: true });
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
        const deleted = await StaffSalary.findByIdAndDelete(id);
        if (!deleted) return NextResponse.json({ message: "Record not found" }, { status: 404 });
        return NextResponse.json({ message: "Salary disbursement record deleted" });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
