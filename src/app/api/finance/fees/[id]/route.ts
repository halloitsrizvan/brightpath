
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import Fee from '@/models/Fee';
import dbConnect from '@/lib/db/mongodb';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();

        const updatedFee = await Fee.findByIdAndUpdate(id, body, { returnDocument: 'after' });
        return NextResponse.json(updatedFee);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
