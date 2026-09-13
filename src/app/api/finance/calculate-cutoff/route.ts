import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';

// Force Model Registrations
import '@/models/Student';
import '@/models/Teacher';
import '@/models/Subject';
import '@/models/Fee';
import '@/models/Attendance';

import Fee from '@/models/Fee';
import Attendance from '@/models/Attendance';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const body = await req.json();
        const { feeIds, cutoffDate } = body;

        if (!feeIds || !Array.isArray(feeIds) || feeIds.length === 0) {
            return NextResponse.json({ message: 'Invalid fee IDs provided' }, { status: 400 });
        }

        const fees = await Fee.find({ _id: { $in: feeIds } }).populate({
            path: 'studentId',
            model: 'Student'
        });

        if (fees.length === 0) {
            return NextResponse.json({ message: 'Fees not found' }, { status: 404 });
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let totalCalculated = 0;
        let totalClasses = 0;
        let totalHours = 0;
        let hasAttendanceRecords = false;
        const feeBreakdown: { [key: string]: number } = {};

        for (const fee of fees) {
            const student = fee.studentId as any;
            if (!student) {
                const amt = fee.amount || 0;
                totalCalculated += amt;
                feeBreakdown[fee._id.toString()] = amt;
                continue;
            }

            const monthParts = (fee.month || '').trim().split(/\s+/);
            if (monthParts.length < 2) {
                const amt = fee.amount || 0;
                totalCalculated += amt;
                feeBreakdown[fee._id.toString()] = amt;
                continue;
            }

            const rawMName = monthParts[0];
            const year = parseInt(monthParts[1]);
            const mName = rawMName.charAt(0).toUpperCase() + rawMName.slice(1).toLowerCase();
            const mIndex = monthNames.indexOf(mName);

            if (mIndex === -1 || isNaN(year)) {
                const amt = fee.amount || 0;
                totalCalculated += amt;
                feeBreakdown[fee._id.toString()] = amt;
                continue;
            }

            const startDate = new Date(year, mIndex, 1);
            const totalDaysInMonth = new Date(year, mIndex + 1, 0).getDate();
            const monthEndDate = new Date(year, mIndex, totalDaysInMonth, 23, 59, 59);

            let targetCutoff = monthEndDate;
            if (cutoffDate) {
                const parsedCutoff = new Date(cutoffDate);
                if (!isNaN(parsedCutoff.getTime())) {
                    targetCutoff = new Date(parsedCutoff.getFullYear(), parsedCutoff.getMonth(), parsedCutoff.getDate(), 23, 59, 59);
                }
            }

            const queryEndDate = targetCutoff < monthEndDate ? targetCutoff : monthEndDate;

            // Query attendances for this student up to cutoff
            const attendances = await Attendance.find({
                studentId: student._id,
                date: { $gte: startDate, $lte: queryEndDate },
                status: 'Present'
            }).populate('teacherId');

            let feeAttendanceBill = 0;
            let feeAttendanceHours = 0;

            for (const rec of attendances) {
                const hours = (rec.durationMinutes || 0) / 60;
                let billRate = 0;
                if (rec.billRateAtTime !== undefined && rec.billRateAtTime !== null) {
                    billRate = rec.billRateAtTime;
                } else if (student.subjectAssignments) {
                    const tId = (rec.teacherId as any)?._id?.toString() || (rec.teacherId as any)?.toString();
                    const sId = (rec.subjectId as any)?._id?.toString() || (rec.subjectId as any)?.toString();
                    const assignment = student.subjectAssignments.find((a: any) => 
                        (a.subjectId?.toString() === sId) && 
                        (a.teacherId?.toString() === tId)
                    );
                    if (assignment && assignment.billPerHour > 0) billRate = assignment.billPerHour;
                }
                feeAttendanceBill += hours * billRate;
                feeAttendanceHours += hours;
            }

            if (attendances.length > 0 && feeAttendanceBill > 0) {
                hasAttendanceRecords = true;
                const roundedBill = Math.round(feeAttendanceBill);
                totalCalculated += roundedBill;
                totalClasses += attendances.length;
                totalHours += feeAttendanceHours;
                feeBreakdown[fee._id.toString()] = roundedBill;
            } else {
                // Prorate based on days if no attendance logs or flat fee
                const cutoffDay = Math.min(queryEndDate.getDate(), totalDaysInMonth);
                const prorated = Math.round((fee.amount || 0) * (cutoffDay / totalDaysInMonth));
                totalCalculated += prorated;
                feeBreakdown[fee._id.toString()] = prorated;
            }
        }

        return NextResponse.json({
            amount: totalCalculated,
            isAttendanceBased: hasAttendanceRecords,
            classesCount: totalClasses,
            hours: parseFloat(totalHours.toFixed(1)),
            breakdown: feeBreakdown
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
