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
        console.error('API Error (GET /api/admin/incentives):', err);
        const status = err.message.toLowerCase().includes('authorization denied') || err.message.toLowerCase().includes('token') ? 401 : 
                       err.message.toLowerCase().includes('forbidden') ? 403 : 500;
        return NextResponse.json({ message: err.message }, { status });
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
        console.error('API Error (POST /api/admin/incentives):', err);
        const status = err.message.toLowerCase().includes('authorization denied') || err.message.toLowerCase().includes('token') ? 401 : 
                       err.message.toLowerCase().includes('forbidden') ? 403 : 500;
        return NextResponse.json({ message: err.message }, { status });
    }
}
