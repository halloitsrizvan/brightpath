import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher', 'student']);
        const { id } = await params;
        const student = await Student.findById(id).populate('preferredTrainers', 'name');
        return NextResponse.json(student);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();
        const { id } = await params;
        const updated = await Student.findByIdAndUpdate(id, body, { new: true });
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
        await Student.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Student deleted' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
