import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Role from '@/models/Role';

export async function GET(req: NextRequest, { params }: { params: any }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const role = await Role.findById(id);
        if (!role) return NextResponse.json({ message: 'Role not found' }, { status: 404 });
        return NextResponse.json(role);
    } catch (err: any) {
        return errorResponse(err);
    }
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        const body = await req.json();

        const role = await Role.findById(id);
        if (!role) return NextResponse.json({ message: 'Role not found' }, { status: 404 });

        if (role.isSystem && body.name && body.name !== role.name) {
            return NextResponse.json({ message: 'System role names cannot be renamed' }, { status: 400 });
        }

        if (body.name && body.name.trim() !== role.name) {
            const duplicate = await Role.findOne({ 
                _id: { $ne: id }, 
                name: { $regex: new RegExp(`^${body.name.trim()}$`, 'i') } 
            });
            if (duplicate) {
                return NextResponse.json({ message: 'Another role with this name already exists' }, { status: 400 });
            }
        }

        role.name = body.name ? body.name.trim() : role.name;
        role.description = body.description !== undefined ? body.description : role.description;
        if (body.permissions) {
            role.permissions = body.permissions;
        }

        await role.save();
        return NextResponse.json(role);
    } catch (err: any) {
        return errorResponse(err);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;

        const role = await Role.findById(id);
        if (!role) return NextResponse.json({ message: 'Role not found' }, { status: 404 });

        if (role.isSystem) {
            return NextResponse.json({ message: 'System defined roles cannot be deleted' }, { status: 400 });
        }

        await Role.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Role deleted successfully' });
    } catch (err: any) {
        return errorResponse(err);
    }
}
