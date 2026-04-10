import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Subject from '@/models/Subject';
import dbConnect from '@/lib/mongodb';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        await Subject.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Subject deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
