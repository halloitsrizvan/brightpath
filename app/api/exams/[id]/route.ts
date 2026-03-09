import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Exam from '@/models/Exam';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;
        const exam = await Exam.findById(id).populate('studentId', 'fullName class contactNumber phone');
        if (!exam) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });
        return NextResponse.json(exam);
    } catch (err: any) {
        if (err.message && err.message.includes('Forbidden')) return NextResponse.json({ message: err.message }, { status: 403 });
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;
        const body = await req.json();

        // Remove _id from body to prevent MongoDB update error
        if (body._id) delete body._id;

        const updated = await Exam.findByIdAndUpdate(id, body, { new: true });
        if (!updated) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });

        return NextResponse.json(updated);
    } catch (err: any) {
        if (err.message && err.message.includes('Forbidden')) return NextResponse.json({ message: err.message }, { status: 403 });
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;

        const deleted = await Exam.findByIdAndDelete(id);
        if (!deleted) return NextResponse.json({ message: 'Exam not found' }, { status: 404 });

        return NextResponse.json({ message: 'Exam deleted successfully' });
    } catch (err: any) {
        if (err.message && err.message.includes('Forbidden')) return NextResponse.json({ message: err.message }, { status: 403 });
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
