import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

// FORCE MODEL REGISTRATION
import '@/models/Student';
import '@/models/Subject';
import '@/models/Teacher';
import '@/models/Fee';
import '@/models/Attendance';

import Fee from '@/models/Fee';
import Attendance from '@/models/Attendance';
import Student from '@/models/Student';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    let debugId = "unknown";
    try {
        await dbConnect();
        
        const { id: idParam } = await params;
        debugId = idParam;

        try {
            await checkAuth(req, ['admin', 'student']);
        } catch (authErr: any) {
            return NextResponse.json({ message: authErr.message }, { status: 403 });
        }

        if (!idParam) return NextResponse.json({ message: "Invalid ID parameter" }, { status: 400 });

        const ids = idParam.split(',');
        const fees = await Fee.find({ _id: { $in: ids } }).populate({
            path: 'studentId',
            model: 'Student'
        });

        if (fees.length === 0) return NextResponse.json({ message: "Fee records not found" }, { status: 404 });
        
        const student = fees[0].studentId;
        if (!student) return NextResponse.json({ message: "Student relationship could not be populated" }, { status: 500 });
        
        // Use set to avoid duplicate classes if months overlap (though they shouldn't)
        let allActivityRecords: any[] = [];
        let totalAmount = 0;
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const billingMonths: string[] = [];

        for (const fee of fees) {
            totalAmount += (fee.amount || 0);
            billingMonths.push(fee.month);

            const monthParts = (fee.month || '').trim().split(/\s+/);
            if (monthParts.length >= 2) {
                const rawMName = monthParts[0];
                const year = monthParts[1];
                const mName = rawMName.charAt(0).toUpperCase() + rawMName.slice(1).toLowerCase();
                const mIndex = monthNames.indexOf(mName);
                
                if (mIndex !== -1) {
                    const startDate = new Date(parseInt(year), mIndex, 1);
                    const endDate = new Date(parseInt(year), mIndex + 1, 0, 23, 59, 59);

                    const monthClasses = await Attendance.find({
                        studentId: student._id,
                        date: { $gte: startDate, $lte: endDate },
                        status: 'Present'
                    }).populate({
                        path: 'subjectId',
                        model: 'Subject'
                    });
                    allActivityRecords = [...allActivityRecords, ...monthClasses];
                }
            }
        }

        // Sort classes by date
        allActivityRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        const primaryColor = rgb(0.27, 0.188, 0.553);
        const secondaryColor = rgb(0.992, 0.78, 0.043);
        const textColor = rgb(0.1, 0.1, 0.1);
        const lightGray = rgb(0.95, 0.95, 0.95);

        let page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();

        // 1. Logo Logic
        try {
            const fs = require('fs');
            const path = require('path');
            const logoPath = path.join(process.cwd(), 'public', 'logo.png');
            if (fs.existsSync(logoPath)) {
                const logoBytes = fs.readFileSync(logoPath);
                const logoImage = await pdfDoc.embedPng(logoBytes);
                const logoDims = logoImage.scale(0.20);
                page.drawImage(logoImage, {
                    x: 50,
                    y: height - 120,
                    width: logoDims.width,
                    height: logoDims.height,
                });

                page.drawText('BrightPath', {
                    x: 50 + logoDims.width + 10,
                    y: height - 85,
                    size: 24,
                    font: boldFont,
                    color: primaryColor,
                });
            }
        } catch (logoE) {
            console.warn("Logo overlay skipped due to error", logoE);
        }

        const safeStr = (str: any) => String(str || '').replace(/₹/g, 'INR');

        // 2. Content
        page.drawText('INVOICE', { x: width - 200, y: height - 90, size: 28, font: boldFont, color: primaryColor });
        let y = height - 150;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 2, color: secondaryColor });
        y -= 30;

        page.drawText('BILL TO:', { x: 50, y, size: 10, font: boldFont, color: primaryColor });
        y -= 15;
        page.drawText(safeStr(student.fullName), { x: 50, y, size: 12, font: boldFont });
        y -= 15;
        page.drawText(safeStr(student.email), { x: 50, y, size: 10, font });
        y -= 15;
        page.drawText(safeStr(`Class: ${student.class || 'N/A'}`), { x: 50, y, size: 10, font });

        let rightY = height - 180;
        page.drawText(safeStr(`Invoice No: BP-MULTI-${ids[0].slice(-4).toUpperCase()}`), { x: 400, y: rightY, size: 10, font });
        rightY -= 15;
        page.drawText(safeStr(`Date: ${new Date().toLocaleDateString()}`), { x: 400, y: rightY, size: 10, font });
        rightY -= 15;
        const monthsStr = billingMonths.join(', ');
        const displayMonths = monthsStr.length > 25 ? `${billingMonths.length} Months Statement` : monthsStr;
        page.drawText(safeStr(`Months: ${displayMonths}`), { x: 400, y: rightY, size: 10, font });
        rightY -= 15;
        page.drawText('Status: PAID', { x: 400, y: rightY, size: 11, font: boldFont, color: rgb(0.1, 0.5, 0.1) });

        y -= 40;
        page.drawText('LEARNING ACTIVITY LEDGER', { x: 50, y, size: 11, font: boldFont, color: primaryColor });
        y -= 25;

        page.drawRectangle({ x: 50, y: y - 5, width: 500, height: 25, color: primaryColor });
        page.drawText('DATE', { x: 60, y: y + 5, size: 9, font: boldFont, color: rgb(1, 1, 1) });
        page.drawText('SUBJECT', { x: 150, y: y + 5, size: 9, font: boldFont, color: rgb(1, 1, 1) });
        page.drawText('HOURS', { x: 400, y: y + 5, size: 9, font: boldFont, color: rgb(1, 1, 1) });
        page.drawText('STATUS', { x: 500, y: y + 5, size: 9, font: boldFont, color: rgb(1, 1, 1) });
        y -= 30;

        allActivityRecords.forEach((cls, index) => {
            if (y < 80) { page = pdfDoc.addPage([600, 800]); y = 750; }
            if (index % 2 === 0) page.drawRectangle({ x: 50, y: y - 5, width: 500, height: 20, color: lightGray });
            page.drawText(safeStr(new Date(cls.date).toLocaleDateString()), { x: 60, y: y, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
            page.drawText(safeStr((cls.subjectId as any)?.subjectName || 'Module'), { x: 150, y: y, size: 9, font });
            page.drawText(safeStr(`${((cls.durationMinutes || 0) / 60).toFixed(2)} hrs`), { x: 400, y: y, size: 9, font });
            page.drawText('Attended', { x: 500, y: y, size: 9, font });
            y -= 20;
        });

        y -= 30;
        if (y < 120) { page = pdfDoc.addPage([600, 800]); y = 750; }
        page.drawRectangle({ x: 350, y: y - 40, width: 200, height: 50, color: lightGray, borderColor: primaryColor, borderWidth: 1 });
        page.drawText('GRAND TOTAL', { x: 360, y: y - 10, size: 10, font: boldFont, color: primaryColor });
        const amountText = safeStr(`INR ${totalAmount.toLocaleString()}`);
        const amountWidth = boldFont.widthOfTextAtSize(amountText, 16);
        page.drawText(amountText, { x: 540 - amountWidth, y: y - 30, size: 16, font: boldFont, color: textColor });

        // 6. Footer
        const fy = 60;
        page.drawLine({ start: { x: 50, y: fy }, end: { x: 550, y: fy }, thickness: 1, color: lightGray });
        page.drawText('Thank you for your payment. We appreciate your association with BrightPath Learning.', { x: width / 2 - 190, y: fy - 20, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
        page.drawText('Questions? Contact us at billing@brightpath.com', { x: width / 2 - 100, y: fy - 32, size: 8, font, color: primaryColor });

        const pdfBytes = await pdfDoc.save();
        return new NextResponse(pdfBytes as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=Receipt_${student.fullName.replace(/\s+/g, '_')}_Multi_Month.pdf`
            }
        });
    } catch (err: any) {
        console.error("PDF Generate Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
