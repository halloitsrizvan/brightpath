import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { assertCanAccessStudent, assertSelfOrAdmin, assertStrongPassword, pick } from '@/lib/api/access';

// Students may only update their own contact details; everything else is admin-only
const STUDENT_EDITABLE = ['contactNumber', 'whatsappNumber', 'parentName', 'district', 'password'] as const;
const ADMIN_EDITABLE = [
    'fullName', 'dateOfBirth', 'class', 'syllabus', 'district', 'residentialLocation', 'parentName',
    'contactNumber', 'whatsappNumber', 'email', 'password', 'subjects', 'preferredTrainers',
    'subjectAssignments', 'joinedAt', 'status'
] as const;
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'teacher', 'student']);
        const { id } = await params;

        await assertCanAccessStudent(user, id);

        const student = await Student.findById(id)
            .select('-password')
            .populate('preferredTrainers', 'name salaryPerHour')
            .populate('subjects', 'subjectName classLevel')
            .populate('subjectAssignments.subjectId', 'subjectName')
            .populate('subjectAssignments.teacherId', 'name salaryPerHour');
        return NextResponse.json(student);
    } catch (err: any) {
        return errorResponse(err, 'Student Profile');
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'student']);
        const { id } = await params;
        assertSelfOrAdmin(user, id, 'other student profiles');

        const body = pick(await req.json(), user.role === 'admin' ? ADMIN_EDITABLE : STUDENT_EDITABLE);

        if (body.password) {
            assertStrongPassword(body.password);
            body.password = await bcrypt.hash(body.password, 10);
        }

        const updated = await Student.findByIdAndUpdate(id, body, { new: true }).select('-password');
        return NextResponse.json(updated);
    } catch (err: any) {
        return errorResponse(err, 'Student Profile');
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        await Student.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Student deleted' });
    } catch (err: any) {
        return errorResponse(err, 'Student Profile');
    }
}
