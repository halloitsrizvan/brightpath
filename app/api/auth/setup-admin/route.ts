import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { name, email, password } = await req.json();

        let admin = await Admin.findOne({ email });
        if (admin) return NextResponse.json({ message: 'Admin already exists' }, { status: 400 });

        const hashedPassword = await bcrypt.hash(password, 10);
        admin = new Admin({ name, email, password: hashedPassword });
        await admin.save();

        return NextResponse.json({ message: 'Admin created successfully' }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server error' }, { status: 500 });
    }
}
