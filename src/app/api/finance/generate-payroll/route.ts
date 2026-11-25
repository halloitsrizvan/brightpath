import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import { syncFinancialsForMonth } from '@/lib/finance-sync';

const MONTH_PATTERN = /^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/;

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { month } = await req.json();

        if (typeof month !== 'string' || !MONTH_PATTERN.test(month)) {
            return NextResponse.json({ message: 'Month must use the format "March 2026"' }, { status: 400 });
        }

        await syncFinancialsForMonth(month);
        return NextResponse.json({ message: `Financials synchronized for ${month}` });
    } catch (err: any) {
        return errorResponse(err);
    }
}
