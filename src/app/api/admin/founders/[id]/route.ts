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
        const founder = await Admin.findOne({ _id: id, isFounder: true });
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

        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        } else {
            delete body.password; // Don't overwrite if not provided
        }

        const founder = await Admin.findOneAndUpdate(
            { _id: id, isFounder: true }, 
            body, 
            { returnDocument: 'after' }
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
        const founder = await Admin.findOneAndDelete({ _id: id, isFounder: true });
        if (!founder) return NextResponse.json({ message: 'Founder not found' }, { status: 404 });
        return NextResponse.json({ message: 'Founder deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
