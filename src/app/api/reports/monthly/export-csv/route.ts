import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';

// Ensure models
import '@/models/Student';
import '@/models/Teacher';
import '@/models/Subject';
import '@/models/Fee';
import '@/models/Salary';
import '@/models/Expense';
import '@/models/FounderSalary';
import '@/models/Exam';
import '@/models/Attendance';

import Attendance from '@/models/Attendance';
import Exam from '@/models/Exam';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Expense from '@/models/Expense';
import Student from '@/models/Student';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const { searchParams } = new URL(req.url);
        const monthStr = searchParams.get('month');
        const type = searchParams.get('type') || 'all'; // 'financials' | 'attendance' | 'exams' | 'students' | 'all'

        if (!monthStr) {
            return NextResponse.json({ message: "Month selection is required" }, { status: 400 });
        }

        const [monthName, yearStr] = monthStr.split(' ');
        const year = parseInt(yearStr);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthIndex = monthNames.indexOf(monthName);

        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

        let csvContent = '';

        if (type === 'students' || type === 'all') {
            csvContent += `--- STUDENT POPULATION & ACTIVITY AUDIT (${monthStr}) ---\n`;
            csvContent += `Student Name,Class,Syllabus,Location,Account Status,Enrolled Date,Month Sessions,Month Hours,Exam Avg %,Fee Status\n`;

            const students = await Student.find({}).lean();
            const attendances = await Attendance.find({
                date: { $gte: startDate, $lte: endDate },
                status: 'Present'
            });
            const exams = await Exam.find({
                $or: [
                    { examMonth: monthStr },
                    { examDate: { $gte: startDate, $lte: endDate } }
                ]
            });
            const fees = await Fee.find({ month: monthStr });

            const attMap: Record<string, { sessions: number; minutes: number }> = {};
            attendances.forEach((a: any) => {
                const sId = a.studentId?.toString();
                if (!sId) return;
                if (!attMap[sId]) attMap[sId] = { sessions: 0, minutes: 0 };
                attMap[sId].sessions += 1;
                attMap[sId].minutes += a.durationMinutes || 0;
            });

            const examMap: Record<string, { total: number; max: number }> = {};
            exams.forEach((ex: any) => {
                const sId = ex.studentId?.toString();
                if (!sId) return;
                if (!examMap[sId]) examMap[sId] = { total: 0, max: 0 };
                examMap[sId].total += ex.marks || 0;
                examMap[sId].max += ex.maxMarks || 100;
            });

            const feeMap: Record<string, string> = {};
            fees.forEach((f: any) => {
                const sId = f.studentId?.toString();
                if (!sId) return;
                feeMap[sId] = f.paymentStatus || 'pending';
            });

            students.forEach((s: any) => {
                const sId = s._id.toString();
                const att = attMap[sId] || { sessions: 0, minutes: 0 };
                const ex = examMap[sId];
                const examScore = ex && ex.max > 0 ? `${Math.round((ex.total / ex.max) * 100)}%` : 'N/A';
                const fStatus = feeMap[sId] || 'Unbilled';
                const joinDate = s.joinedAt ? new Date(s.joinedAt).toISOString().split('T')[0] : '';
                const hours = (att.minutes / 60).toFixed(1);

                csvContent += `"${(s.fullName || '').replace(/"/g, '""')}","Class ${(s.class || 'N/A')}","${(s.syllabus || 'N/A').replace(/"/g, '""')}","${s.residentialLocation || 'India'}","${s.status || 'active'}","${joinDate}",${att.sessions},${hours},"${examScore}","${fStatus}"\n`;
            });

            csvContent += '\n';
        }

        if (type === 'financials' || type === 'all') {
            csvContent += `--- FINANCIAL LEDGER (${monthStr}) ---\n`;
            csvContent += `Record Type,Entity Name,Category,Amount (INR),Payment Status,Cutoff / Date,Settlement ID\n`;
            
            const fees = await Fee.find({ month: monthStr }).populate('studentId', 'fullName');
            fees.forEach(f => {
                const sName = (f.studentId as any)?.fullName || 'Student';
                const cutoff = f.billingCutoffDate ? new Date(f.billingCutoffDate).toISOString().split('T')[0] : 'Full Month';
                csvContent += `"Student Fee","${sName.replace(/"/g, '""')}","Receivable",${f.amount || 0},"${f.paymentStatus}","${cutoff}","${f.settlementId || ''}"\n`;
            });

            const salaries = await Salary.find({ month: monthStr }).populate('teacherId', 'name');
            salaries.forEach(s => {
                const tName = (s.teacherId as any)?.name || 'Tutor';
                const cutoff = s.disbursementCutoffDate ? new Date(s.disbursementCutoffDate).toISOString().split('T')[0] : 'Full Month';
                csvContent += `"Tutor Payroll","${tName.replace(/"/g, '""')}","Remuneration",${s.totalSalary || 0},"${s.paidStatus}","${cutoff}","${s.settlementId || ''}"\n`;
            });

            const expenses = await Expense.find({ month: monthStr });
            expenses.forEach(e => {
                const dateStr = e.date ? new Date(e.date).toISOString().split('T')[0] : '';
                csvContent += `"Operating Expense","${(e.title || 'Expense').replace(/"/g, '""')}","${(e.category || 'General').replace(/"/g, '""')}",${e.amount || 0},"PAID","${dateStr}",""\n`;
            });

            csvContent += '\n';
        }

        if (type === 'attendance' || type === 'all') {
            csvContent += `--- LEARNING SESSIONS & ATTENDANCE (${monthStr}) ---\n`;
            csvContent += `Date,Student Name,Tutor Name,Subject,Duration (Hours),Duration (Mins),Student Bill Rate,Tutor Salary Rate,Session Revenue,Tutor Cost,Net Margin\n`;

            const attendances = await Attendance.find({
                date: { $gte: startDate, $lte: endDate },
                status: 'Present'
            })
            .populate('studentId', 'fullName')
            .populate('teacherId', 'name salaryPerHour')
            .populate('subjectId', 'name subjectName')
            .sort({ date: -1 });

            attendances.forEach((att: any) => {
                const dateStr = att.date ? new Date(att.date).toISOString().split('T')[0] : '';
                const sName = att.studentId?.fullName || 'Student';
                const tName = att.teacherId?.name || 'Tutor';
                const subName = att.subjectId?.subjectName || att.subjectId?.name || 'General';
                const hours = ((att.durationMinutes || 0) / 60);
                const billRate = att.billingRateAtTime || 0;
                const salRate = att.salaryRateAtTime || (att.teacherId?.salaryPerHour || 0);
                const rev = Math.round(hours * billRate);
                const cost = Math.round(hours * salRate);
                const margin = rev - cost;

                csvContent += `"${dateStr}","${sName.replace(/"/g, '""')}","${tName.replace(/"/g, '""')}","${subName.replace(/"/g, '""')}",${hours.toFixed(2)},${att.durationMinutes || 0},${billRate},${salRate},${rev},${cost},${margin}\n`;
            });

            csvContent += '\n';
        }

        if (type === 'exams' || type === 'all') {
            csvContent += `--- ACADEMIC EXAMS & ASSESSMENTS (${monthStr}) ---\n`;
            csvContent += `Date,Student Name,Subject,Score Obtained,Max Marks,Percentage %,Performance Tier\n`;

            const exams = await Exam.find({
                $or: [
                    { examMonth: monthStr },
                    { examDate: { $gte: startDate, $lte: endDate } }
                ]
            }).populate('studentId', 'fullName').sort({ examDate: -1 });

            exams.forEach((ex: any) => {
                const dateStr = ex.examDate ? new Date(ex.examDate).toISOString().split('T')[0] : '';
                const sName = ex.studentId?.fullName || 'Student';
                const pct = ex.maxMarks > 0 ? ((ex.marks / ex.maxMarks) * 100).toFixed(1) : '0';
                const tier = parseFloat(pct) >= 80 ? 'Mastery' : parseFloat(pct) >= 60 ? 'Proficient' : parseFloat(pct) >= 45 ? 'Developing' : 'At-Risk';

                csvContent += `"${dateStr}","${sName.replace(/"/g, '""')}","${(ex.subject || '').replace(/"/g, '""')}",${ex.marks || 0},${ex.maxMarks || 0},${pct}%,"${tier}"\n`;
            });
        }

        const filename = `BrightPath_Analytics_${monthStr.replace(/\s+/g, '_')}_${type}.csv`;

        return new Response(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });

    } catch (err: any) {
        console.error("CSV Export Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
