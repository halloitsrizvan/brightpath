
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Fee from '@/models/Fee';
import dbConnect from '@/lib/mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        const updatedFee = await Fee.findByIdAndUpdate(params.id, body, { new: true });
        return NextResponse.json(updatedFee);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
