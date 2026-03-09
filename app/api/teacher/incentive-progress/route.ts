import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import IncentiveRule from '@/models/IncentiveRule';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['teacher']);

        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        // Find all attendance records for the current month for this teacher
        const attendances = await Attendance.find({
            teacherId: user.id,
            date: { $gte: start, $lte: end },
            status: 'Present'
        });

        const totalMinutes = attendances.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
        const totalHours = totalMinutes / 60;

        // Fetch active incentive rule
        let rule = await IncentiveRule.findOne({ active: true });

        // If no rule exists, create a default one
        if (!rule) {
            rule = await IncentiveRule.create({
                targetHours: 20,
                incentiveAmount: 2000,
                active: true
            });
        }

        const targetHours = rule.targetHours;
        const progress = Math.min(100, (totalHours / targetHours) * 100);
        const incentiveUnlocked = totalHours >= targetHours;
        const hoursRemaining = Math.max(0, targetHours - totalHours);

        return NextResponse.json({
            totalHours: parseFloat(totalHours.toFixed(1)),
            targetHours,
            progress: Math.round(progress),
            incentiveAmount: rule.incentiveAmount,
            incentiveUnlocked,
            hoursRemaining: parseFloat(hoursRemaining.toFixed(1))
        });

    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
