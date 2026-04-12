import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/db/mongodb';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;
        
        // Find the record first to get the date for re-sync
        const record = await Attendance.findById(id);
        if (!record) {
            return NextResponse.json({ message: 'Attendance record not found' }, { status: 404 });
        }

        await Attendance.findByIdAndDelete(id);

        // Automatically sync financials for the month of this attendance after deletion
        try {
            const attDate = new Date(record.date);
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthStr = `${monthNames[attDate.getMonth()]} ${attDate.getFullYear()}`;
            const { syncFinancialsForMonth } = await import('@/lib/finance-sync');
            await syncFinancialsForMonth(monthStr);
        } catch (syncErr) {
            console.error("Auto-sync failed after deletion:", syncErr);
        }

        return NextResponse.json({ message: 'Attendance log deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
