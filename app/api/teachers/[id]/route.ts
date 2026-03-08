import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();
        const updated = await Teacher.findByIdAndUpdate(params.id, body, { new: true });
        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        await Teacher.findByIdAndDelete(params.id);
        return NextResponse.json({ message: 'Teacher deleted' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
