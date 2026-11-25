
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import Fee from '@/models/Fee';
import dbConnect from '@/lib/db/mongodb';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();

        const amount = Number(body.amount);
        if (!Number.isFinite(amount) || amount < 0) {
            return NextResponse.json({ message: 'Invalid fee amount' }, { status: 400 });
        }
        if (!['paid', 'unpaid', 'pending'].includes(body.paymentStatus)) {
            return NextResponse.json({ message: 'Invalid payment status' }, { status: 400 });
        }

        const update = {
            amount,
            paymentStatus: body.paymentStatus,
            paymentDate: body.paymentDate,
            billingCutoffDate: body.billingCutoffDate,
            settlementId: body.settlementId
        };
        const updatedFee = await Fee.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true });
        if (!updatedFee) return NextResponse.json({ message: 'Fee record not found' }, { status: 404 });
        return NextResponse.json(updatedFee);
    } catch (err: any) {
        return errorResponse(err);
    }
}
