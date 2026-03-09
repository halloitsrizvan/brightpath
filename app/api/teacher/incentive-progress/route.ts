import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import IncentiveRule from '@/models/IncentiveRule';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['teacher', 'admin']);
        const teacherId = req.nextUrl.searchParams.get('teacherId') || user.id;

        // Security: If not admin, can only see own progress
        if (user.role !== 'admin' && teacherId !== user.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        const now = new Date();
        const start = startOfMonth(now);
        const end = endOfMonth(now);

        // Find all attendance records for the current month for this teacher
        const attendances = await Attendance.find({
            teacherId: teacherId,
            date: { $gte: start, $lte: end },
            status: 'Present'
        });

        const totalMinutes = attendances.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
        const totalHours = totalMinutes / 60;

        // Fetch all active incentive rules for this teacher
        const rules = await IncentiveRule.find({
            active: true,
            targetTeachers: { $in: [teacherId] }
        }).sort({ targetHours: 1 });

        if (rules.length === 0) {
            return NextResponse.json({
                totalHours: parseFloat(totalHours.toFixed(1)),
                targetHours: 0,
                progress: 0,
                incentiveAmount: 0,
                incentiveUnlocked: false,
                hoursRemaining: 0,
                notEligible: true
            });
        }

        // Current milestone is the first one where totalHours < targetHours
        let currentRule = rules.find(r => totalHours < r.targetHours) || rules[rules.length - 1];

        // Calculate total earned incentives (all rules where totalHours >= targetHours)
        const totalEarnedIncentive = rules
            .filter(r => totalHours >= r.targetHours)
            .reduce((sum, r) => sum + r.incentiveAmount, 0);

        const targetHours = currentRule.targetHours;
        const progress = Math.min(100, (totalHours / targetHours) * 100);
        const incentiveUnlocked = totalHours >= targetHours;
        const hoursRemaining = Math.max(0, targetHours - totalHours);

        return NextResponse.json({
            totalHours: parseFloat(totalHours.toFixed(1)),
            targetHours,
            progress: Math.round(progress),
            incentiveAmount: currentRule.incentiveAmount,
            incentiveUnlocked,
            hoursRemaining: parseFloat(hoursRemaining.toFixed(1)),
            totalEarnedIncentive,
            milestones: rules.map(r => ({
                targetHours: r.targetHours,
                incentiveAmount: r.incentiveAmount,
                isReached: totalHours >= r.targetHours
            }))
        });

    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
