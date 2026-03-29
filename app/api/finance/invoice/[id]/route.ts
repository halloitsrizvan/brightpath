import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Fee from '@/models/Fee';
import Attendance from '@/models/Attendance';
import dbConnect from '@/lib/mongodb';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

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

        const classes = await Attendance.find({
            studentId: student._id,
            date: { $gte: startDate, $lte: endDate },
            status: 'Present'
        }).populate('subjectId');

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        // Website Colors
        const primaryColor = rgb(0.27, 0.188, 0.553); // #45308D
        const secondaryColor = rgb(0.992, 0.78, 0.043); // #FDC70B
        const textColor = rgb(0.1, 0.1, 0.1);
        const lightGray = rgb(0.95, 0.95, 0.95);

        let page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        let y = height - 40;

        // 1. Add Logo
        try {
            const logoPath = path.join(process.cwd(), 'public', 'logo.png');
            const logoBytes = fs.readFileSync(logoPath);
            const logoImage = await pdfDoc.embedPng(logoBytes);
            const logoDims = logoImage.scale(0.20); // Scaled slightly smaller too
            page.drawImage(logoImage, {
                x: 50,
                y: height - 120, // Moved down from height - 80
                width: logoDims.width,
                height: logoDims.height,
            });
        } catch (e) {
            console.warn("Logo not found or could not be loaded", e);
        }

        const safeStr = (str: any) => String(str || '').replace(/₹/g, 'INR');

        // 2. Header Title
        page.drawText('INVOICE', { 
            x: width - 150, 
            y: height - 90, // Moved down from height - 60
            size: 28, 
            font: boldFont, 
            color: primaryColor 
        });
        
        y = height - 150; // Moved separator down from height - 100
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 2, color: secondaryColor });
        y -= 30;

        // 3. Business Info vs Client Info
        // Left Side: Bill To
        page.drawText('BILL TO:', { x: 50, y, size: 10, font: boldFont, color: primaryColor });
        y -= 15;
        page.drawText(safeStr(student.fullName), { x: 50, y, size: 12, font: boldFont });
        y -= 15;
        page.drawText(safeStr(student.email), { x: 50, y, size: 10, font });
        y -= 15;
        page.drawText(safeStr(`Class: ${student.class || 'N/A'}`), { x: 50, y, size: 10, font });

        // Right Side: Invoice details
        let rightY = height - 180; // Adjusted from height - 130
        page.drawText(safeStr(`Invoice No: BP-${fee._id.toString().slice(-6).toUpperCase()}`), { x: 400, y: rightY, size: 10, font });
        rightY -= 15;
        page.drawText(safeStr(`Date: ${new Date().toLocaleDateString()}`), { x: 400, y: rightY, size: 10, font });
        rightY -= 15;
        page.drawText(safeStr(`Month: ${fee.month}`), { x: 400, y: rightY, size: 10, font });
        rightY -= 15;
        page.drawText('Status: PAID', { x: 400, y: rightY, size: 11, font: boldFont, color: primaryColor });

        y -= 40;

        // 4. Table Header
        page.drawRectangle({
            x: 50,
            y: y - 5,
            width: 500,
            height: 25,
            color: primaryColor
        });
        
        page.drawText('DATE', { x: 60, y: y + 5, size: 10, font: boldFont, color: rgb(1, 1, 1) });
        page.drawText('SUBJECT', { x: 150, y: y + 5, size: 10, font: boldFont, color: rgb(1, 1, 1) });
        page.drawText('HOURS', { x: 400, y: y + 5, size: 10, font: boldFont, color: rgb(1, 1, 1) }); // Changed to HOURS
        page.drawText('STATUS', { x: 500, y: y + 5, size: 10, font: boldFont, color: rgb(1, 1, 1) });
        
        y -= 30;

        // 5. Table Body
        classes.forEach((cls, index) => {
            if (y < 80) {
                page = pdfDoc.addPage([600, 800]);
                y = 750;
            }
            
            if (index % 2 === 0) {
                page.drawRectangle({
                    x: 50,
                    y: y - 5,
                    width: 500,
                    height: 20,
                    color: lightGray
                });
            }

            page.drawText(safeStr(new Date(cls.date).toLocaleDateString()), { x: 60, y, size: 9, font });
            page.drawText(safeStr((cls.subjectId as any)?.subjectName || 'Module'), { x: 150, y, size: 9, font });
            
            // Duration conversion: mins to hours
            const hours = ((cls.durationMinutes || 0) / 60).toFixed(2);
            page.drawText(safeStr(`${hours} hrs`), { x: 400, y, size: 9, font });
            
            page.drawText('Attended', { x: 500, y, size: 9, font });
            y -= 20;
        });

        // 6. Summary Block
        y -= 30;
        if (y < 120) {
            page = pdfDoc.addPage([600, 800]);
            y = 750;
        }

        page.drawRectangle({
            x: 350,
            y: y - 40,
            width: 200,
            height: 50,
            color: lightGray,
            borderColor: primaryColor,
            borderWidth: 1
        });

        const totalText = `GRAND TOTAL`;
        page.drawText(totalText, { x: 360, y: y - 10, size: 10, font: boldFont, color: primaryColor });
        
        const amountText = safeStr(`INR ${fee.amount.toLocaleString()}`);
        const amountWidth = boldFont.widthOfTextAtSize(amountText, 16);
        page.drawText(amountText, { x: 540 - amountWidth, y: y - 30, size: 16, font: boldFont, color: textColor });

        // 7. Footer
        y = 60;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 1, color: lightGray });
        y -= 20;
        page.drawText('Thank you for your payment. We appreciate your association with BrightPath Learning.', { 
            x: width / 2 - 190, 
            y, 
            size: 9, 
            font, 
            color: rgb(0.4, 0.4, 0.4) 
        });
        y -= 12;
        page.drawText('Questions? Contact us at billing@brightpath.com', { 
            x: width / 2 - 100, 
            y, 
            size: 8, 
            font, 
            color: primaryColor 
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
