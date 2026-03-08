import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Teacher from '@/models/Teacher';
import Salary from '@/models/Salary';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: { teacherId: string } }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);

        const defaultMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
        const teacher = await Teacher.findById(params.teacherId);

        if (!teacher) return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });

        const totalSalary = teacher.totalHours * teacher.salaryPerHour;

        const salaryRecord = await Salary.findOneAndUpdate(
            { teacherId: params.teacherId, month: defaultMonth },
            { totalHours: teacher.totalHours, salaryPerHour: teacher.salaryPerHour, totalSalary },
            { new: true, upsert: true }
        );

        return NextResponse.json(salaryRecord);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
