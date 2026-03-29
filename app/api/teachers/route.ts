import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkAuth } from '@/lib/auth';
import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import Student from '@/models/Student';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        const initialPassword = body.password || 'teacher123';
        const hashedPassword = await bcrypt.hash(initialPassword, 10);
        const newTeacher = new Teacher({ ...body, password: hashedPassword });
        await newTeacher.save();
        return NextResponse.json(newTeacher, { status: 201 });
    } catch (err: any) {
        console.error('API Error (POST /api/teachers):', err);
        const status = err.message.includes('authorization denied') || err.message.includes('token') ? 401 : 
                       err.message.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ message: err.message }, { status });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const teachers = await Teacher.find().select('-password').populate('subjects', 'subjectName');
        return NextResponse.json(teachers);
    } catch (err: any) {
        console.error('API Error (GET /api/teachers):', err);
        const status = err.message.includes('authorization denied') || err.message.includes('token') ? 401 : 
                       err.message.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ message: err.message }, { status });
    }
}
