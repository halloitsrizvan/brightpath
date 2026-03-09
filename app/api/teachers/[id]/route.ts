import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/mongodb';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();
        const { id } = await params;
        const updated = await Teacher.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        await Teacher.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Teacher deleted' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
