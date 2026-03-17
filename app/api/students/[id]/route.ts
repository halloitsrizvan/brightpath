import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { checkAuth } from '@/lib/auth';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'teacher', 'student']);
        const { id } = await params;

        if (user.role === 'student' && user.id !== id) {
            return NextResponse.json({ message: 'Forbidden: Cannot access other student profiles' }, { status: 403 });
        }

        const student = await Student.findById(id)
            .populate('preferredTrainers', 'name salaryPerHour')
            .populate('subjects', 'subjectName classLevel')
            .populate('subjectAssignments.subjectId', 'subjectName')
            .populate('subjectAssignments.teacherId', 'name salaryPerHour');
        return NextResponse.json(student);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'student']);
        const body = await req.json();
        const { id } = await params;

        if (user.role === 'student' && user.id !== id) {
            return NextResponse.json({ message: 'Forbidden: Cannot update other student profiles' }, { status: 403 });
        }

        // Only admin can change these sensitive fields if needed, 
        // or we just allow student to update their own contact info.
        if (user.role === 'student') {
            // Protect sensitive fields from being changed by student
            delete body.role;
            delete body.status;
            delete body.email;
            delete body.subjects;
            delete body.preferredTrainers;
        }

        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        }

        const updated = await Student.findByIdAndUpdate(id, body, { new: true });
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
        await Student.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Student deleted' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
