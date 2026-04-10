
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import Fee from '@/models/Fee';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        const newFee = new Fee(body);
        await newFee.save();
        return NextResponse.json(newFee, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'student']);

        const { searchParams } = new URL(req.url);
        const studentId = searchParams.get('studentId');

        const filter = studentId ? { studentId } : {};
        const fees = await Fee.find(filter).populate('studentId', 'fullName email');
        return NextResponse.json(fees);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
