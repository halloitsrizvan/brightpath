import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import Teacher from '@/models/Teacher';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/db/mongodb';
import IncentiveRule from '@/models/IncentiveRule';
import Student from '@/models/Student';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['teacher']);

        // Ensure models are registered for population
        const dummyStudent = Student.modelName;

        const teacherContent = await Teacher.findById(user.id);
        if (!teacherContent) return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });

        // Find students assigned to this teacher
        const assignedStudentsCount = await Student.countDocuments({ preferredTrainers: user.id });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const classesTakenToday = await Attendance.countDocuments({ teacherId: user.id, date: { $gte: today } });

        // Calculate Monthly Teaching Hours from Attendance
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        const monthlyAttendances = await Attendance.find({
            teacherId: user.id,
            date: { $gte: start, $lte: end },
            status: 'Present'
        });

        const totalMinutes = monthlyAttendances.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
        const totalHoursThisMonth = totalMinutes / 60;

        // Calculate Earned Incentives
        const reachedIncentives = await IncentiveRule.find({
            active: true,
            targetTeachers: { $in: [user.id] },
            targetHours: { $lte: totalHoursThisMonth }
        });

        const earnedIncentivesTotal = reachedIncentives.reduce((acc: number, curr: any) => acc + curr.incentiveAmount, 0);
        
        // Dynamic salary calculation based on student/subject rates
        const attendancesWithStudents = await Attendance.find({
            teacherId: user.id,
            date: { $gte: start, $lte: end },
            status: 'Present'
        }).populate('studentId');

        let dynamicBaseSalary = 0;
        for (const attendance of attendancesWithStudents) {
            const student = attendance.studentId as any;
            const hours = (attendance.durationMinutes || 0) / 60;
            let rate = teacherContent.salaryPerHour || 0;

            if (student && student.subjectAssignments) {
                const assignment = student.subjectAssignments.find((a: any) => 
                    a.subjectId.toString() === attendance.subjectId?.toString() && 
                    a.teacherId.toString() === user.id
                );
                if (assignment && assignment.salaryPerHour > 0) {
                    rate = assignment.salaryPerHour;
                }
            }
            dynamicBaseSalary += hours * rate;
        }

        const estimatedSalary = dynamicBaseSalary + earnedIncentivesTotal;

        return NextResponse.json({
            totalStudentsAssigned: assignedStudentsCount,
            classesThisMonth: monthlyAttendances.length,
            totalHoursThisMonth: parseFloat(totalHoursThisMonth.toFixed(1)),
            salaryEstimate: Math.round(estimatedSalary)
        });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
