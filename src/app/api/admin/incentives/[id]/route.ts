import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import IncentiveRule from '../../../../../models/IncentiveRule';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();
        const updated = await IncentiveRule.findByIdAndUpdate(id, body, { new: true });
        return NextResponse.json(updated);
    } catch (err: any) {
        console.error('API Error (PUT /api/admin/incentives):', err);
        return errorResponse(err);
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
        console.error('API Error (DELETE /api/admin/incentives):', err);
        return errorResponse(err);
    }
}
