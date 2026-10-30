import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import Salary from '@/models/Salary';
import Fee from '@/models/Fee';
import Attendance from '@/models/Attendance';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import IncentiveRule from '@/models/IncentiveRule';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const body = await req.json();
        const { salaryIds, cutoffDate } = body;

        if (!salaryIds || !Array.isArray(salaryIds) || salaryIds.length === 0) {
            return NextResponse.json({ message: "Salary IDs are required" }, { status: 400 });
        }

        const salaries = await Salary.find({ _id: { $in: salaryIds } }).populate('teacherId');
        if (salaries.length === 0) {
            return NextResponse.json({ message: "No salary records found" }, { status: 404 });
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        let totalAccrued = 0;
        let totalQualified = 0;
        let totalPending = 0;
        let totalHours = 0;
        let qualifiedHours = 0;
        const allActivities: any[] = [];
        const breakdown: { [id: string]: number } = {};

        // Cutoff Date Object for disbursement limit (if supplied)
        let disburseCutoffEnd: Date | null = null;
        if (cutoffDate) {
            const parts = String(cutoffDate).split('-');
            if (parts.length === 3) {
                disburseCutoffEnd = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 23, 59, 59, 999);
            } else {
                disburseCutoffEnd = new Date(cutoffDate);
                disburseCutoffEnd.setHours(23, 59, 59, 999);
            }
        }

        const allRules = await IncentiveRule.find({ active: true });

        for (const salary of salaries) {
            const teacher = salary.teacherId as any;
            if (!teacher) continue;

            const [mName, year] = salary.month.split(' ');
            const mIndex = monthNames.indexOf(mName);
            if (mIndex === -1) continue;

            const monthStart = new Date(parseInt(year), mIndex, 1);
            const monthEnd = new Date(parseInt(year), mIndex + 1, 0, 23, 59, 59, 999);

            const classes = await Attendance.find({
                teacherId: teacher._id,
                date: { $gte: monthStart, $lte: monthEnd },
                status: 'Present'
            }).populate('studentId').populate('subjectId');

            // Find all paid fees for this month to check which students have paid
            const paidFees = await Fee.find({
                month: salary.month,
                paymentStatus: 'paid'
            });

            // Map studentId -> list of paid cutoffs (null = full month paid)
            const studentPaidCutoffs: { [sId: string]: (Date | null)[] } = {};
            for (const fee of paidFees) {
                const sId = fee.studentId.toString();
                if (!studentPaidCutoffs[sId]) studentPaidCutoffs[sId] = [];
                studentPaidCutoffs[sId].push(fee.billingCutoffDate ? new Date(fee.billingCutoffDate) : null);
            }

            let salaryAccrued = 0;
            let salaryQualified = 0;
            let salaryPending = 0;
            let salHours = 0;
            let salQualHours = 0;

            for (const cls of classes) {
                const student = cls.studentId as any;
                const subject = cls.subjectId as any;
                if (!student) continue;

                const sId = student._id.toString();
                const hours = (cls.durationMinutes || 0) / 60;
                const classDate = new Date(cls.date);

                let salaryRate = teacher.salaryPerHour || 0;
                if (cls.salaryRateAtTime !== undefined && cls.salaryRateAtTime !== null) {
                    salaryRate = cls.salaryRateAtTime;
                } else if (student.subjectAssignments) {
                    const assignment = student.subjectAssignments.find((a: any) => 
                        (a.subjectId?.toString() === subject?._id?.toString() || a.subjectId?.toString() === cls.subjectId?.toString()) && 
                        a.teacherId?.toString() === teacher._id.toString()
                    );
                    if (assignment && assignment.salaryPerHour > 0) salaryRate = assignment.salaryPerHour;
                }

                const amount = Math.round(hours * salaryRate);
                salHours += hours;
                salaryAccrued += amount;

                // Check 1: Did the student pay for this class?
                const isStudentPaid = studentPaidCutoffs[sId] ? studentPaidCutoffs[sId].some((cutoff) => {
                    if (!cutoff) return true; // Full month paid
                    const endOfDayCutoff = new Date(cutoff);
                    endOfDayCutoff.setHours(23, 59, 59, 999);
                    return classDate.getTime() <= endOfDayCutoff.getTime();
                }) : false;

                // Check 2: Does it satisfy the disbursement cutoff date?
                const isWithinDisburseCutoff = disburseCutoffEnd ? classDate.getTime() <= disburseCutoffEnd.getTime() : true;

                const isQualified = isStudentPaid && isWithinDisburseCutoff;

                if (isQualified) {
                    salaryQualified += amount;
                    salQualHours += hours;
                } else {
                    salaryPending += amount;
                }

                allActivities.push({
                    _id: cls._id,
                    date: cls.date,
                    studentName: student.fullName || 'Student',
                    subjectName: subject?.subjectName || 'General Session',
                    teacherName: teacher.name,
                    hours,
                    salaryRate,
                    amount,
                    isStudentPaid,
                    isWithinDisburseCutoff,
                    isQualified
                });
            }

            // Incentive bonus calculation
            const qualifiedIncentive = allRules
                .filter(r => r.targetTeachers.some((id: any) => id.toString() === teacher._id.toString()) && r.targetHours <= salQualHours)
                .reduce((max, r) => Math.max(max, r.incentiveAmount), 0);

            const totalIncentive = allRules
                .filter(r => r.targetTeachers.some((id: any) => id.toString() === teacher._id.toString()) && r.targetHours <= salHours)
                .reduce((max, r) => Math.max(max, r.incentiveAmount), 0);

            const finalSalaryQualified = Math.round(salaryQualified + qualifiedIncentive);
            const finalSalaryTotal = Math.round(salaryAccrued + totalIncentive);

            breakdown[salary._id.toString()] = finalSalaryQualified;
            totalAccrued += finalSalaryTotal;
            totalQualified += finalSalaryQualified;
            totalPending += Math.max(0, finalSalaryTotal - finalSalaryQualified);
            totalHours += salHours;
            qualifiedHours += salQualHours;
        }

        // Sort activities chronologically
        allActivities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return NextResponse.json({
            amount: totalQualified,
            totalAccrued,
            pendingStudentAmount: totalPending,
            totalHours: parseFloat(totalHours.toFixed(2)),
            qualifiedHours: parseFloat(qualifiedHours.toFixed(2)),
            classesCount: allActivities.length,
            qualifiedClassesCount: allActivities.filter(a => a.isQualified).length,
            breakdown,
            activities: allActivities
        });
    } catch (err: any) {
        console.error("Calculate Disbursement Error:", err);
        return errorResponse(err);
    }
}
