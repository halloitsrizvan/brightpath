import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);
        const { id } = await params;
        const teacher = await Teacher.findById(id)
            .select('-password')
            .populate('subjects', 'subjectName')
            .populate('students', 'fullName class contactNumber');

        if (!teacher) return NextResponse.json({ message: 'Teacher profile not found' }, { status: 404 });

        // Calculate total hours from attendance
        const Attendance = require('@/models/Attendance').default;
        const allAttendances = await Attendance.find({ teacherId: id, status: 'Present' });
        const totalMinutes = allAttendances.reduce((acc: number, curr: any) => acc + (curr.durationMinutes || 0), 0);

        const teacherData = teacher.toObject();
        teacherData.totalTeachingHours = parseFloat((totalMinutes / 60).toFixed(1));

        return NextResponse.json(teacherData);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);
        const body = await req.json();
        const { id } = await params;

        // Prevent password update via this simple PUT for safety
        if (body.password) delete body.password;

        const updated = await Teacher.findByIdAndUpdate(id, body, { new: true }).select('-password');
        if (!updated) return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });

        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
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
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
