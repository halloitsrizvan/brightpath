import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db/mongodb';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { assertStrongPassword } from '@/lib/api/access';
import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import Student from '@/models/Student';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        // No shared default password: every account gets its own
        assertStrongPassword(body.password);
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const { _id, role, ...fields } = body;
        const newTeacher = new Teacher({ ...fields, password: hashedPassword });
        await newTeacher.save();
        const { password, ...created } = newTeacher.toObject();
        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        return errorResponse(err, 'POST /api/teachers');
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        
        // 1. Attempt to identify administrator for full data access
        let isAdmin = false;
        try {
            isAdmin = (await checkAuth(req, ['admin'])).role === 'admin';
        } catch (authErr) {
            // Not an admin or invalid token, proceed as public
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
        return errorResponse(err, 'GET /api/teachers');
    }
}
