import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkAuth } from '@/lib/api/auth';
import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';
import IncentiveRule from '@/models/IncentiveRule';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;

        // Ensure models are registered (especially important for population in Next.js)
        const dummySubject = Subject.modelName;
        const dummyStudent = Student.modelName;

        const teacher = await Teacher.findById(id)
            .select('-password')
            .populate('subjects', 'subjectName');

        if (!teacher) return NextResponse.json({ message: 'Teacher profile not found' }, { status: 404 });

        // Find students assigned to this teacher
        const assignedStudents = await Student.find({ preferredTrainers: id })
            .select('fullName class contactNumber subjectAssignments')
            .populate('subjectAssignments.subjectId', 'subjectName');

        // Group attendances by month to calculate incentives per month
        const allAttendances = await Attendance.find({ teacherId: id, status: 'Present' }).populate('studentId');
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        const monthlyData: { [key: string]: { earnings: number, hours: number } } = {};
        let totalLifetimeMinutes = 0;

        for (const attendance of allAttendances) {
            const date = new Date(attendance.date);
            const mKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            
            if (!monthlyData[mKey]) monthlyData[mKey] = { earnings: 0, hours: 0 };
            
            const student = attendance.studentId as any;
            const mins = (attendance.durationMinutes || 0);
            totalLifetimeMinutes += mins;
            const hours = mins / 60;
            
            let rate = teacher.salaryPerHour || 0;
            if (student && student.subjectAssignments) {
                const assignment = student.subjectAssignments.find((a: any) => 
                    a.subjectId.toString() === attendance.subjectId?.toString() && 
                    a.teacherId.toString() === id
                );
                if (assignment && assignment.salaryPerHour > 0) {
                    rate = assignment.salaryPerHour;
                }
            }
            monthlyData[mKey].earnings += hours * rate;
            monthlyData[mKey].hours += hours;
        }

        // Fetch all active incentive rules once
        const allRules = await IncentiveRule.find({ active: true, targetTeachers: { $in: [id] } });

        let totalLifetimeEarnings = 0;
        for (const monthKey in monthlyData) {
            const data = monthlyData[monthKey];
            // Find reached incentive for this month's hours
            const reachedIncentiveAmount = allRules
                .filter(r => r.targetHours <= data.hours)
                .reduce((max, r) => Math.max(max, r.incentiveAmount), 0);
            
            totalLifetimeEarnings += data.earnings + reachedIncentiveAmount;
        }

        const teacherData = teacher.toObject();
        teacherData.totalTeachingHours = parseFloat((totalLifetimeMinutes / 60).toFixed(1)) || 0;
        teacherData.totalEarnings = Math.round(totalLifetimeEarnings);
        teacherData.students = assignedStudents;

        return NextResponse.json(teacherData);
    } catch (err: any) {
        console.error('Teacher Profile Fetch Error:', err);
        return NextResponse.json({
            message: err.message || 'Internal Server Error',
            error: err.toString()
        }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);
        const body = await req.json();
        const { id } = await params;

        // Hash password if provided, or prevent student from changing it if needed
        // Teachers are usually changed by admins, but teachers can also change their own profile.
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        }

        const updated = await Teacher.findByIdAndUpdate(id, body, { new: true }).select('-password');
        if (!updated) return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });

        return NextResponse.json(updated);
    } catch (err: any) {
        console.error('Teacher Profile Update Error:', err);
        return NextResponse.json({
            message: err.message || 'Internal Server Error',
            error: err.toString()
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        await Teacher.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Teacher deleted' });
    } catch (err: any) {
        console.error('Teacher Profile Delete Error:', err);
        return NextResponse.json({
            message: err.message || 'Internal Server Error',
            error: err.toString()
        }, { status: 500 });
    }
}
