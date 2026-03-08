import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Fee from '@/models/Fee';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: { studentId: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'student']);

        const fees = await Fee.find({ studentId: params.studentId });
        return NextResponse.json(fees);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
