
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import Salary from '@/models/Salary';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'teacher']);

        const { searchParams } = new URL(req.url);
        // Teachers always get their own salary records, whatever they ask for
        const teacherId = user.role === 'teacher' ? user.id : searchParams.get('teacherId');
        const month = searchParams.get('month');

        const filter: any = {};
        if (teacherId) filter.teacherId = teacherId;
        if (month) filter.month = month;

        const salaries = await Salary.find(filter).populate('teacherId', 'name email');
        return NextResponse.json(salaries);
    } catch (err: any) {
        return errorResponse(err);
    }
}
