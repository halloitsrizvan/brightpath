import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import { assertStrongPassword } from '@/lib/api/access';
import dbConnect from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        // Fetch all admins as requested (unifying admins and founders)
        const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
        return NextResponse.json(admins);
    } catch (err: any) {
        return errorResponse(err, 'Founders');
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();
        
        // No shared default password: every account gets its own
        assertStrongPassword(body.password);
        body.password = await bcrypt.hash(body.password, 10);

        const isExisting = await Admin.findOne({ email: body.email });
        if (isExisting) {
            return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 });
        }

        // Save new admin/founder
        const admin = await Admin.create({
            name: body.name,
            email: body.email,
            password: body.password,
            adminRole: body.adminRole || body.role || 'Super Admin',
            role: 'admin',
            baseSalary: Number(body.baseSalary) || 0,
            debtRemaining: Number(body.debtRemaining) || 0,
            isFounder: true
        });
        
        const { password, ...created } = admin.toObject();
        return NextResponse.json(created);
    } catch (err: any) {
        return errorResponse(err, 'Founders');
    }
}
