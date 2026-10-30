import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import StaffSalaryAdjustment from '@/models/StaffSalaryAdjustment';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { searchParams } = new URL(req.url);
        const staffId = searchParams.get('staffId');

        const query = staffId ? { staffId } : {};
        const adjustments = await StaffSalaryAdjustment.find(query)
            .populate({
                path: 'staffId',
                select: 'name email adminRole role baseSalary'
            })
            .sort({ createdAt: -1 });

        return NextResponse.json(adjustments);
    } catch (err: any) {
        return errorResponse(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const user = await checkAuth(req, ['admin']);
        const body = await req.json();

        const { staffId, type, changeAmount, reason, effectiveDate, effectiveMonth } = body;

        if (!staffId || !type || changeAmount === undefined) {
            return NextResponse.json({ message: 'Staff ID, adjustment type and amount are required' }, { status: 400 });
        }

        const staff = await Admin.findById(staffId);
        if (!staff) {
            return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
        }

        const previousSalary = Number(staff.baseSalary) || 0;
        const delta = Math.abs(Number(changeAmount));
        let newSalary = previousSalary;

        if (type === 'increment') {
            newSalary = previousSalary + delta;
        } else if (type === 'cut') {
            newSalary = Math.max(0, previousSalary - delta);
        } else {
            return NextResponse.json({ message: 'Invalid adjustment type' }, { status: 400 });
        }

        // Update staff base salary
        staff.baseSalary = newSalary;
        await staff.save();

        // Create adjustment record
        const adjustment = await StaffSalaryAdjustment.create({
            staffId,
            type,
            changeAmount: delta,
            previousSalary,
            newSalary,
            reason: reason || (type === 'increment' ? 'Salary increment' : 'Salary deduction'),
            effectiveMonth: effectiveMonth || '',
            effectiveDate: effectiveDate ? new Date(effectiveDate) : new Date(),
            performedBy: user.email || 'Admin'
        });

        const populated = await StaffSalaryAdjustment.findById(adjustment._id).populate({
            path: 'staffId',
            select: 'name email adminRole role baseSalary'
        });

        return NextResponse.json({
            adjustment: populated,
            staff: {
                _id: staff._id,
                name: staff.name,
                email: staff.email,
                baseSalary: staff.baseSalary,
                adminRole: staff.adminRole || staff.role
            }
        });
    } catch (err: any) {
        return errorResponse(err);
    }
}
