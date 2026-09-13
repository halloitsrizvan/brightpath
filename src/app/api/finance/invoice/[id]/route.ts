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
    try {
        await dbConnect();
        
        const { id: idParam } = await params;
        if (!idParam) return NextResponse.json({ message: "Invalid ID parameter" }, { status: 400 });

        let decodedUser: any;
        try {
            decodedUser = await checkAuth(req, ['admin', 'student']);
        } catch (authErr: any) {
            return NextResponse.json({ message: authErr.message }, { status: 403 });
        }

        const ids = idParam.split(',').map(s => s.trim()).filter(Boolean);
        if (ids.length === 0) return NextResponse.json({ message: "No valid fee IDs provided" }, { status: 400 });

        const fees = await Fee.find({ _id: { $in: ids } }).populate({
            path: 'studentId',
            model: 'Student'
        });

        if (fees.length === 0) return NextResponse.json({ message: "Fee records not found" }, { status: 404 });
        
        const student = fees[0].studentId as any;
        if (!student) return NextResponse.json({ message: "Student relationship could not be populated" }, { status: 500 });
        
        // If student role, ensure they are requesting their own invoice
        if (decodedUser.role === 'student') {
            const studentIdStr = student._id?.toString() || student.toString();
            if (decodedUser.id !== studentIdStr) {
                return NextResponse.json({ message: "Forbidden: Cannot access other students' invoices" }, { status: 403 });
            }
        }

        const { searchParams } = new URL(req.url);
        const cutoffDateParam = searchParams.get('cutoffDate');
        const cutoffDayParam = searchParams.get('cutoffDay');

        let allActivityRecords: any[] = [];
        let totalAmount = 0;
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const billingMonths: string[] = [];
        let overallCutoffDate: Date | null = null;

        for (const fee of fees) {
            totalAmount += (fee.amount || 0);
            if (fee.month && !billingMonths.includes(fee.month)) {
                billingMonths.push(fee.month);
            }

            const monthParts = (fee.month || '').trim().split(/\s+/);
            if (monthParts.length >= 2) {
                const rawMName = monthParts[0];
                const year = parseInt(monthParts[1]);
                const mName = rawMName.charAt(0).toUpperCase() + rawMName.slice(1).toLowerCase();
                const mIndex = monthNames.indexOf(mName);
                
                if (mIndex !== -1 && !isNaN(year)) {
                    const startDate = new Date(year, mIndex, 1);
                    const totalDaysInMonth = new Date(year, mIndex + 1, 0).getDate();
                    const endDate = new Date(year, mIndex, totalDaysInMonth, 23, 59, 59);

                    // Determine query end date based on cutoff parameters, saved fee.billingCutoffDate, or paymentDate
                    let targetEndDate = endDate;
                    if (cutoffDateParam) {
                        const parsed = new Date(cutoffDateParam);
                        if (!isNaN(parsed.getTime())) {
                            targetEndDate = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 23, 59, 59);
                        }
                    } else if (cutoffDayParam) {
                        const day = parseInt(cutoffDayParam, 10);
                        if (!isNaN(day) && day >= 1 && day <= 31) {
                            const validDay = Math.min(day, totalDaysInMonth);
                            targetEndDate = new Date(year, mIndex, validDay, 23, 59, 59);
                        }
                    } else if (fee.billingCutoffDate) {
                        const feeCutoff = new Date(fee.billingCutoffDate);
                        if (!isNaN(feeCutoff.getTime())) {
                            targetEndDate = new Date(feeCutoff.getFullYear(), feeCutoff.getMonth(), feeCutoff.getDate(), 23, 59, 59);
                        }
                    } else if (fee.paymentDate && new Date(fee.paymentDate) < endDate) {
                        targetEndDate = new Date(fee.paymentDate);
                    }

                    const queryEndDate = targetEndDate < endDate ? targetEndDate : endDate;
                    if (queryEndDate < endDate && !overallCutoffDate) {
                        overallCutoffDate = queryEndDate;
                    }

                    if (startDate <= queryEndDate) {
                        const monthClasses = await Attendance.find({
                            studentId: student._id,
                            date: { $gte: startDate, $lte: queryEndDate },
                            status: 'Present'
                        }).populate({
                            path: 'subjectId',
                            model: 'Subject'
                        }).populate({
                            path: 'teacherId',
                            model: 'Teacher'
                        });
                        allActivityRecords.push(...monthClasses);
                    }
                }
            }
        }

        // Deduplicate records and sort by date
        const activityMap = new Map();
        for (const cls of allActivityRecords) {
            activityMap.set(cls._id.toString(), cls);
        }
        const uniqueActivityRecords = Array.from(activityMap.values());
        uniqueActivityRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

        // Safe string encoder to prevent WinAnsi standard font crashes in pdf-lib
        const safeStr = (str: any) => {
            if (str === null || str === undefined) return '';
            let s = String(str);
            s = s.replace(/₹/g, 'INR ');
            s = s.replace(/[\u2018\u2019]/g, "'")
                 .replace(/[\u201C\u201D]/g, '"')
                 .replace(/[\u2013\u2014]/g, '-')
                 .replace(/\u2026/g, '...')
                 .replace(/\u00A0/g, ' ');
            // Strip any characters outside Latin-1 WinAnsi range to guarantee no runtime throw
            return s.replace(/[^\x00-\xFF]/g, '');
        };

        // 2. Content Header
        page.drawText('INVOICE', { x: width - 200, y: height - 90, size: 28, font: boldFont, color: primaryColor });
        let y = height - 150;
        page.drawLine({ start: { x: 50, y }, end: { x: 550, y }, thickness: 2, color: secondaryColor });
        y -= 30;

        page.drawText('BILL TO:', { x: 50, y, size: 10, font: boldFont, color: primaryColor });
        y -= 15;
        page.drawText(safeStr(student.fullName || 'Student'), { x: 50, y, size: 12, font: boldFont });
        y -= 15;
        page.drawText(safeStr(student.email || ''), { x: 50, y, size: 10, font });
        y -= 15;
        page.drawText(safeStr(`Class: ${student.class || 'N/A'}`), { x: 50, y, size: 10, font });

        let rightY = height - 180;
        const invoiceNum = fees.length > 1 
            ? `BP-MULTI-${fees[0]._id.toString().slice(-4).toUpperCase()}-${fees.length}`
            : `BP-INV-${fees[0]._id.toString().slice(-6).toUpperCase()}`;
        page.drawText(safeStr(`Invoice No: ${invoiceNum}`), { x: 380, y: rightY, size: 10, font });
        rightY -= 15;
        const paymentDateObj = fees[0]?.paymentDate ? new Date(fees[0].paymentDate) : new Date();
        const formattedPaymentDate = paymentDateObj.toLocaleDateString();
        page.drawText(safeStr(`Date: ${formattedPaymentDate}`), { x: 380, y: rightY, size: 10, font });
        rightY -= 15;
        const monthsStr = billingMonths.join(', ');
        const displayMonths = monthsStr.length > 30 ? `${billingMonths.length} Months (${billingMonths[0]} - ${billingMonths[billingMonths.length - 1]})` : monthsStr;
        page.drawText(safeStr(`Billing: ${displayMonths || 'Current Term'}`), { x: 380, y: rightY, size: 10, font });
        rightY -= 15;
        if (overallCutoffDate) {
            page.drawText(safeStr(`Cutoff: ${overallCutoffDate.toLocaleDateString()}`), { x: 380, y: rightY, size: 9, font: boldFont, color: primaryColor });
            rightY -= 15;
        }
        page.drawText('Status: PAID', { x: 380, y: rightY, size: 11, font: boldFont, color: rgb(0.1, 0.5, 0.1) });

        // Enrich activity records with bill rate and calculate true activity total
        let totalActivityAmount = 0;
        let totalActivityHours = 0;
        const enrichedActivityRecords = uniqueActivityRecords.map((cls: any) => {
            const hours = (cls.durationMinutes || 0) / 60;
            let rate = 0;
            if (cls.billRateAtTime !== undefined && cls.billRateAtTime !== null) {
                rate = cls.billRateAtTime;
            } else if (student.subjectAssignments) {
                const tId = (cls.teacherId as any)?._id?.toString() || (cls.teacherId as any)?.toString();
                const sId = (cls.subjectId as any)?._id?.toString() || (cls.subjectId as any)?.toString();
                const assignment = student.subjectAssignments.find((a: any) => 
                    (a.subjectId?.toString() === sId) && 
                    (a.teacherId?.toString() === tId)
                );
                if (assignment && assignment.billPerHour > 0) rate = assignment.billPerHour;
            }
            const lineAmount = Math.round(hours * rate);
            totalActivityAmount += lineAmount;
            totalActivityHours += hours;
            return {
                ...cls,
                hours,
                rate,
                lineAmount
            };
        });

        // Use true activity total if attendance was logged, otherwise fallback to stored fee sum
        const finalInvoiceTotal = (enrichedActivityRecords.length > 0 && totalActivityAmount > 0)
            ? totalActivityAmount
            : totalAmount;

        y -= 40;
        const ledgerTitle = overallCutoffDate
            ? `LEARNING ACTIVITY LEDGER (UP TO ${overallCutoffDate.toLocaleDateString().toUpperCase()})`
            : 'LEARNING ACTIVITY LEDGER';
        page.drawText(ledgerTitle, { x: 50, y, size: 11, font: boldFont, color: primaryColor });
        y -= 25;

        // Function to draw table header
        const drawTableHeader = (targetPage: any, headerY: number) => {
            targetPage.drawRectangle({ x: 48, y: headerY - 5, width: 504, height: 25, color: primaryColor });
            targetPage.drawText('DATE', { x: 56, y: headerY + 5, size: 8, font: boldFont, color: rgb(1, 1, 1) });
            targetPage.drawText('SUBJECT', { x: 130, y: headerY + 5, size: 8, font: boldFont, color: rgb(1, 1, 1) });
            targetPage.drawText('TEACHER', { x: 245, y: headerY + 5, size: 8, font: boldFont, color: rgb(1, 1, 1) });
            targetPage.drawText('HOURS', { x: 360, y: headerY + 5, size: 8, font: boldFont, color: rgb(1, 1, 1) });
            targetPage.drawText('RATE', { x: 425, y: headerY + 5, size: 8, font: boldFont, color: rgb(1, 1, 1) });
            targetPage.drawText('AMOUNT', { x: 490, y: headerY + 5, size: 8, font: boldFont, color: rgb(1, 1, 1) });
        };

        drawTableHeader(page, y);
        y -= 30;

        if (enrichedActivityRecords.length === 0) {
            // Friendly fallback row if no individual class logs exist for this student's billing cycles
            page.drawRectangle({ x: 48, y: y - 5, width: 504, height: 22, color: lightGray });
            page.drawText(safeStr(formattedPaymentDate), { x: 56, y: y, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
            page.drawText('Academic Curriculum Tuition', { x: 130, y: y, size: 9, font });
            page.drawText('Enrolled Faculty Panel', { x: 245, y: y, size: 9, font });
            page.drawText(safeStr(billingMonths.length > 1 ? `${billingMonths.length} Months` : 'Cycle'), { x: 360, y: y, size: 9, font });
            page.drawText('-', { x: 435, y: y, size: 9, font });
            page.drawText(safeStr(`INR ${finalInvoiceTotal.toLocaleString()}`), { x: 490, y: y, size: 9, font: boldFont });
            y -= 25;
        } else {
            enrichedActivityRecords.forEach((cls: any, index: number) => {
                if (y < 80) { 
                    page = pdfDoc.addPage([600, 800]); 
                    y = 750; 
                    drawTableHeader(page, y);
                    y -= 30;
                }
                if (index % 2 === 0) page.drawRectangle({ x: 48, y: y - 5, width: 504, height: 20, color: lightGray });
                page.drawText(safeStr(new Date(cls.date).toLocaleDateString()), { x: 56, y: y, size: 8, font, color: rgb(0.3, 0.3, 0.3) });
                page.drawText(safeStr((cls.subjectId as any)?.subjectName || 'Module'), { x: 130, y: y, size: 8, font });
                page.drawText(safeStr((cls.teacherId as any)?.name || 'N/A'), { x: 245, y: y, size: 8, font });
                page.drawText(safeStr(`${cls.hours.toFixed(2)} hr`), { x: 360, y: y, size: 8, font });
                page.drawText(safeStr(cls.rate > 0 ? `INR ${cls.rate}` : '-'), { x: 425, y: y, size: 8, font });
                page.drawText(safeStr(`INR ${cls.lineAmount.toLocaleString()}`), { x: 490, y: y, size: 8, font: boldFont });
                y -= 20;
            });
        }

        y -= 25;
        if (y < 120) { 
            page = pdfDoc.addPage([600, 800]); 
            y = 750; 
        }
        page.drawRectangle({ x: 340, y: y - 45, width: 212, height: 50, color: lightGray, borderColor: primaryColor, borderWidth: 1 });
        page.drawText('GRAND TOTAL', { x: 350, y: y - 10, size: 10, font: boldFont, color: primaryColor });
        const subNote = totalActivityHours > 0 
            ? `${totalActivityHours.toFixed(1)} hrs logged • ${fees.length} cycle(s)`
            : `${fees.length} billing cycle(s) settled`;
        page.drawText(safeStr(subNote), { x: 350, y: y - 24, size: 8, font, color: rgb(0.4, 0.4, 0.4) });

        const amountText = safeStr(`INR ${finalInvoiceTotal.toLocaleString()}`);
        const amountWidth = boldFont.widthOfTextAtSize(amountText, 15);
        page.drawText(amountText, { x: 540 - amountWidth, y: y - 32, size: 15, font: boldFont, color: textColor });

        // Footer
        const fy = 60;
        page.drawLine({ start: { x: 50, y: fy }, end: { x: 550, y: fy }, thickness: 1, color: lightGray });
        page.drawText('Thank you for your payment. We appreciate your association with BrightPath Learning.', { x: width / 2 - 190, y: fy - 20, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
        page.drawText('Questions? Contact us at billing@brightpath.com', { x: width / 2 - 100, y: fy - 32, size: 8, font, color: primaryColor });

        const pdfBytes = await pdfDoc.save();
        const safeStudentName = safeStr(student.fullName || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Invoice_${safeStudentName}_${fees.length > 1 ? 'Multi_Month' : (billingMonths[0] || 'Receipt').replace(/\s+/g, '_')}.pdf`;

        return new NextResponse(pdfBytes as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${filename}"`
            }
        });
    } catch (err: any) {
        console.error("PDF Generate Error:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
