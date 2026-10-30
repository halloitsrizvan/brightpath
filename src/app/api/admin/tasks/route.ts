import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import Task from '@/models/Task';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/db/mongodb';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const tasks = await Task.find({}).populate('allocatedAdmin', 'name').sort({ createdAt: -1 });
        return NextResponse.json(tasks);
    } catch (err: any) {
        return errorResponse(err);
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
        return errorResponse(err);
    }
}
