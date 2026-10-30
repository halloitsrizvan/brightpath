import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import IncentiveRule from '../../../../models/IncentiveRule';
import Teacher from '@/models/Teacher';
 
export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const rules = await IncentiveRule.find().populate('targetTeachers', 'name email');
        return NextResponse.json(rules);
    } catch (err: any) {
        console.error('API Error (GET /api/admin/incentives):', err);
        return errorResponse(err);
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
        return errorResponse(err);
    }
}
