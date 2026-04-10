import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';
import Salary from '@/models/Salary';
import Attendance from '@/models/Attendance';
import IncentiveRule from '@/models/IncentiveRule';
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

        // Calculate actual performance-based earnings vs incentives
        let baseEarnings = 0;
        for (const cls of classes) {
            const student = cls.studentId as any;
            if (!student) continue;
            
            let rate = (teacher as any).salaryPerHour || 0;
            // Check for specific override
            if (student.subjectAssignments) {
                const assignment = student.subjectAssignments.find((a: any) => 
                    (a.subjectId?.toString() === cls.subjectId?._id?.toString() || a.subjectId?.toString() === cls.subjectId?.toString()) && 
                    a.teacherId?.toString() === (teacher as any)._id.toString()
                );
                if (assignment && assignment.salaryPerHour > 0) rate = assignment.salaryPerHour;
            }
            baseEarnings += (cls.durationMinutes / 60) * rate;
        }

        const allRules = await IncentiveRule.find({ active: true });
        const reachedIncentive = allRules
            .filter(r => r.targetTeachers.some((tid: any) => tid.toString() === (teacher as any)._id.toString()) && r.targetHours <= salary.totalHours)
            .reduce((max, r) => Math.max(max, r.incentiveAmount), 0);

        // Create PDF
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        let page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();
        let y = height;

        // Brand Palette
        const primaryColor = rgb(0.27, 0.188, 0.553); // #45308D
        const secondaryColor = rgb(0.992, 0.78, 0.043); // #FDC70B
        const lightGray = rgb(0.95, 0.95, 0.95);
        const darkGray = rgb(0.4, 0.4, 0.4);

        // 1. Add Logo
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

                // Add BrightPath text next to logo
                page.drawText('BrightPath', {
                    x: 50 + logoDims.width + 10,
                    y: height - 80,
                    size: 24,
                    font: boldFont,
                    color: primaryColor,
                });
            }
        } catch (e) {
            console.warn("Logo processing failed", e);
        }

        const safeStr = (str: any) => String(str || '').replace(/₹/g, 'INR');

        // 2. Header Title
        page.drawText('PAYSLIP', { 
            x: width - 150, 
            y: height - 90, 
            size: 28, 
            font: boldFont, 
            color: primaryColor 
        });
        
        y = height - 150;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 2, color: secondaryColor });
        y -= 30;

        // 3. Faculty Info Block
        // Left Side: Recipient
        page.drawText('RECIPIENT:', { x: 50, y, size: 10, font: boldFont, color: primaryColor });
        y -= 15;
        page.drawText(safeStr((teacher as any).name), { x: 50, y, size: 12, font: boldFont });
        y -= 15;
        page.drawText(safeStr((teacher as any).email), { x: 50, y, size: 10, font });

        // Right Side: Summary
        let rightY = height - 180;
        page.drawText(safeStr(`Payslip ID: PS-${salary._id.toString().slice(-6).toUpperCase()}`), { x: 400, y: rightY, size: 10, font });
        rightY -= 15;
        page.drawText(safeStr(`Process Date: ${new Date().toLocaleDateString()}`), { x: 400, y: rightY, size: 10, font });
        rightY -= 15;
        page.drawText(safeStr(`Month: ${salary.month}`), { x: 400, y: rightY, size: 10, font });
        rightY -= 15;
        page.drawText('Status: DISBURSED', { x: 400, y: rightY, size: 11, font: boldFont, color: rgb(0.1, 0.5, 0.1) });

        y -= 40;

        // 4. Earnings Breakdown
        page.drawText('EARNINGS BREAKDOWN', { x: 50, y, size: 11, font: boldFont, color: primaryColor });
        y -= 25;
        
        // Base Remuneration
        page.drawText(`Qualified Remuneration (${salary.totalHours.toFixed(2)} hrs total)`, { x: 50, y, size: 11, font });
        page.drawText(`INR ${Math.round(baseEarnings).toLocaleString()}`, { x: width - 150, y, size: 11, font: boldFont });
        y -= 20;

        // Incentives
        if (reachedIncentive > 0) {
            page.drawText('Performance Incentive', { x: 50, y, size: 11, font });
            page.drawText(`INR ${reachedIncentive.toLocaleString()}`, { x: width - 150, y, size: 11, font: boldFont });
            y -= 20;
        }
        
        y -= 20; // Extra padding before the box

        // Net Amount Block
        page.drawRectangle({ x: width - 250, y: y - 10, width: 200, height: 45, color: lightGray, borderColor: primaryColor, borderWidth: 1 });
        page.drawText('NET EARNINGS', { x: width - 240, y: y + 15, size: 10, font: boldFont, color: primaryColor });
        page.drawText(safeStr(`INR ${salary.totalSalary.toLocaleString()}`), { x: width - 240, y: y - 2, size: 16, font: boldFont });
        y -= 70;

        // 5. Activity Table
        page.drawText('CLASS ACTIVITY LEDGER', { x: 50, y, size: 11, font: boldFont, color: primaryColor });
        y -= 25; // Increased from 15 to avoid overlap

        // Table Header
        page.drawRectangle({ x: 50, y: y - 5, width: 500, height: 25, color: primaryColor });
        const tableY = y + 10;
        const col1 = 60, col2 = 140, col3 = 330, col4 = width - 110;
        
        page.drawText('DATE', { x: col1, y: tableY, size: 9, font: boldFont, color: rgb(1,1,1) });
        page.drawText('STUDENT', { x: col2, y: tableY, size: 9, font: boldFont, color: rgb(1,1,1) });
        page.drawText('SUBJECT', { x: col3, y: tableY, size: 9, font: boldFont, color: rgb(1,1,1) });
        page.drawText('DURATION', { x: col4, y: tableY, size: 9, font: boldFont, color: rgb(1,1,1) });
        y -= 15;

        const sortedClasses = classes.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        let alternate = false;

        for (const cls of sortedClasses) {
            if (y < 100) {
                page = pdfDoc.addPage([600, 800]);
                y = 750;
            }

            if (alternate) {
                page.drawRectangle({ x: 50, y: y - 12, width: 500, height: 20, color: lightGray });
            }

            page.drawText(safeStr(new Date(cls.date).toLocaleDateString()), { x: col1, y: y - 5, size: 9, font, color: darkGray });
            page.drawText(safeStr((cls.studentId as any)?.fullName || 'N/A'), { x: col2, y: y - 5, size: 9, font });
            page.drawText(safeStr((cls.subjectId as any)?.subjectName || 'N/A'), { x: col3, y: y - 5, size: 9, font });
            
            const hours = (cls.durationMinutes / 60).toFixed(2);
            page.drawText(safeStr(`${hours} hrs`), { x: col4, y: y - 5, size: 9, font });

            y -= 20;
            alternate = !alternate;
        }

        // 6. Footer
        const footerY = 50;
        page.drawText('This is a formal confirmation of monthly faculty remuneration.', { 
            x: width / 2 - 140, 
            y: footerY + 15, 
            size: 8, 
            font, 
            color: darkGray 
        });
        page.drawText('BrightPath Learning | Transparency in Education', { 
            x: width / 2 - 100, 
            y: footerY, 
            size: 8, 
            font: boldFont, 
            color: primaryColor 
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
