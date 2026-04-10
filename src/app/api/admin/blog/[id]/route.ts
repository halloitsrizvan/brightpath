import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import { BlogService } from '@/lib/services/blogService';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const data = await req.json();
        const post = await BlogService.updatePost(id, data);
        return NextResponse.json(post);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await checkAuth(req, ['admin']);
        const { id } = await params;
        await BlogService.deletePost(id);
        return NextResponse.json({ message: 'Post deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
