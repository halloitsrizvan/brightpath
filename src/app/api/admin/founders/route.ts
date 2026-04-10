import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Founder from '@/models/Founder';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const founders = await Founder.find().sort({ createdAt: -1 });
        return NextResponse.json(founders);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();
        const founder = await Founder.create(body);
        return NextResponse.json(founder);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
