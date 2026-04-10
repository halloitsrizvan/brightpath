import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';
import dbConnect from '@/lib/db/mongodb';
import { checkAuth } from '@/lib/api/auth';
import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import Student from '@/models/Student';

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
        
        // 1. Attempt to identify administrator for full data access
        let isAdmin = false;
        const token = req.cookies.get('token')?.value;
        const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');

        if (token) {
            try {
                const { payload } = await jwtVerify(token, JWT_SECRET);
                if (payload.role === 'admin') isAdmin = true;
            } catch (authErr) {
                // Not an admin or invalid token, proceed as public
            }
        }

        if (isAdmin) {
            // Institutional Registry View: Total transparency for payroll and management
            const teachers = await Teacher.find().select('-password').populate('subjects', 'subjectName');
            return NextResponse.json(teachers);
        }

        // Public Knowledge Hub View: Sanitized faculty profiles for prospective enrollment
        const teachers = await Teacher.find({ status: 'active' })
            .select('-password -email -phone -salaryPerHour -idCard -resume -joinedAt')
            .populate('subjects', 'subjectName');
        
        return NextResponse.json(teachers);
    } catch (err: any) {
        console.error('API Error (GET /api/teachers):', err);
        const status = err.message.includes('authorization denied') || err.message.includes('token') ? 401 : 
                       err.message.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ message: err.message }, { status });
    }
}
