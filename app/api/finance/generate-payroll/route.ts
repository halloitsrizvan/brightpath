
import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Teacher from '@/models/Teacher';
import Attendance from '@/models/Attendance';
import Salary from '@/models/Salary';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { month } = await req.json(); // e.g. "March 2026"

        const teachers = await Teacher.find({ status: 'active' });
        const results = [];

        for (const teacher of teachers) {
            // Find all attendance records for this month (approximate string search or date range)
            // For simplicity, let's assume we search by a date range if month is provided, 
            // but the models use a string 'month'.

            // Let's filter attendance by date range based on month
            // If month is "March 2024", we get start and end dates.
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const [mName, year] = month.split(' ');
            const mIndex = monthNames.indexOf(mName);
            const startDate = new Date(parseInt(year), mIndex, 1);
            const endDate = new Date(parseInt(year), mIndex + 1, 0, 23, 59, 59);

            const attendanceRecords = await Attendance.find({
                teacherId: teacher._id,
                date: { $gte: startDate, $lte: endDate },
                status: 'Present'
            });

            const totalMinutes = attendanceRecords.reduce((acc, rec) => acc + (rec.durationMinutes || 0), 0);
            const totalHours = totalMinutes / 60;
            const totalSalary = totalHours * (teacher.salaryPerHour || 0);

            if (totalSalary > 0) {
                // Check if salary record already exists for this month
                let salaryRecord = await Salary.findOne({ teacherId: teacher._id, month });
                if (salaryRecord) {
                    salaryRecord.totalHours = totalHours;
                    salaryRecord.salaryPerHour = teacher.salaryPerHour;
                    salaryRecord.totalSalary = totalSalary;
                    await salaryRecord.save();
                } else {
                    salaryRecord = new Salary({
                        teacherId: teacher._id,
                        month,
                        totalHours,
                        salaryPerHour: teacher.salaryPerHour,
                        totalSalary,
                        paidStatus: 'unpaid'
                    });
                    await salaryRecord.save();
                }
                results.push(salaryRecord);
            }
        }

        return NextResponse.json({ message: `Processed ${results.length} payroll records`, records: results });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
