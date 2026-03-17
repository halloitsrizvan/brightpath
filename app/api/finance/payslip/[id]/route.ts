import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Salary from '@/models/Salary';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin', 'teacher']);

        const { id } = await params;
        const salary = await Salary.findById(id).populate('teacherId');
        if (!salary) return NextResponse.json({ message: "Salary record not found" }, { status: 404 });

        const teacher = salary.teacherId;
        const [mName, year] = salary.month.split(' ');
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const mIndex = monthNames.indexOf(mName);
        const startDate = new Date(parseInt(year), mIndex, 1);
        const endDate = new Date(parseInt(year), mIndex + 1, 0, 23, 59, 59);

        // Fetch classes for that month for this teacher
        const classes = await Attendance.find({
            teacherId: teacher._id,
            date: { $gte: startDate, $lte: endDate },
            status: 'Present'
        }).populate('studentId').populate('subjectId');

        // Create PDF
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        let page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        let y = height - 50;

        // Header
        page.drawText('BRIGHTPATH LEARNING', { x: 50, y, size: 24, font: boldFont, color: rgb(0.2, 0.2, 0.2) });
        y -= 25;
        page.drawText('Official Monthly Payslip', { x: 50, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        y -= 20;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
        y -= 30;

        // Tutor Info Block
        page.drawText(`Tutor: ${teacher.name}`, { x: 50, y, size: 12, font: boldFont });
        page.drawText(`Payslip ID: PS-${salary._id.toString().slice(-6).toUpperCase()}`, { x: 400, y, size: 10, font });
        y -= 20;
        page.drawText(`Email: ${teacher.email}`, { x: 50, y, size: 11, font });
        page.drawText(`Process Date: ${new Date().toLocaleDateString()}`, { x: 400, y, size: 10, font });
        y -= 20;
        page.drawText(`Base Rate: INR ${salary.salaryPerHour}/hr`, { x: 50, y, size: 11, font });
        page.drawText(`Status: DISBURSED`, { x: 400, y, size: 10, font: boldFont, color: rgb(0, 0.5, 0) });
        y -= 20;
        page.drawText(`Payroll Month: ${salary.month}`, { x: 50, y, size: 11, font });
        y -= 40;

        // Earnings Calculation
        page.drawText('Earnings Breakdown', { x: 50, y, size: 13, font: boldFont });
        y -= 25;
        const baseEarnings = Math.round(salary.totalHours * salary.salaryPerHour);
        const incentive = salary.totalSalary - baseEarnings;

        page.drawText(`Base Pay (${salary.totalHours} hrs x INR ${salary.salaryPerHour})`, { x: 50, y, size: 10, font });
        page.drawText(`INR ${baseEarnings}`, { x: 450, y, size: 10, font });
        y -= 20;
        if (incentive > 0) {
            page.drawText('Incentives & Performance Bonus', { x: 50, y, size: 10, font });
            page.drawText(`INR ${incentive}`, { x: 450, y, size: 10, font });
            y -= 20;
        }
        page.drawLine({ start: { x: 400, y: y + 10 }, end: { x: 550, y: y + 10 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
        y -= 5;
        page.drawText('Gross Total', { x: 50, y, size: 11, font: boldFont });
        page.drawText(`INR ${salary.totalSalary}`, { x: 450, y, size: 11, font: boldFont });
        y -= 50;

        // Class Activity Ledger
        page.drawText('Class Activity Ledger', { x: 50, y, size: 13, font: boldFont });
        y -= 15;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0, 0, 0) });
        y -= 15;
        page.drawText('Date', { x: 50, y, size: 9, font: boldFont });
        page.drawText('Student', { x: 130, y, size: 9, font: boldFont });
        page.drawText('Subject', { x: 300, y, size: 9, font: boldFont });
        page.drawText('Duration', { x: 450, y, size: 9, font: boldFont });
        y -= 10;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0, 0, 0) });
        y -= 20;

        const sortedClasses = classes.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        for (const cls of sortedClasses) {
            if (y < 80) {
                page = pdfDoc.addPage([600, 800]);
                y = 750;
            }
            page.drawText(new Date(cls.date).toLocaleDateString(), { x: 50, y, size: 9, font });
            page.drawText((cls.studentId as any)?.fullName || 'N/A', { x: 130, y, size: 9, font });
            page.drawText((cls.subjectId as any)?.subjectName || 'N/A', { x: 300, y, size: 9, font });
            page.drawText(`${cls.durationMinutes} mins`, { x: 450, y, size: 9, font });
            y -= 18;
        }

        y -= 40;
        page.drawText('This payslip is a computer-generated confirmation of salary disbursement.', { 
            x: width / 2 - 170, 
            y, 
            size: 9, 
            font, 
            color: rgb(0.5, 0.5, 0.5) 
        });

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(pdfBytes as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=Payslip_${teacher.name.replace(/\s+/g, '_')}_${salary.month.replace(/\s+/g, '_')}.pdf`
            }
        });

    } catch (err: any) {
        console.error("Payslip Generate Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
