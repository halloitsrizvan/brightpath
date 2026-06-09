import { NextRequest } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import Attendance from '@/models/Attendance';
import Exam from '@/models/Exam';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Expense from '@/models/Expense';
import FounderSalary from '@/models/FounderSalary';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const { searchParams } = new URL(req.url);
        const monthStr = searchParams.get('month');

        if (!monthStr) {
            return new Response(JSON.stringify({ message: "Month selection is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Parse month string (e.g., "April 2026")
        const [monthName, yearStr] = monthStr.split(' ');
        const year = parseInt(yearStr);
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

        // 1. Financial Data
        const fees = await Fee.find({ month: monthStr }).populate('studentId', 'fullName class');
        const salaries = await Salary.find({ month: monthStr }).populate('teacherId', 'name salaryPerHour');
        const expenses = await Expense.find({ month: monthStr });
        const founderSalaries = await FounderSalary.find({ month: monthStr });

        // Financial Summary Calculations
        const totalReceived = fees.filter(f => f.paymentStatus === 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const totalReceivable = fees.filter(f => f.paymentStatus !== 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const totalDisbursed = salaries.filter(s => s.paidStatus === 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
        const totalPayable = salaries.filter(s => s.paidStatus !== 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
        const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
        const totalFounderSalaries = founderSalaries.filter(s => s.status === 'paid').reduce((acc, s) => acc + (s.amount || 0), 0);
        const netProfit = totalReceived - (totalDisbursed + totalExpenses + totalFounderSalaries);

        // 2. Attendance Data
        const attendanceLogs = await Attendance.find({
            date: { $gte: startDate, $lte: endDate }
        }).populate('studentId', 'fullName').populate('teacherId', 'name').populate('subjectId', 'name').sort({ date: -1 });

        const totalTeachingMinutes = attendanceLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0);
        const totalSessions = attendanceLogs.length;

        // Group attendance by teacher
        const teacherStats: any = {};
        attendanceLogs.forEach(log => {
            const tName = log.teacherId?.name || 'Unknown';
            if (!teacherStats[tName]) teacherStats[tName] = { minutes: 0, sessions: 0 };
            teacherStats[tName].minutes += log.durationMinutes || 0;
            teacherStats[tName].sessions += 1;
        });

        const teacherStatsArray = Object.entries(teacherStats).map(([name, stats]: any) => ({
            name,
            hours: (stats.minutes / 60).toFixed(1),
            sessions: stats.sessions
        }));

        // 3. Exam Data
        const exams = await Exam.find({
            $or: [
                { examMonth: monthStr },
                { examDate: { $gte: startDate, $lte: endDate } }
            ]
        }).populate('studentId', 'fullName').sort({ examDate: -1 });

        const avgMarksPercent = exams.length > 0 
            ? (exams.reduce((acc, e) => acc + (e.marks / e.maxMarks), 0) / exams.length) * 100 
            : 0;

        // 4. Initialize PDF Document (buffered for two-pass page numbering)
        const doc = new PDFDocument({ margin: 50, bufferPages: true });
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));

        // Default fonts are working now thanks to serverExternalPackages: ['pdfkit']

        // Color System Setup
        const primaryColor = '#45308D';
        const secondaryColor = '#FDC70B';
        const darkTextColor = '#1F2937';
        const lightTextColor = '#4B5563';
        const gridColor = '#E5E7EB';

        // Helper: Section Heading
        const drawSectionHeading = (title: string, yPos: number) => {
            doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text(title.toUpperCase(), 50, yPos);
            doc.strokeColor(primaryColor).lineWidth(1).moveTo(50, yPos + 16).lineTo(545, yPos + 16).stroke();
            return yPos + 25;
        };

        // --- PAGE 1: EXECUTIVE BRIEF & SUMMARY CARDS ---
        
        // Title block
        doc.fontSize(22).fillColor(primaryColor).font('Helvetica-Bold').text('BRIGHTPATH TUITION CENTER', 50, 45);
        doc.fontSize(10).fillColor(lightTextColor).font('Helvetica-Bold').text('EXECUTIVE OPERATIONAL AUDIT & SUMMARY', 50, 70);

        // Audit Period Badge
        doc.rect(380, 42, 165, 36).fill('#F3F4F6');
        doc.fontSize(9).fillColor(lightTextColor).font('Helvetica').text('AUDIT PERIOD', 390, 48);
        doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text(monthStr.toUpperCase(), 390, 58);

        // Divider
        doc.strokeColor(gridColor).lineWidth(1).moveTo(50, 95).lineTo(545, 95).stroke();

        let yVal = 110;
        yVal = drawSectionHeading('I. Financial Audit Summary', yVal);

        // Outer Financial Box
        doc.rect(50, yVal, 495, 135).fillAndStroke('#F9FAFB', '#E5E7EB');

        // Financial metrics details
        doc.fontSize(10).fillColor(lightTextColor).font('Helvetica');
        doc.text('Total Revenue Collected (Student Fees):', 70, yVal + 15);
        doc.text('Total Payroll Disbursed (Tutor Salaries):', 70, yVal + 35);
        doc.text('Operating & Maintenance Expenses:', 70, yVal + 55);
        doc.text('Founder Salaries Paid:', 70, yVal + 75);

        doc.fontSize(10).fillColor(darkTextColor).font('Helvetica-Bold').text(`Rs. ${totalReceived.toLocaleString()}`, 400, yVal + 15, { align: 'right', width: 120 });
        doc.fontSize(10).fillColor('#EF4444').font('Helvetica-Bold').text(`- Rs. ${totalDisbursed.toLocaleString()}`, 400, yVal + 35, { align: 'right', width: 120 });
        doc.fontSize(10).fillColor('#EF4444').font('Helvetica-Bold').text(`- Rs. ${totalExpenses.toLocaleString()}`, 400, yVal + 55, { align: 'right', width: 120 });
        doc.fontSize(10).fillColor('#EF4444').font('Helvetica-Bold').text(`- Rs. ${totalFounderSalaries.toLocaleString()}`, 400, yVal + 75, { align: 'right', width: 120 });

        doc.strokeColor('#E5E7EB').lineWidth(0.5).moveTo(70, yVal + 98).lineTo(525, yVal + 98).stroke();

        // Net Operating Margin Row
        doc.fontSize(11).fillColor(darkTextColor).font('Helvetica-Bold').text('Net Operating Margin / Net Profit:', 70, yVal + 109);
        const profitColor = netProfit >= 0 ? '#10B981' : '#EF4444';
        const profitSign = netProfit >= 0 ? 'Rs. ' : '- Rs. ';
        doc.fontSize(12).fillColor(profitColor).font('Helvetica-Bold').text(`${profitSign}${Math.abs(netProfit).toLocaleString()}`, 400, yVal + 108, { align: 'right', width: 120 });

        yVal += 155;

        // II. Key Academic Indicators
        yVal = drawSectionHeading('II. Key Academic Indicators', yVal);

        // Card 1: Academic Intensity
        doc.rect(50, yVal, 235, 75).fillAndStroke('#F9FAFB', '#E5E7EB');
        doc.fontSize(9).fillColor(lightTextColor).font('Helvetica-Bold').text('ACADEMIC INTENSITY', 65, yVal + 12);
        doc.fontSize(16).fillColor(primaryColor).font('Helvetica-Bold').text(`${(totalTeachingMinutes / 60).toFixed(1)} Hours`, 65, yVal + 26);
        doc.fontSize(9).fillColor(lightTextColor).font('Helvetica').text(`${totalSessions} learning sessions recorded`, 65, yVal + 48);

        // Card 2: Student Performance
        doc.rect(310, yVal, 235, 75).fillAndStroke('#F9FAFB', '#E5E7EB');
        doc.fontSize(9).fillColor(lightTextColor).font('Helvetica-Bold').text('STUDENT PERFORMANCE', 325, yVal + 12);
        doc.fontSize(16).fillColor(primaryColor).font('Helvetica-Bold').text(`${avgMarksPercent.toFixed(1)}%`, 325, yVal + 26);
        doc.fontSize(9).fillColor(lightTextColor).font('Helvetica').text(`${exams.length} standard assessments held`, 325, yVal + 48);

        yVal += 95;

        // III. Faculty Contribution Audit
        yVal = drawSectionHeading('III. Faculty Contribution Audit', yVal);

        // Table Header
        doc.rect(50, yVal, 495, 20).fill(primaryColor);
        doc.fontSize(9).fillColor('#FFFFFF').font('Helvetica-Bold').text('Faculty Member', 65, yVal + 6);
        doc.fontSize(9).fillColor('#FFFFFF').font('Helvetica-Bold').text('Sessions Conducted', 280, yVal + 6, { align: 'right', width: 110 });
        doc.fontSize(9).fillColor('#FFFFFF').font('Helvetica-Bold').text('Hours Contributed', 410, yVal + 6, { align: 'right', width: 110 });
        yVal += 20;

        // Table Rows
        if (teacherStatsArray.length === 0) {
            doc.rect(50, yVal, 495, 25).stroke('#E5E7EB');
            doc.fontSize(9).fillColor(lightTextColor).font('Helvetica-Oblique').text('No teaching logs recorded for this period.', 65, yVal + 8);
            yVal += 25;
        } else {
            teacherStatsArray.forEach((t: any, idx: number) => {
                const bg = idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                doc.rect(50, yVal, 495, 22).fillAndStroke(bg, '#E5E7EB');
                doc.fontSize(9).fillColor(darkTextColor).font('Helvetica-Bold').text(t.name, 65, yVal + 7);
                doc.fontSize(9).fillColor(darkTextColor).font('Helvetica').text(t.sessions.toString(), 280, yVal + 7, { align: 'right', width: 110 });
                doc.fontSize(9).fillColor(darkTextColor).font('Helvetica').text(`${t.hours} hrs`, 410, yVal + 7, { align: 'right', width: 110 });
                yVal += 22;
            });
        }

        // --- PAGE 2+ : DETAILED AUDIT TRANSACTION LEDGERS ---
        doc.addPage();
        let currentY = 50;

        // Helper: Generic table renderer with automatic page breaks and continuation headers
        const drawTable = (
            title: string, 
            headers: { label: string; width: number; align?: 'left' | 'right' | 'center' }[], 
            rows: any[][]
        ) => {
            // Check if title + header + 1 row fits
            if (currentY + 65 > 720) {
                doc.addPage();
                currentY = 50;
            }

            // Section Header
            doc.fontSize(11).fillColor(primaryColor).font('Helvetica-Bold').text(title.toUpperCase(), 50, currentY);
            currentY += 16;

            // Header Row
            doc.rect(50, currentY, 495, 20).fill(primaryColor);
            let xOffset = 50;
            headers.forEach(h => {
                const align = h.align || 'left';
                doc.fontSize(8).fillColor('#FFFFFF').font('Helvetica-Bold')
                    .text(h.label, xOffset + 10, currentY + 6, { width: h.width - 20, align: align });
                xOffset += h.width;
            });
            currentY += 20;

            if (rows.length === 0) {
                doc.rect(50, currentY, 495, 22).fillAndStroke('#FFFFFF', '#E5E7EB');
                doc.fontSize(8).fillColor(lightTextColor).font('Helvetica-Oblique')
                    .text('No ledger logs recorded for this category.', 60, currentY + 7);
                currentY += 22;
            } else {
                rows.forEach((row, rIdx) => {
                    // Check if current row fits
                    if (currentY + 22 > 720) {
                        doc.addPage();
                        currentY = 50;

                        // Redraw header for continuation
                        doc.rect(50, currentY, 495, 20).fill(primaryColor);
                        let xOff = 50;
                        headers.forEach(h => {
                            const align = h.align || 'left';
                            doc.fontSize(8).fillColor('#FFFFFF').font('Helvetica-Bold')
                                .text(`${h.label} (Cont.)`, xOff + 10, currentY + 6, { width: h.width - 20, align: align });
                            xOff += h.width;
                        });
                        currentY += 20;
                    }

                    const bg = rIdx % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                    doc.rect(50, currentY, 495, 22).fillAndStroke(bg, '#E5E7EB');

                    let xOff = 50;
                    row.forEach((cellVal, cIdx) => {
                        const h = headers[cIdx];
                        const align = h.align || 'left';
                        
                        let cellColor = darkTextColor;
                        let cellFont = 'Helvetica';

                        if (typeof cellVal === 'string') {
                            if (cellVal === 'PAID') {
                                cellColor = '#10B981';
                                cellFont = 'Helvetica-Bold';
                            } else if (cellVal === 'PENDING' || cellVal === 'UNPAID') {
                                cellColor = '#F59E0B';
                                cellFont = 'Helvetica-Bold';
                            }
                        }

                        if (cIdx === row.length - 2 && String(cellVal).startsWith('-Rs. ')) {
                            cellColor = '#EF4444';
                        }

                        doc.fontSize(8).fillColor(cellColor).font(cellFont)
                            .text(String(cellVal), xOff + 10, currentY + 7, { width: h.width - 20, align: align, ellipsis: true });
                        xOff += h.width;
                    });
                    currentY += 22;
                });
            }

            currentY += 15; // padding below table
        };

        // Table 1: Student Fees Ledger
        const feeHeaders = [
            { label: 'Category', width: 95 },
            { label: 'Student Name / Details', width: 190 },
            { label: 'Amount', width: 110, align: 'right' as const },
            { label: 'Payment Status', width: 100, align: 'center' as const }
        ];
        const feeRows = fees.map(f => [
            'Student Fee',
            `${f.studentId?.fullName || 'Unknown'} (Class ${f.studentId?.class || 'N/A'})`,
            `Rs. ${f.amount?.toLocaleString() || '0'}`,
            f.paymentStatus?.toUpperCase() || 'N/A'
        ]);
        drawTable('1. Student Fee Income Ledger', feeHeaders, feeRows);

        // Table 2: Tutor Payroll Ledger
        const salaryHeaders = [
            { label: 'Category', width: 95 },
            { label: 'Tutor / Faculty Member', width: 190 },
            { label: 'Amount', width: 110, align: 'right' as const },
            { label: 'Payroll Status', width: 100, align: 'center' as const }
        ];
        const salaryRows = salaries.map(s => [
            'Tutor Payroll',
            s.teacherId?.name || 'Unknown',
            `-Rs. ${s.totalSalary?.toLocaleString() || '0'}`,
            s.paidStatus?.toUpperCase() || 'N/A'
        ]);
        drawTable('2. Faculty Payroll Ledger', salaryHeaders, salaryRows);

        // Table 3: General Operating Expenses Ledger
        const expenseHeaders = [
            { label: 'Expense Name', width: 175 },
            { label: 'Category', width: 125 },
            { label: 'Amount', width: 100, align: 'right' as const },
            { label: 'Date Filed', width: 95, align: 'center' as const }
        ];
        const expenseRows = expenses.map(e => [
            e.description || 'General Expense',
            e.category || 'Operations',
            `-Rs. ${e.amount?.toLocaleString() || '0'}`,
            e.date ? new Date(e.date).toLocaleDateString('en-GB') : 'N/A'
        ]);
        drawTable('3. General Operations Expense Ledger', expenseHeaders, expenseRows);

        // Table 4: Student Attendance Audits
        const attendanceHeaders = [
            { label: 'Date', width: 75, align: 'center' as const },
            { label: 'Student', width: 140 },
            { label: 'Tutor', width: 120 },
            { label: 'Duration', width: 70, align: 'right' as const },
            { label: 'Subject', width: 90, align: 'right' as const }
        ];
        const attendanceRows = attendanceLogs.map(log => [
            new Date(log.date).toLocaleDateString('en-GB'),
            log.studentId?.fullName || 'N/A',
            log.teacherId?.name || 'N/A',
            `${log.durationMinutes || 0} mins`,
            log.subjectId?.name || 'General'
        ]);
        drawTable('4. Monthly Learning Session Audit Trail', attendanceHeaders, attendanceRows);

        // Table 5: Student Exam Records
        const examHeaders = [
            { label: 'Student', width: 175 },
            { label: 'Subject', width: 125 },
            { label: 'Score Obtained', width: 100, align: 'center' as const },
            { label: 'Percentage', width: 95, align: 'right' as const }
        ];
        const examRows = exams.map(e => [
            e.studentId?.fullName || 'N/A',
            e.subject || 'N/A',
            `${e.marks} / ${e.maxMarks}`,
            `${((e.marks / e.maxMarks) * 100).toFixed(0)}%`
        ]);
        drawTable('5. Academic Assessment Audit Ledger', examHeaders, examRows);

        // --- TWO-PASS: APPLY BORDERS AND PAGE NUMBERS ---
        const range = doc.bufferedPageRange();
        for (let i = 0; i < range.count; i++) {
            doc.switchToPage(i);
            
            // Top colored accent bar
            doc.rect(0, 0, 595, 15).fill(primaryColor);

            // Subheader banner (pages 2+)
            if (i > 0) {
                doc.fontSize(8).fillColor(lightTextColor).font('Helvetica-Oblique')
                    .text(`BrightPath Tuition Center - Monthly Audit Executive Dossier (${monthStr})`, 50, 30, { align: 'right' });
            }

            // Footer
            doc.strokeColor(gridColor).lineWidth(0.5).moveTo(50, 725).lineTo(545, 725).stroke();
            doc.fontSize(7).fillColor(lightTextColor).font('Helvetica')
                .text(`Confidential - For BrightPath Internal Administration Only. Generated on ${new Date().toLocaleDateString()}`, 50, 735, { align: 'left', lineBreak: false });
            doc.fontSize(7).fillColor(lightTextColor).font('Helvetica')
                .text(`Page ${i + 1} of ${range.count}`, 450, 735, { align: 'right', width: 95, lineBreak: false });
        }

        doc.end();

        const pdfBuffer = await new Promise<Buffer>((resolve) => {
            doc.on('end', () => resolve(Buffer.concat(buffers)));
        });

        const safeMonthFilename = monthStr.replace(/\s+/g, '_');
        return new Response(pdfBuffer as any, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=Executive_Summary_${safeMonthFilename}.pdf`
            }
        });

    } catch (err: any) {
        console.error("Monthly Report Export Error:", err);
        return new Response(JSON.stringify({ message: err.message || 'Verification failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
