import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Fee from '@/models/Fee';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const { id } = await params;
        const fee = await Fee.findById(id).populate('studentId');
        if (!fee) return NextResponse.json({ message: "Fee record not found" }, { status: 404 });

        const student = fee.studentId;
        const [mName, year] = fee.month.split(' ');
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const mIndex = monthNames.indexOf(mName);
        const startDate = new Date(parseInt(year), mIndex, 1);
        const endDate = new Date(parseInt(year), mIndex + 1, 0, 23, 59, 59);

        // Fetch classes for that month
        const classes = await Attendance.find({
            studentId: student._id,
            date: { $gte: startDate, $lte: endDate },
            status: 'Present'
        }).populate('subjectId');

        // Create PDF with pdf-lib (more reliable for Next.js)
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        let page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        let y = height - 50;

        // Header
        page.drawText('BRIGHTPATH LEARNING', { x: 50, y, size: 24, font: boldFont, color: rgb(0.2, 0.2, 0.2) });
        y -= 25;
        page.drawText('Official Payment Receipt', { x: 50, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
        y -= 20;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
        y -= 30;

        // Info Block
        page.drawText(`Student: ${student.fullName}`, { x: 50, y, size: 12, font: boldFont });
        page.drawText(`Receipt ID: BP-${fee._id.toString().slice(-6).toUpperCase()}`, { x: 400, y, size: 10, font });
        y -= 20;
        page.drawText(`Email: ${student.email}`, { x: 50, y, size: 11, font });
        page.drawText(`Date: ${new Date().toLocaleDateString()}`, { x: 400, y, size: 10, font });
        y -= 20;
        page.drawText(`Class: ${student.class || 'N/A'}`, { x: 50, y, size: 11, font });
        page.drawText(`Status: PAID`, { x: 400, y, size: 10, font: boldFont, color: rgb(0, 0.5, 0) });
        y -= 20;
        page.drawText(`Billing Month: ${fee.month}`, { x: 50, y, size: 11, font });
        y -= 40;

        // Table Header
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0, 0, 0) });
        y -= 15;
        page.drawText('Date', { x: 50, y, size: 10, font: boldFont });
        page.drawText('Subject', { x: 150, y, size: 10, font: boldFont });
        page.drawText('Duration', { x: 400, y, size: 10, font: boldFont });
        page.drawText('Status', { x: 500, y, size: 10, font: boldFont });
        y -= 10;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0, 0, 0) });
        y -= 25;

        // Classes List
        classes.forEach((cls) => {
            if (y < 100) {
                page = pdfDoc.addPage([600, 800]);
                y = 750;
            }
            page.drawText(new Date(cls.date).toLocaleDateString(), { x: 50, y, size: 10, font });
            page.drawText((cls.subjectId as any)?.subjectName || 'Module', { x: 150, y, size: 10, font });
            page.drawText(`${cls.durationMinutes} mins`, { x: 400, y, size: 10, font });
            page.drawText('Attended', { x: 500, y, size: 10, font });
            y -= 20;
        });

        // Summary
        y -= 20;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
        y -= 30;
        const totalText = `Total Amount Paid: INR ${fee.amount}`;
        const textWidth = font.widthOfTextAtSize(totalText, 14);
        page.drawText(totalText, { x: 550 - textWidth, y, size: 14, font: boldFont });

        y -= 60;
        page.drawText('Thank you for choosing BrightPath. This is a computer-generated receipt.', { 
            x: width / 2 - 150, 
            y, 
            size: 9, 
            font, 
            color: rgb(0.5, 0.5, 0.5) 
        });

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(pdfBytes as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=Invoice_${student.fullName.replace(/\s+/g, '_')}_${fee.month.replace(/\s+/g, '_')}.pdf`
            }
        });

    } catch (err: any) {
        console.error("PDF Generate Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
