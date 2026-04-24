import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Lead from '@/models/Lead';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        
        const lead = await Lead.create({
            fullName: body.fullName,
            email: body.email,
            phoneNumber: body.phoneNumber,
            whatsappNumber: body.whatsappNumber,
            country: body.country,
            studentClass: body.studentClass,
            userType: body.userType,
            leadType: body.leadType || 'enquiry',
            status: 'pending'
        });

        return NextResponse.json({ message: "Lead captured successfully", id: lead._id }, { status: 201 });
    } catch (error: any) {
        console.error("Error capturing lead:", error);
        return NextResponse.json({ error: error.message || "Failed to process lead" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        // Here you would normally check for admin session
        const leads = await Lead.find({}).sort({ createdAt: -1 });
        return NextResponse.json(leads);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        await dbConnect();
        const { id, status, notes } = await request.json();
        const lead = await Lead.findByIdAndUpdate(id, { status, notes }, { new: true });
        return NextResponse.json(lead);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
