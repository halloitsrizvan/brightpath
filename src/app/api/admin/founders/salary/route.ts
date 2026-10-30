import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import FounderSalary from '@/models/FounderSalary';
import Admin from '@/models/Admin';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month');
        const query = month ? { month } : {};

        const salaries = await FounderSalary.find(query).populate('founderId');
        return NextResponse.json(salaries);
    } catch (err: any) {
        return errorResponse(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();
        const salary = await FounderSalary.create(body);
        return NextResponse.json(salary);
    } catch (err: any) {
        return errorResponse(err);
    }
}
