import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Teacher from '@/models/Teacher';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';
import Salary from '@/models/Salary';
import Fee from '@/models/Fee';
import IncentiveRule from '@/models/IncentiveRule';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { month } = await req.json(); // e.g. "March 2026"
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const [mName, year] = month.split(' ');
        const mIndex = monthNames.indexOf(mName);
        const startDate = new Date(parseInt(year), mIndex, 1);
        const endDate = new Date(parseInt(year), mIndex + 1, 0, 23, 59, 59);

        // Fetch all attendance for the month
        const allAttendances = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
            status: 'Present'
        }).populate('studentId').populate('teacherId');

        const teacherCalcs: { [key: string]: { earnings: number, hours: number, baseRate: number } } = {};
        const studentCalcs: { [key: string]: { totalBill: number, hours: number } } = {};

        for (const rec of allAttendances) {
            const student = rec.studentId as any;
            const teacher = rec.teacherId as any;
            if (!student || !teacher) continue;

            const tId = teacher._id.toString();
            const sId = student._id.toString();
            const hours = (rec.durationMinutes || 0) / 60;

            // Determine rate (using student-specific assignment)
            let rate = teacher.salaryPerHour || 0;
            if (student.subjectAssignments) {
                const assignment = student.subjectAssignments.find((a: any) => 
                    a.subjectId.toString() === rec.subjectId?.toString() && 
                    a.teacherId.toString() === tId
                );
                if (assignment && assignment.billPerHour > 0) {
                    rate = assignment.billPerHour;
                }
            }

            // Payables (for Teacher)
            if (!teacherCalcs[tId]) teacherCalcs[tId] = { earnings: 0, hours: 0, baseRate: teacher.salaryPerHour || 0 };
            teacherCalcs[tId].earnings += hours * rate;
            teacherCalcs[tId].hours += hours;

            // Receivables (for Student)
            if (!studentCalcs[sId]) studentCalcs[sId] = { totalBill: 0, hours: 0 };
            studentCalcs[sId].totalBill += hours * rate;
            studentCalcs[sId].hours += hours;
        }

        const salaryResults = [];
        const feeResults = [];

        // 1. Upsert Salary Records
        const allRules = await IncentiveRule.find({ active: true });

        for (const tId in teacherCalcs) {
            const data = teacherCalcs[tId];
            if (data.earnings <= 0) continue;

            // Calculate incentive for this teacher this month
            const reachedIncentive = allRules
                .filter(r => r.targetTeachers.some((id: any) => id.toString() === tId) && r.targetHours <= data.hours)
                .reduce((max, r) => Math.max(max, r.incentiveAmount), 0);

            const finalMonthlySalary = Math.round(data.earnings + reachedIncentive);

            let salaryRecord = await Salary.findOne({ teacherId: tId, month });
            if (salaryRecord) {
                salaryRecord.totalHours = parseFloat(data.hours.toFixed(2));
                salaryRecord.totalSalary = finalMonthlySalary;
                await salaryRecord.save();
            } else {
                salaryRecord = new Salary({
                    teacherId: tId, month,
                    totalHours: parseFloat(data.hours.toFixed(2)),
                    salaryPerHour: data.baseRate,
                    totalSalary: finalMonthlySalary
                });
                await salaryRecord.save();
            }
            salaryResults.push(salaryRecord);
        }

        // 2. Upsert Fee Records (Student Bills)
        for (const sId in studentCalcs) {
            const data = studentCalcs[sId];
            if (data.totalBill <= 0) continue;

            let feeRecord = await Fee.findOne({ studentId: sId, month });
            if (feeRecord) {
                feeRecord.amount = Math.round(data.totalBill);
                await feeRecord.save();
            } else {
                feeRecord = new Fee({
                    studentId: sId,
                    month,
                    amount: Math.round(data.totalBill),
                    paymentStatus: 'unpaid'
                });
                await feeRecord.save();
            }
            feeResults.push(feeRecord);
        }

        return NextResponse.json({ 
            message: `Processed financials for ${salaryResults.length} Tutors and ${feeResults.length} Students`,
            salariesProcessed: salaryResults.length,
            feesProcessed: feeResults.length 
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
