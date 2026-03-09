import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import IncentiveRule from '@/models/IncentiveRule';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();
        const updated = await IncentiveRule.findByIdAndUpdate(id, body, { new: true });
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
        await IncentiveRule.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Incentive discarded successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
