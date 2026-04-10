import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
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
        const status = err.message.toLowerCase().includes('authorization denied') || err.message.toLowerCase().includes('token') ? 401 : 
                       err.message.toLowerCase().includes('forbidden') ? 403 : 500;
        return NextResponse.json({ message: err.message }, { status });
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
        const status = err.message.toLowerCase().includes('authorization denied') || err.message.toLowerCase().includes('token') ? 401 : 
                       err.message.toLowerCase().includes('forbidden') ? 403 : 500;
        return NextResponse.json({ message: err.message }, { status });
    }
}
