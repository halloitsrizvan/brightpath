import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Task from '@/models/Task';
import dbConnect from '@/lib/mongodb';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();
        const updatedTask = await Task.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updatedTask);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        await Task.findByIdAndDelete(id);
        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
