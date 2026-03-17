import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Attendance from '@/models/Attendance';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['teacher', 'admin']);
        const body = await req.json();

        // If the user is an admin running the teacher dashboard, 
        // they might not have a Teacher profile to augment.
        const teacherId = user.role === 'teacher' ? user.id : body.teacherId || user.id;

        const attendance = new Attendance({ ...body, teacherId });
        await attendance.save();

        // Automatically sync financials for the month of this attendance
        try {
            const attDate = new Date(body.date || new Date());
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthStr = `${monthNames[attDate.getMonth()]} ${attDate.getFullYear()}`;
            const { syncFinancialsForMonth } = await import('@/lib/finance-sync');
            await syncFinancialsForMonth(monthStr);
        } catch (syncErr) {
            console.error("Auto-sync failed:", syncErr);
        }

        return NextResponse.json(attendance, { status: 201 });
    } catch (err: any) {
        if (err.message && err.message.includes('Forbidden')) {
            return NextResponse.json({ message: err.message }, { status: 403 });
        }
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin', 'student', 'teacher']);

        let query = {};
        if (user.role === 'student') {
            query = { studentId: user.id };
        } else if (user.role === 'teacher') {
            query = { teacherId: user.id };
        }

        const list = await Attendance.find(query)
            .populate('studentId', 'fullName')
            .populate('teacherId', 'name')
            .populate('subjectId', 'subjectName');
        return NextResponse.json(list);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
