import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import { BlogService } from '@/lib/services/blogService';

export async function GET(req: NextRequest) {
    try {
        await checkAuth(req, ['admin']);
        const posts = await BlogService.getAllPosts();
        return NextResponse.json(posts);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await checkAuth(req, ['admin']);
        const data = await req.json();
        const post = await BlogService.createPost(data);
        return NextResponse.json(post);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
