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

        let totalGross = 0;
        let totalPaid = 0;
        const allActivities: any[] = [];

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

            // Define month boundary (local and UTC safe)
            const startDate = new Date(year, mIndex, 1, 0, 0, 0, 0);
            const totalDaysInMonth = new Date(year, mIndex + 1, 0).getDate();
            const monthEndDate = new Date(year, mIndex, totalDaysInMonth, 23, 59, 59, 999);

            let targetCutoff = monthEndDate;
            let cutoffDayNumber = totalDaysInMonth;

            if (cutoffDate) {
                // Parse cutoff date safely using string split to avoid UTC vs local timezone issues
                const cutoffParts = String(cutoffDate).split('-');
                if (cutoffParts.length === 3) {
                    const cYear = parseInt(cutoffParts[0]);
                    const cMonth = parseInt(cutoffParts[1]) - 1; // 0-indexed
                    const cDay = parseInt(cutoffParts[2]);
                    if (!isNaN(cYear) && !isNaN(cMonth) && !isNaN(cDay)) {
                        targetCutoff = new Date(cYear, cMonth, cDay, 23, 59, 59, 999);
                        cutoffDayNumber = cDay;
                    }
                } else {
                    const parsedCutoff = new Date(cutoffDate);
                    if (!isNaN(parsedCutoff.getTime())) {
                        targetCutoff = new Date(parsedCutoff.getFullYear(), parsedCutoff.getMonth(), parsedCutoff.getDate(), 23, 59, 59, 999);
                        cutoffDayNumber = parsedCutoff.getDate();
                    }
                }
            }

            // If cutoff is strictly before the fee's billing month, amount should be 0
            if (targetCutoff < startDate) {
                feeBreakdown[fee._id.toString()] = 0;
                continue;
            }

            // Cap the query end date to the month boundary
            const queryEndDate = targetCutoff < monthEndDate ? targetCutoff : monthEndDate;

            // Fetch any already paid fees for this student for this billing month
            const paidFees = await Fee.find({
                studentId: student._id,
                month: fee.month,
                paymentStatus: 'paid',
                _id: { $ne: fee._id }
            }).sort({ paymentDate: 1, billingCutoffDate: 1 });
            const paidAmount = paidFees.reduce((sum: number, f: any) => sum + (f.amount || 0), 0);
            totalPaid += paidAmount;

            // If there are prior paid fees for this student in the same billing month,
            // start the activity query AFTER the last prior cutoff date (UTC safe timestamp offset)
            let activityStartDate = startDate;
            if (paidFees.length > 0) {
                const lastPrior = paidFees[paidFees.length - 1];
                const lastCutoff = lastPrior.billingCutoffDate || lastPrior.paymentDate;
                if (lastCutoff) {
                    activityStartDate = new Date(new Date(lastCutoff).getTime() + 1);
                }
            }

            // Check if this student has ANY attendance records in the entire billing month
            // to accurately distinguish attendance-based students from flat-fee students
            const monthAttendanceCount = await Attendance.countDocuments({
                studentId: student._id,
                date: { $gte: startDate, $lte: monthEndDate },
                status: { $regex: /^present$/i }
            });

            if (monthAttendanceCount > 0) {
                hasAttendanceRecords = true;

                let feeAttendanceBill = 0;
                let feeAttendanceHours = 0;

                // Query attendances only within the active unpaid billing window
                if (activityStartDate <= queryEndDate) {
                    const attendances = await Attendance.find({
                        studentId: student._id,
                        date: { $gte: activityStartDate, $lte: queryEndDate },
                        status: { $regex: /^present$/i }
                    })
                    .populate('subjectId')
                    .populate('teacherId')
                    .sort({ date: 1 });

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

                        const lineAmount = Math.round(hours * billRate);
                        feeAttendanceBill += lineAmount;
                        feeAttendanceHours += hours;

                        const sObj = rec.subjectId as any;
                        const tObj = rec.teacherId as any;

                        allActivities.push({
                            _id: rec._id.toString(),
                            date: rec.date,
                            subjectName: sObj?.subjectName || sObj?.name || 'Tuition Session',
                            teacherName: tObj?.name || tObj?.fullName || 'Teacher',
                            durationMinutes: rec.durationMinutes || 60,
                            hours,
                            billRate,
                            amount: lineAmount,
                            status: rec.status
                        });
                    }
                }

                const netBill = Math.round(feeAttendanceBill);
                totalGross += netBill;
                totalCalculated += netBill;
                totalClasses += feeAttendanceHours > 0 ? allActivities.length : 0;
                totalHours += feeAttendanceHours;
                feeBreakdown[fee._id.toString()] = netBill;
            } else {
                // Prorate based on elapsed days from month start if no attendance logs for the whole month (flat fee)
                const effectiveCutoffDay = Math.min(cutoffDayNumber, totalDaysInMonth);
                const totalMonthBase = (fee.amount || 0) + paidAmount;
                const totalProrated = Math.round(totalMonthBase * (effectiveCutoffDay / totalDaysInMonth));
                const netProrated = Math.max(0, totalProrated - paidAmount);
                totalGross += totalProrated;
                totalCalculated += netProrated;
                feeBreakdown[fee._id.toString()] = netProrated;
            }
        }

        return NextResponse.json({
            amount: totalCalculated,
            isAttendanceBased: hasAttendanceRecords,
            classesCount: totalClasses,
            hours: parseFloat(totalHours.toFixed(1)),
            breakdown: feeBreakdown,
            grossAmount: totalGross,
            paidAmount: totalPaid,
            activities: allActivities
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
