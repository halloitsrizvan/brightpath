import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Log the enquiry for now (In production this would save to MongoDB)
        console.log("New Public Enquiry Received:", body);

        // Here you would connect to your DB and save:
        // await db.collection('public_enquiries').insertOne({...body, createdAt: new Date()});

        return NextResponse.json({ message: "Enquiry submitted successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error processing enquiry:", error);
        return NextResponse.json({ error: "Failed to process enquiry" }, { status: 500 });
    }
}
