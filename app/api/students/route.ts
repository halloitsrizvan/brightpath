import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        const initialPassword = body.password || 'student123';
        const hashedPassword = await bcrypt.hash(initialPassword, 10);
        const newStudent = new Student({ ...body, password: hashedPassword });
        await newStudent.save();
        return NextResponse.json(newStudent, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'teacher']);

        let query = {};
        if (user.role === 'teacher') {
            query = { preferredTrainers: user.id };
        }

        const students = await Student.find(query)
            .populate('subjects', 'subjectName')
            .populate('preferredTrainers', 'name salaryPerHour')
            .populate('subjectAssignments.subjectId', 'subjectName')
            .populate('subjectAssignments.teacherId', 'name');
        return NextResponse.json(students);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
