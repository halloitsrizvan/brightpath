import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkAuth } from '@/lib/auth';
import Student from '@/models/Student';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        const defaultPassword = await bcrypt.hash('student123', 10);
        const newStudent = new Student({ ...body, password: defaultPassword });
        await newStudent.save();
        return NextResponse.json(newStudent, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);
        const students = await Student.find().populate('teacherIds', 'name');
        return NextResponse.json(students);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
