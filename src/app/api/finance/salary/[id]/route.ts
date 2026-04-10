
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Salary from '@/models/Salary';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;

        const salary = await Salary.findById(id).populate('teacherId');
        return NextResponse.json(salary);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();

        const updatedSalary = await Salary.findByIdAndUpdate(id, body, { returnDocument: 'after' });
        return NextResponse.json(updatedSalary);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
