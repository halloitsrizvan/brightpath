import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest, { params }: { params: any }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const founder = await Admin.findById(id);
        if (!founder) return NextResponse.json({ message: 'Founder not found' }, { status: 404 });
        return NextResponse.json(founder);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();

        const updateData: any = {};
        if (body.name) updateData.name = body.name;
        if (body.email) updateData.email = body.email;
        if (body.password) {
            updateData.password = await bcrypt.hash(body.password, 10);
        }
        if (body.adminRole) {
            updateData.adminRole = body.adminRole;
        } else if (body.role && body.role !== 'admin') {
            updateData.adminRole = body.role;
        }
        if (body.baseSalary !== undefined) {
            updateData.baseSalary = Number(body.baseSalary) || 0;
        }
        if (body.debtRemaining !== undefined) {
            updateData.debtRemaining = Number(body.debtRemaining) || 0;
        }
        updateData.role = 'admin';

        const founder = await Admin.findByIdAndUpdate(
            id, 
            { $set: updateData }, 
            { returnDocument: 'after', new: true }
        );
        if (!founder) return NextResponse.json({ message: 'Founder not found' }, { status: 404 });
        return NextResponse.json(founder);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        
        // We probably don't want to actually delete an admin, maybe just remove isFounder?
        // But the user asked for "founders and admins are same", so deleting a founder should probably remove their record.
        const founder = await Admin.findByIdAndDelete(id);
        if (!founder) return NextResponse.json({ message: 'Founder not found' }, { status: 404 });
        return NextResponse.json({ message: 'Founder deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
