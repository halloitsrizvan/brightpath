import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { assertCanAccessStudent } from '@/lib/api/access';
import Attendance from '@/models/Attendance';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['teacher', 'admin']);
        const body = await req.json();

        // If the user is an admin running the teacher dashboard, 
        // they might not have a Teacher profile to augment.
        const teacherId = user.role === 'teacher' ? user.id : body.teacherId || user.id;
        // Teachers can only log classes for students assigned to them (attendance drives their pay)
        await assertCanAccessStudent(user, body.studentId);
        delete body._id;

        // Capture rates at time of attendance for historical data integrity
        let billRateAtTime = 0;
        let salaryRateAtTime = 0;

        const [targetStudent, targetTeacher] = await Promise.all([
            import('@/models/Student').then(m => m.default.findById(body.studentId)),
            Teacher.findById(teacherId)
        ]);

        if (targetTeacher) {
            salaryRateAtTime = targetTeacher.salaryPerHour || 0;
        }

        if (targetStudent && targetStudent.subjectAssignments) {
            const assignment = targetStudent.subjectAssignments.find((a: any) => 
                a.subjectId.toString() === body.subjectId?.toString() && 
                a.teacherId.toString() === teacherId.toString()
            );
            if (assignment) {
                if (assignment.billPerHour > 0) billRateAtTime = assignment.billPerHour;
                if (assignment.salaryPerHour > 0) salaryRateAtTime = assignment.salaryPerHour;
            }
        }

        const attendance = new Attendance({ 
            ...body, 
            teacherId,
            billRateAtTime,
            salaryRateAtTime
        });
        await attendance.save();

        // Automatically sync financials for the month of this attendance
        try {
            const attDate = new Date(body.date || new Date());
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthStr = `${monthNames[attDate.getMonth()]} ${attDate.getFullYear()}`;
            const { syncFinancialsForMonth } = await import('@/lib/finance-sync');
            await syncFinancialsForMonth(monthStr);
        } catch (syncErr) {
            console.error("Auto-sync failed:", syncErr);
        }

        return NextResponse.json(attendance, { status: 201 });
    } catch (err: any) {
        return errorResponse(err, 'POST /api/attendance');
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'student', 'teacher']);
        const { searchParams } = new URL(req.url);
        const today = searchParams.get('today') === 'true';
        const month = searchParams.get('month');

        let query: any = {};
        const studentIdLog = searchParams.get('studentId');

        if (user.role === 'student') {
            query.studentId = user.id;
        } else if (user.role === 'teacher') {
            query.teacherId = user.id;
        } else if (user.role === 'admin' && studentIdLog) {
            query.studentId = studentIdLog;
        }

        // Return list of available months for this user
        if (searchParams.get('getMonths') === 'true') {
            const records = await Attendance.find(query).select('date').sort({ date: -1 });
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthSet = new Set<string>();
            const now = new Date();
            const currentMonthStr = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
            monthSet.add(currentMonthStr);

            records.forEach(r => {
                if (r.date) {
                    const d = new Date(r.date);
                    if (!isNaN(d.getTime())) {
                        monthSet.add(`${monthNames[d.getMonth()]} ${d.getFullYear()}`);
                    }
                }
            });

            const sortedMonths = Array.from(monthSet).sort((a, b) => {
                const [mA, yA] = a.split(' ');
                const [mB, yB] = b.split(' ');
                const dateA = new Date(parseInt(yA), monthNames.indexOf(mA), 1);
                const dateB = new Date(parseInt(yB), monthNames.indexOf(mB), 1);
                return dateB.getTime() - dateA.getTime();
            });

            return NextResponse.json(sortedMonths);
        }

        if (today) {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        } else if (month && month !== 'All Time') {
            const [mName, year] = month.split(' ');
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const mIndex = monthNames.indexOf(mName);
            const start = new Date(parseInt(year), mIndex, 1);
            const end = new Date(parseInt(year), mIndex + 1, 0, 23, 59, 59);
            query.date = { $gte: start, $lte: end };
        }

        const list = await Attendance.find(query)
            .populate('studentId', 'fullName class grade phone contactNumber')
            .populate('teacherId', 'name')
            .populate('subjectId', 'subjectName')
            .sort({ date: -1 });

        return NextResponse.json(list);
    } catch (err: any) {
        return errorResponse(err);
    }
}
