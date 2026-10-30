import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import StaffSalary from '@/models/StaffSalary';
import StaffSalaryAdjustment from '@/models/StaffSalaryAdjustment';
import Admin from '@/models/Admin';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);
        const { id } = await params;

        const salary = await StaffSalary.findById(id).populate({
            path: 'staffId',
            model: 'Admin',
            select: 'name email adminRole role baseSalary'
        });

        if (!salary) {
            return NextResponse.json({ message: 'Salary record not found' }, { status: 404 });
        }

        const staff = salary.staffId || { name: 'Staff Member', email: 'staff@brightpath.com', adminRole: 'Staff' };

        // Fetch any salary adjustments for this staff member in this payroll month
        const monthAdjustments = await StaffSalaryAdjustment.find({
            staffId: staff._id,
            effectiveMonth: salary.month
        }).sort({ createdAt: 1 });

        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Brand colors
        const primaryColor = rgb(0.27, 0.188, 0.553); // #45308D
        const secondaryColor = rgb(0.992, 0.78, 0.043); // #FDC70B
        const textColor = rgb(0.12, 0.12, 0.14);
        const lightGray = rgb(0.96, 0.96, 0.97);
        const rowBg1 = rgb(0.965, 0.965, 0.975);
        const rowBg2 = rgb(0.985, 0.985, 0.995);
        const darkGray = rgb(0.45, 0.45, 0.48);
        const greenColor = rgb(0.08, 0.58, 0.28);
        const roseColor = rgb(0.85, 0.15, 0.25);

        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();

        // Helper for text safety
        const safeStr = (str: any) => {
            if (str === null || str === undefined) return '';
            let s = String(str);
            s = s.replace(/₹/g, 'INR ');
            s = s.replace(/[\u2018\u2019]/g, "'")
                 .replace(/[\u201C\u201D]/g, '"')
                 .replace(/[\u2013\u2014]/g, '-')
                 .replace(/\u2026/g, '...')
                 .replace(/\u00A0/g, ' ');
            return s.replace(/[^\x00-\xFF]/g, '');
        };

        // 1. Logo & Brand Title
        let logoDrawn = false;
        try {
            const logoPath = path.join(process.cwd(), 'public', 'logo.png');
            if (fs.existsSync(logoPath)) {
                const logoBytes = fs.readFileSync(logoPath);
                const logoImage = await pdfDoc.embedPng(logoBytes);
                const logoDims = logoImage.scale(0.20);
                page.drawImage(logoImage, {
                    x: 50,
                    y: height - 120,
                    width: logoDims.width,
                    height: logoDims.height
                });
                page.drawText('BrightPath', {
                    x: 50 + logoDims.width + 12,
                    y: height - 85,
                    size: 24,
                    font: boldFont,
                    color: primaryColor
                });
                page.drawText('Learning & Operations Management', {
                    x: 50 + logoDims.width + 12,
                    y: height - 102,
                    size: 9,
                    font: font,
                    color: darkGray
                });
                logoDrawn = true;
            }
        } catch (e) {
            console.warn("Logo overlay skipped:", e);
        }

        if (!logoDrawn) {
            page.drawText('BrightPath', {
                x: 50,
                y: height - 85,
                size: 26,
                font: boldFont,
                color: primaryColor
            });
            page.drawText('Learning & Operations Management', {
                x: 50,
                y: height - 102,
                size: 9,
                font: font,
                color: darkGray
            });
        }

        // Header Title
        page.drawText('SALARY INVOICE', {
            x: width - 230,
            y: height - 85,
            size: 20,
            font: boldFont,
            color: primaryColor
        });
        page.drawText('Payment Voucher & Receipt', {
            x: width - 230,
            y: height - 100,
            size: 9,
            font: font,
            color: darkGray
        });

        // Golden Accent Divider
        let y = height - 130;
        page.drawLine({
            start: { x: 50, y },
            end: { x: 550, y },
            thickness: 2.5,
            color: secondaryColor
        });
        y -= 25;

        // 2. Employee Info & Invoice Meta
        const leftColX = 50;
        const rightColX = 350;

        // Left Column: Employee Info
        page.drawText('EMPLOYEE / BENEFICIARY', {
            x: leftColX,
            y: y,
            size: 9,
            font: boldFont,
            color: primaryColor
        });
        
        page.drawText(safeStr(staff.name || 'Staff Member'), {
            x: leftColX,
            y: y - 16,
            size: 13,
            font: boldFont,
            color: textColor
        });
        
        page.drawText(safeStr(`Email: ${staff.email || 'N/A'}`), {
            x: leftColX,
            y: y - 31,
            size: 9,
            font: font,
            color: darkGray
        });
        
        page.drawText(safeStr(`Designation: ${staff.adminRole || staff.role || 'Staff'}`), {
            x: leftColX,
            y: y - 45,
            size: 9,
            font: boldFont,
            color: textColor
        });

        // Right Column: Invoice Meta
        let metaY = y;
        const voucherNo = `STF-INV-${salary._id.toString().slice(-6).toUpperCase()}`;
        page.drawText(`Voucher No:`, { x: rightColX, y: metaY, size: 9, font: boldFont, color: darkGray });
        page.drawText(voucherNo, { x: rightColX + 85, y: metaY, size: 9, font: boldFont, color: textColor });
        metaY -= 15;

        const paymentDateStr = new Date(salary.paymentDate || salary.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        page.drawText(`Payment Date:`, { x: rightColX, y: metaY, size: 9, font: boldFont, color: darkGray });
        page.drawText(paymentDateStr, { x: rightColX + 85, y: metaY, size: 9, font: font, color: textColor });
        metaY -= 15;

        page.drawText(`Payroll Month:`, { x: rightColX, y: metaY, size: 9, font: boldFont, color: darkGray });
        page.drawText(safeStr(salary.month), { x: rightColX + 85, y: metaY, size: 9, font: boldFont, color: primaryColor });
        metaY -= 15;

        page.drawText(`Payment Mode:`, { x: rightColX, y: metaY, size: 9, font: boldFont, color: darkGray });
        page.drawText(safeStr(salary.paymentMethod || 'Bank Transfer'), { x: rightColX + 85, y: metaY, size: 9, font: font, color: textColor });
        metaY -= 15;

        page.drawText(`Status:`, { x: rightColX, y: metaY, size: 9, font: boldFont, color: darkGray });
        page.drawText(`PAID / DISBURSED`, { x: rightColX + 85, y: metaY, size: 10, font: boldFont, color: greenColor });

        // Position y below both left and right info blocks with ample spacing
        y = Math.min(y - 55, metaY - 15) - 25;

        // 3. Compensation Breakdown Section
        page.drawText('COMPENSATION & DISBURSEMENT BREAKDOWN', {
            x: leftColX,
            y: y,
            size: 9.5,
            font: boldFont,
            color: primaryColor
        });
        y -= 18;

        // Table Header Bar
        page.drawRectangle({
            x: 50,
            y: y - 7,
            width: 500,
            height: 24,
            color: primaryColor
        });
        page.drawText('ITEM DESCRIPTION', { x: 65, y: y, size: 8.5, font: boldFont, color: rgb(1, 1, 1) });
        page.drawText('PERIOD', { x: 300, y: y, size: 8.5, font: boldFont, color: rgb(1, 1, 1) });
        page.drawText('AMOUNT (INR)', { x: 445, y: y, size: 8.5, font: boldFont, color: rgb(1, 1, 1) });
        y -= 26;

        // Table Rows
        if (monthAdjustments && monthAdjustments.length > 0) {
            const firstAdj = monthAdjustments[0];

            // Row 1: Base Salary Prior to Adjustment
            page.drawRectangle({
                x: 50,
                y: y - 5,
                width: 500,
                height: 22,
                color: rowBg1
            });
            page.drawText('Base Salary (Prior to Adjustment)', { x: 65, y: y, size: 8.5, font: font, color: textColor });
            page.drawText(safeStr(salary.month), { x: 300, y: y, size: 8.5, font: font, color: darkGray });
            page.drawText(`INR ${firstAdj.previousSalary.toLocaleString()}`, { x: 445, y: y, size: 8.5, font: boldFont, color: textColor });
            y -= 24;

            // Adjustment rows (Increment or Cut)
            for (const adj of monthAdjustments) {
                const isInc = adj.type === 'increment';
                page.drawRectangle({
                    x: 50,
                    y: y - 5,
                    width: 500,
                    height: 22,
                    color: rowBg2
                });
                const label = isInc 
                    ? `Salary Increment (+): ${safeStr(adj.reason || 'Appraisal')}` 
                    : `Salary Deduction / Cut (-): ${safeStr(adj.reason || 'Deduction')}`;
                
                page.drawText(label, { 
                    x: 65, 
                    y: y, 
                    size: 8.5, 
                    font: boldFont, 
                    color: isInc ? greenColor : roseColor 
                });
                page.drawText(safeStr(adj.effectiveMonth || salary.month), { x: 300, y: y, size: 8.5, font: font, color: darkGray });
                page.drawText(`${isInc ? '+' : '-'} INR ${adj.changeAmount.toLocaleString()}`, { 
                    x: 445, 
                    y: y, 
                    size: 8.5, 
                    font: boldFont, 
                    color: isInc ? greenColor : roseColor 
                });
                y -= 24;
            }

            // Net Effective Monthly Salary Row
            page.drawRectangle({
                x: 50,
                y: y - 5,
                width: 500,
                height: 24,
                color: rowBg1
            });
            page.drawText('Net Effective Monthly Base Remuneration', { x: 65, y: y, size: 8.5, font: boldFont, color: textColor });
            page.drawText(safeStr(salary.month), { x: 300, y: y, size: 8.5, font: font, color: darkGray });
            page.drawText(`INR ${salary.amount.toLocaleString()}`, { x: 445, y: y, size: 9, font: boldFont, color: primaryColor });
            y -= 26;

        } else {
            // Standard Single Row: Monthly Base Salary
            page.drawRectangle({
                x: 50,
                y: y - 5,
                width: 500,
                height: 24,
                color: rowBg1
            });
            page.drawText('Monthly Staff Base Remuneration', { x: 65, y: y, size: 8.5, font: boldFont, color: textColor });
            page.drawText(safeStr(salary.month), { x: 300, y: y, size: 8.5, font: font, color: darkGray });
            page.drawText(`INR ${salary.amount.toLocaleString()}`, { x: 445, y: y, size: 9, font: boldFont, color: textColor });
            y -= 26;
        }

        // Remarks / Notes Row if present
        if (salary.notes) {
            page.drawRectangle({
                x: 50,
                y: y - 4,
                width: 500,
                height: 20,
                color: rgb(0.985, 0.985, 0.995)
            });
            page.drawText(safeStr(`Note: ${salary.notes}`), { x: 65, y: y, size: 8, font: font, color: darkGray });
            page.drawText('-', { x: 300, y: y, size: 8, font: font, color: darkGray });
            page.drawText('-', { x: 465, y: y, size: 8, font: font, color: darkGray });
            y -= 22;
        }

        y -= 15;

        // 4. Net Paid Total Card
        page.drawRectangle({
            x: 320,
            y: y - 42,
            width: 230,
            height: 48,
            color: lightGray,
            borderColor: primaryColor,
            borderWidth: 1.5
        });
        page.drawText('NET AMOUNT PAID', { x: 335, y: y - 10, size: 9, font: boldFont, color: primaryColor });
        page.drawText(safeStr(`Transferred via ${salary.paymentMethod || 'Bank Transfer'}`), {
            x: 335,
            y: y - 24,
            size: 7.5,
            font: font,
            color: darkGray
        });

        const grandTotalStr = `INR ${salary.amount.toLocaleString()}`;
        const totalWidth = boldFont.widthOfTextAtSize(grandTotalStr, 14);
        page.drawText(grandTotalStr, {
            x: 535 - totalWidth,
            y: y - 30,
            size: 14,
            font: boldFont,
            color: textColor
        });

        y -= 75;

        // 5. Verification & Authorization Block
        page.drawText('DISBURSEMENT DECLARATION & AUTHORIZATION', {
            x: 50,
            y: y,
            size: 9,
            font: boldFont,
            color: primaryColor
        });
        y -= 15;

        page.drawText(
            'This document certifies that the aforementioned compensation has been officially processed and disbursed',
            { x: 50, y: y, size: 8, font: font, color: darkGray }
        );
        y -= 12;
        page.drawText(
            'by BrightPath Management in accordance with the established institutional employment agreement.',
            { x: 50, y: y, size: 8, font: font, color: darkGray }
        );
        y -= 45;

        // Signatory box
        page.drawLine({ start: { x: 50, y }, end: { x: 200, y }, thickness: 1, color: darkGray });
        page.drawLine({ start: { x: 350, y }, end: { x: 500, y }, thickness: 1, color: darkGray });
        y -= 14;

        page.drawText('Authorized Signatory', { x: 50, y: y, size: 8, font: boldFont, color: textColor });
        page.drawText('BrightPath Administration', { x: 50, y: y - 10, size: 7.5, font: font, color: darkGray });

        page.drawText('Employee Signature / Acknowledgement', { x: 350, y: y, size: 8, font: boldFont, color: textColor });
        page.drawText(safeStr(staff.name), { x: 350, y: y - 10, size: 7.5, font: font, color: darkGray });

        // 6. Footer
        const footerY = 45;
        page.drawLine({ start: { x: 50, y: footerY + 15 }, end: { x: 550, y: footerY + 15 }, thickness: 1, color: lightGray });
        page.drawText('BrightPath Learning Management System • Official Payroll Voucher', {
            x: width / 2 - 135,
            y: footerY + 2,
            size: 8,
            font: boldFont,
            color: primaryColor
        });
        page.drawText('For payroll inquiries or tax documentation, please contact payroll@brightpath.com', {
            x: width / 2 - 150,
            y: footerY - 10,
            size: 7.5,
            font: font,
            color: darkGray
        });

        const pdfBytes = await pdfDoc.save();
        const safeStaffName = safeStr(staff.name || 'Staff').replace(/[^a-zA-Z0-9]/g, '_');
        const safeMonth = safeStr(salary.month).replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `Salary_Invoice_${safeStaffName}_${safeMonth}.pdf`;

        return new NextResponse(pdfBytes as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Access-Control-Expose-Headers': 'Content-Disposition'
            }
        });
    } catch (err: any) {
        console.error("Staff Salary Invoice PDF Error:", err);
        return errorResponse(err);
    }
}
