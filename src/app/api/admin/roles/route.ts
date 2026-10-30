import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Role from '@/models/Role';
import { DEFAULT_ROLES } from '@/lib/constants/roles';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        // Seed default roles if not existing
        for (const defRole of DEFAULT_ROLES) {
            const exists = await Role.findOne({ name: defRole.name });
            if (!exists) {
                await Role.create(defRole);
            }
        }

        const roles = await Role.find().sort({ createdAt: 1 });
        return NextResponse.json(roles);
    } catch (err: any) {
        return errorResponse(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const body = await req.json();

        if (!body.name || !body.name.trim()) {
            return NextResponse.json({ message: 'Role title is required' }, { status: 400 });
        }

        const existing = await Role.findOne({ name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') } });
        if (existing) {
            return NextResponse.json({ message: 'A role with this name already exists' }, { status: 400 });
        }

        const role = await Role.create({
            name: body.name.trim(),
            description: body.description || '',
            isSystem: false,
            permissions: body.permissions || []
        });

        return NextResponse.json(role);
    } catch (err: any) {
        return errorResponse(err);
    }
}
