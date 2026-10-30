import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { assertStrongPassword } from '@/lib/api/access';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        // No shared default password: every account gets its own
        assertStrongPassword(body.password);
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const { _id, role, ...fields } = body;
        const newStudent = new Student({ ...fields, password: hashedPassword });
        await newStudent.save();
        const { password, ...created } = newStudent.toObject();
        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        return errorResponse(err, 'POST /api/students');
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
            .select('-password')
            .populate('subjects', 'subjectName')
            .populate('preferredTrainers', user.role === 'admin' ? 'name salaryPerHour' : 'name')
            .populate('subjectAssignments.subjectId', 'subjectName')
            .populate('subjectAssignments.teacherId', 'name');
        return NextResponse.json(students);
    } catch (err: any) {
        return errorResponse(err, 'GET /api/students');
    }
}
