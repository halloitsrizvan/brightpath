
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import Salary from '@/models/Salary';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;

        const salary = await Salary.findById(id).populate('teacherId');
        return NextResponse.json(salary);
    } catch (err: any) {
        return errorResponse(err);
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();

        const salary = await Salary.findById(id);
        if (!salary) return NextResponse.json({ message: 'Salary record not found' }, { status: 404 });

        const payout = Number(body.disbursedAmount);
        if (!Number.isFinite(payout) || payout < 0) {
            return NextResponse.json({ message: 'Invalid disbursement amount' }, { status: 400 });
        }

        const remainingQualified = Math.max(0, (salary.qualifiedSalary || 0) - (salary.disbursedAmount || 0));
        if (payout > remainingQualified) {
            return NextResponse.json({ message: 'Disbursement exceeds the qualified unpaid amount' }, { status: 400 });
        }

        salary.disbursedAmount = (salary.disbursedAmount || 0) + payout;
        salary.paymentDate = body.paymentDate || new Date();
        salary.disbursementCutoffDate = body.disbursementCutoffDate || new Date();
        if (body.settlementId) salary.settlementId = body.settlementId;
        salary.paidStatus = salary.disbursedAmount >= salary.totalSalary ? 'paid' : 'partial';
        const updatedSalary = await salary.save();
        return NextResponse.json(updatedSalary);
    } catch (err: any) {
        return errorResponse(err);
    }
}
