import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Task from '@/models/Task';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const tasks = await Task.find({}).sort({ createdAt: -1 });
        return NextResponse.json(tasks);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();
        const newTask = await Task.create(body);
        return NextResponse.json(newTask);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
