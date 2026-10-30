import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import Subject from '@/models/Subject';
import dbConnect from '@/lib/db/mongodb';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        const newSubject = new Subject(body);
        await newSubject.save();
        return NextResponse.json(newSubject, { status: 201 });
    } catch (err: any) {
        return errorResponse(err);
    }
}

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const subjects = await Subject.find();
        return NextResponse.json(subjects);
    } catch (err: any) {
        return errorResponse(err);
    }
}
