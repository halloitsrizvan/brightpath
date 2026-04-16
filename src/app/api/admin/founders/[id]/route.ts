import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Founder from '@/models/Founder';

export async function GET(req: NextRequest, { params }: { params: any }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const founder = await Founder.findById(id);
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
        const founder = await Founder.findByIdAndUpdate(id, body, { returnDocument: 'after' });
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
        const founder = await Founder.findByIdAndDelete(id);
        if (!founder) return NextResponse.json({ message: 'Founder not found' }, { status: 404 });
        return NextResponse.json({ message: 'Founder deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
