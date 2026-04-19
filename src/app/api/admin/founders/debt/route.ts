import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import FounderDebt from '@/models/FounderDebt';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { founderId, type, amount, reason } = await req.json();

        if (!founderId || !type || !amount || !reason) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create the transaction record
        const transaction = await FounderDebt.create({ founderId, type, amount, reason });

        // 2. Update the admin's aggregate debt
        const adjustment = type === 'debt' ? amount : -amount;
        await Admin.findByIdAndUpdate(founderId, { $inc: { debtRemaining: adjustment } });

        return NextResponse.json(transaction);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { searchParams } = new URL(req.url);
        const founderId = searchParams.get('founderId');

        const query = founderId ? { founderId } : {};
        const logs = await FounderDebt.find(query).sort({ createdAt: -1 }).populate('founderId', 'name email');
        
        return NextResponse.json(logs);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
