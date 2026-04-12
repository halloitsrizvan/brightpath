import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Native Next.js way to clear cookies
    response.cookies.delete('token');
    response.cookies.delete('user');

    return response;
}
