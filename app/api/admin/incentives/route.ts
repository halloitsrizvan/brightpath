import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import IncentiveRule from '@/models/IncentiveRule';
import Teacher from '@/models/Teacher';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const rules = await IncentiveRule.find().populate('targetTeachers', 'name email');
        return NextResponse.json(rules);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();
        const rule = await IncentiveRule.create(body);
        return NextResponse.json(rule, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
