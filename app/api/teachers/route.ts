import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkAuth } from '@/lib/auth';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        const defaultPassword = await bcrypt.hash('teacher123', 10);
        const newTeacher = new Teacher({ ...body, password: defaultPassword });
        await newTeacher.save();
        return NextResponse.json(newTeacher, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const teachers = await Teacher.find().select('-password').populate('students', 'fullName');
        return NextResponse.json(teachers);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
