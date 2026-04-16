import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        // Fetch all admins as requested (unifying admins and founders)
        const admins = await Admin.find().sort({ createdAt: -1 });
        return NextResponse.json(admins);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();
        
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        } else {
            body.password = await bcrypt.hash('admin123', 10);
        }

        const isExisting = await Admin.findOne({ email: body.email });
        if (isExisting) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }

        // Default new admins to be founders if they are being added here
        const admin = await Admin.create({
            ...body,
            isFounder: true,
            role: 'admin'
        });
        
        return NextResponse.json(admin);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
