import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import MonthlyGoal from '@/models/MonthlyGoal';
import Fee from '@/models/Fee';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        
        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month'); // e.g., "March 2026"
        if (!month) return NextResponse.json({ message: "Month parameter is required" }, { status: 400 });

        // 1. Fetch Targets
        let goal = await MonthlyGoal.findOne({ month });
        if (!goal) {
            goal = await MonthlyGoal.create({ month, targetRevenue: 0, targetHours: 0 });
        }

        // 2. Calculate Current Progress
        // Revenue: Sum of paid fees for that month
        const fees = await Fee.find({ month, paymentStatus: 'paid' });
        const currentRevenue = fees.reduce((sum, f) => sum + (f.amount || 0), 0);

        // Hours: Sum of attendance duration in hours
        const [mName, year] = month.split(' ');
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const mIndex = monthNames.indexOf(mName);
        const startDate = new Date(parseInt(year), mIndex, 1);
        const endDate = new Date(parseInt(year), mIndex + 1, 0, 23, 59, 59);

        const attendances = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
            status: 'Present'
        });
        const currentHours = attendances.reduce((sum, a) => sum + ((a.durationMinutes || 0) / 60), 0);

        return NextResponse.json({
            goal,
            currentRevenue,
            currentHours
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json(); // { month, targetRevenue, targetHours }
        
        const updatedGoal = await MonthlyGoal.findOneAndUpdate(
            { month: body.month },
            body,
            { upsert: true, new: true }
        );
        return NextResponse.json(updatedGoal);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
