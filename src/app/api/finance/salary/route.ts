
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import Salary from '@/models/Salary';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);

        const { searchParams } = new URL(req.url);
        const teacherId = searchParams.get('teacherId');
        const month = searchParams.get('month');

        const filter: any = {};
        if (teacherId) filter.teacherId = teacherId;
        if (month) filter.month = month;

        const salaries = await Salary.find(filter).populate('teacherId', 'name email');
        return NextResponse.json(salaries);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
