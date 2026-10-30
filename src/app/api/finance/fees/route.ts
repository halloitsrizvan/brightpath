
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
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
        return errorResponse(err);
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'student']);

        const { searchParams } = new URL(req.url);
        // Students always get their own fees, whatever they ask for
        const studentId = user.role === 'student' ? user.id : searchParams.get('studentId');

        const filter = studentId ? { studentId } : {};
        const fees = await Fee.find(filter).populate('studentId', 'fullName email');
        return NextResponse.json(fees);
    } catch (err: any) {
        return errorResponse(err);
    }
}
