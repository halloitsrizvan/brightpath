import { NextRequest } from 'next/server';
import { checkAuth } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';
import '@/models/Subject';
import Attendance from '@/models/Attendance';
import Exam from '@/models/Exam';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Expense from '@/models/Expense';
import FounderSalary from '@/models/FounderSalary';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import PDFDocument from 'pdfkit';

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

        // Parse month string (e.g., "September 2026")
        const [monthName, yearStr] = monthStr.trim().split(/\s+/);
        const year = parseInt(yearStr);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthIndex = monthNames.indexOf(monthName);

        if (monthIndex === -1 || isNaN(year)) {
            return new Response(JSON.stringify({ message: "Invalid month format" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

        // 1. Financial Data
        const fees = await Fee.find({ month: monthStr }).populate('studentId', 'fullName class');
        const salaries = await Salary.find({ month: monthStr }).populate('teacherId', 'name salaryPerHour');
        const expenses = await Expense.find({ month: monthStr }).sort({ date: -1 });
        const founderSalaries = await FounderSalary.find({ month: monthStr });

        // Financial Summary Calculations
        const totalReceived = fees.filter(f => f.paymentStatus === 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const totalReceivable = fees.filter(f => f.paymentStatus !== 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const totalDisbursed = salaries.filter(s => s.paidStatus === 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
        const totalPayable = salaries.filter(s => s.paidStatus !== 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
        const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
        const totalFounderSalaries = founderSalaries.filter(s => s.status === 'paid').reduce((acc, s) => acc + (s.amount || 0), 0);
        const netProfit = totalReceived - (totalDisbursed + totalExpenses + totalFounderSalaries);
        const grossBilled = totalReceived + totalReceivable;
        const collectionVelocity = grossBilled > 0 ? ((totalReceived / grossBilled) * 100).toFixed(0) : '0';
        const profitMargin = totalReceived > 0 ? ((netProfit / totalReceived) * 100).toFixed(0) : '0';

        // 2. Attendance Data
        const attendanceLogs = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
            status: 'Present'
        }).populate('studentId', 'fullName class').populate('teacherId', 'name').populate('subjectId', 'name subjectName').sort({ date: -1 });

        const totalTeachingMinutes = attendanceLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0);
        const totalSessions = attendanceLogs.length;

        // Group attendance by teacher
        const teacherStats: any = {};
        const activeStudentIdSet = new Set<string>();
        const activeTeacherIdSet = new Set<string>();
        const studentAttendanceStats: { [id: string]: { sessions: number; minutes: number; hours: number } } = {};

        attendanceLogs.forEach(log => {
            const tName = log.teacherId?.name || 'Unknown';
            const sName = log.studentId?.fullName;
            const sId = log.studentId?._id?.toString() || log.studentId?.toString();
            const tId = log.teacherId?._id?.toString() || log.teacherId?.toString();

            if (sId) {
                activeStudentIdSet.add(sId);
                if (!studentAttendanceStats[sId]) {
                    studentAttendanceStats[sId] = { sessions: 0, minutes: 0, hours: 0 };
                }
                studentAttendanceStats[sId].sessions += 1;
                studentAttendanceStats[sId].minutes += log.durationMinutes || 0;
            }
            if (tId) activeTeacherIdSet.add(tId);

            if (!teacherStats[tName]) teacherStats[tName] = { minutes: 0, sessions: 0 };
            teacherStats[tName].minutes += log.durationMinutes || 0;
            teacherStats[tName].sessions += 1;
        });

        Object.values(studentAttendanceStats).forEach(st => {
            st.hours = parseFloat((st.minutes / 60).toFixed(1));
        });

        const teacherStatsArray = Object.entries(teacherStats).map(([name, stats]: any) => ({
            name,
            hours: (stats.minutes / 60).toFixed(1),
            sessions: stats.sessions
        })).sort((a: any, b: any) => parseFloat(b.hours) - parseFloat(a.hours));

        // 3. Exam Data
        const exams = await Exam.find({
            $or: [
                { examMonth: monthStr },
                { examDate: { $gte: startDate, $lte: endDate } }
            ]
        }).populate('studentId', 'fullName class').sort({ examDate: -1 });

        const avgMarksPercent = exams.length > 0 
            ? (exams.reduce((acc, e) => acc + (e.marks / e.maxMarks), 0) / exams.length) * 100 
            : 0;

        const studentExamScores: { [sId: string]: { totalMarks: number; maxMarks: number; count: number } } = {};
        exams.forEach((ex: any) => {
            const sId = ex.studentId?._id?.toString() || ex.studentId?.toString() || 'unknown';
            if (!studentExamScores[sId]) {
                studentExamScores[sId] = { totalMarks: 0, maxMarks: 0, count: 0 };
            }
            studentExamScores[sId].totalMarks += ex.marks || 0;
            studentExamScores[sId].maxMarks += ex.maxMarks || 100;
            studentExamScores[sId].count += 1;
        });

        // 4. Student Cohort Intelligence
        const allStudents = await Student.find({}).lean();
        const totalEnrolled = allStudents.length;
        const totalActive = allStudents.filter(s => s.status === 'active').length;
        const totalInactive = allStudents.filter(s => s.status === 'inactive').length;

        const newStudentsThisMonth = allStudents.filter(s => {
            const d = s.joinedAt ? new Date(s.joinedAt) : (s.createdAt ? new Date(s.createdAt) : null);
            return d && d >= startDate && d <= endDate;
        });

        const dormantStudents = allStudents.filter(s => s.status === 'active' && !activeStudentIdSet.has(s._id.toString()));
        const dormantCount = dormantStudents.length;
        const activeEngagementRate = totalActive > 0 ? Math.round((activeStudentIdSet.size / totalActive) * 100) : 0;

        // Student Profiles for Ledgers & Honors
        const studentProfiles = allStudents.map(s => {
            const sId = s._id.toString();
            const att = studentAttendanceStats[sId] || { sessions: 0, minutes: 0, hours: 0 };
            const examInfo = studentExamScores[sId] || null;
            const joinedD = s.joinedAt ? new Date(s.joinedAt) : (s.createdAt ? new Date(s.createdAt) : null);
            const isNewThisMonth = Boolean(joinedD && joinedD >= startDate && joinedD <= endDate);
            const isDormant = s.status === 'active' && att.sessions === 0;
            const examAvg = examInfo && examInfo.maxMarks > 0 ? Math.round((examInfo.totalMarks / examInfo.maxMarks) * 100) : null;

            return {
                id: sId,
                name: s.fullName,
                class: s.class || 'N/A',
                syllabus: s.syllabus || 'N/A',
                location: s.residentialLocation || 'India',
                status: s.status || 'active',
                isNewThisMonth,
                isDormant,
                sessions: att.sessions,
                hours: att.hours,
                examAvg,
                examsCount: examInfo ? examInfo.count : 0
            };
        });

        const topAcademicStudents = studentProfiles
            .filter(s => s.examAvg !== null && s.examsCount > 0)
            .sort((a, b) => (b.examAvg! - a.examAvg!) || (b.examsCount - a.examsCount))
            .slice(0, 5);

        const topDedicatedStudents = studentProfiles
            .filter(s => s.hours > 0)
            .sort((a, b) => (b.hours - a.hours) || (b.sessions - a.sessions))
            .slice(0, 5);

        // 5. Initialize PDF Document
        const doc = new PDFDocument({ margin: 50, bufferPages: true, autoFirstPage: true });
        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));

        // Color System Setup
        const primaryColor = '#45308D';
        const darkTextColor = '#1F2937';
        const lightTextColor = '#4B5563';
        const gridColor = '#E5E7EB';

        // Helper: Section Heading
        const drawSectionHeading = (title: string, yPos: number) => {
            doc.fontSize(11).fillColor(primaryColor).font('Helvetica-Bold').text(title.toUpperCase(), 50, yPos);
            doc.strokeColor(primaryColor).lineWidth(1).moveTo(50, yPos + 15).lineTo(545, yPos + 15).stroke();
            return yPos + 22;
        };

        // =========================================================================
        // --- PAGE 1: EXECUTIVE BRIEF & SUMMARY DOSSIER ---
        // =========================================================================
        
        // Header Title Block
        doc.fontSize(22).fillColor(primaryColor).font('Helvetica-Bold').text('BRIGHTPATH TUITION CENTER', 50, 40);
        doc.fontSize(9).fillColor(lightTextColor).font('Helvetica-Bold').text('EXECUTIVE OPERATIONAL AUDIT & SUMMARY DOSSIER', 50, 64);

        // Audit Period Badge (Top-Right)
        doc.rect(380, 36, 165, 38).fillAndStroke('#F3F4F6', '#E5E7EB');
        doc.fontSize(8).fillColor(lightTextColor).font('Helvetica').text('AUDIT PERIOD', 390, 42);
        doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text(monthStr.toUpperCase(), 390, 53);

        // Divider
        doc.strokeColor(gridColor).lineWidth(1).moveTo(50, 84).lineTo(545, 84).stroke();

        let yVal = 94;

        // --- I. Financial Audit Summary ---
        yVal = drawSectionHeading('I. Financial Audit Summary', yVal);

        doc.rect(50, yVal, 495, 126).fillAndStroke('#F9FAFB', '#E5E7EB');

        doc.fontSize(8.5).fillColor(lightTextColor).font('Helvetica');
        doc.text('Total Revenue Collected (Student Fees Settled):', 70, yVal + 12);
        doc.text('Uncollected Pipeline Receivables (Pending AR):', 70, yVal + 28);
        doc.text('Total Tutor Remuneration Disbursed:', 70, yVal + 44);
        doc.text('General Operating & Maintenance Expenses:', 70, yVal + 60);
        doc.text('Founder Salaries Paid:', 70, yVal + 76);

        doc.fontSize(8.5).fillColor(darkTextColor).font('Helvetica-Bold').text(`Rs. ${totalReceived.toLocaleString()}`, 400, yVal + 12, { align: 'right', width: 120 });
        doc.fontSize(8.5).fillColor('#F59E0B').font('Helvetica-Bold').text(`Rs. ${totalReceivable.toLocaleString()}`, 400, yVal + 28, { align: 'right', width: 120 });
        doc.fontSize(8.5).fillColor('#EF4444').font('Helvetica-Bold').text(`- Rs. ${totalDisbursed.toLocaleString()}`, 400, yVal + 44, { align: 'right', width: 120 });
        doc.fontSize(8.5).fillColor('#EF4444').font('Helvetica-Bold').text(`- Rs. ${totalExpenses.toLocaleString()}`, 400, yVal + 60, { align: 'right', width: 120 });
        doc.fontSize(8.5).fillColor('#EF4444').font('Helvetica-Bold').text(`- Rs. ${totalFounderSalaries.toLocaleString()}`, 400, yVal + 76, { align: 'right', width: 120 });

        doc.strokeColor('#E5E7EB').lineWidth(0.5).moveTo(70, yVal + 94).lineTo(525, yVal + 94).stroke();

        // Net Operating Margin Row
        doc.fontSize(9.5).fillColor(darkTextColor).font('Helvetica-Bold').text('Net Operating Profit / Free Margin:', 70, yVal + 104);
        const profitColor = netProfit >= 0 ? '#10B981' : '#EF4444';
        const profitSign = netProfit >= 0 ? 'Rs. ' : '- Rs. ';
        doc.fontSize(10.5).fillColor(profitColor).font('Helvetica-Bold').text(`${profitSign}${Math.abs(netProfit).toLocaleString()} (${profitMargin}% Margin)`, 350, yVal + 103, { align: 'right', width: 170 });

        yVal += 138;

        // --- II. Operational, Academic & Student Population Health Pulse ---
        yVal = drawSectionHeading('II. Operational, Academic & Student Cohort Health Pulse', yVal);

        // Row 1: 3 Stat Cards
        // Card 1: Teaching Volume
        doc.rect(50, yVal, 158, 56).fillAndStroke('#F9FAFB', '#E5E7EB');
        doc.fontSize(7.5).fillColor(lightTextColor).font('Helvetica-Bold').text('TEACHING VOLUME', 60, yVal + 8);
        doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text(`${(totalTeachingMinutes / 60).toFixed(1)} Hours`, 60, yVal + 20);
        doc.fontSize(7).fillColor(lightTextColor).font('Helvetica').text(`${totalSessions} learning sessions`, 60, yVal + 38);

        // Card 2: Exam Benchmark
        doc.rect(218, yVal, 158, 56).fillAndStroke('#F9FAFB', '#E5E7EB');
        doc.fontSize(7.5).fillColor(lightTextColor).font('Helvetica-Bold').text('EXAM BENCHMARK', 228, yVal + 8);
        doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text(`${avgMarksPercent.toFixed(1)}%`, 228, yVal + 20);
        doc.fontSize(7).fillColor(lightTextColor).font('Helvetica').text(`${exams.length} assessments evaluated`, 228, yVal + 38);

        // Card 3: Collection Velocity
        doc.rect(386, yVal, 158, 56).fillAndStroke('#F9FAFB', '#E5E7EB');
        doc.fontSize(7.5).fillColor(lightTextColor).font('Helvetica-Bold').text('COLLECTION VELOCITY', 396, yVal + 8);
        doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text(`${collectionVelocity}% Settled`, 396, yVal + 20);
        doc.fontSize(7).fillColor(lightTextColor).font('Helvetica').text(`Rs. ${totalReceived.toLocaleString()} received`, 396, yVal + 38);

        yVal += 64;

        // Row 2: 3 Stat Cards for Student Population Dynamics
        // Card 4: Total Enrollment
        doc.rect(50, yVal, 158, 56).fillAndStroke('#F9FAFB', '#E5E7EB');
        doc.fontSize(7.5).fillColor(lightTextColor).font('Helvetica-Bold').text('TOTAL ENROLLMENT', 60, yVal + 8);
        doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text(`${totalEnrolled} Students`, 60, yVal + 20);
        doc.fontSize(7).fillColor(lightTextColor).font('Helvetica').text(`${totalActive} Active  |  ${totalInactive} Inactive`, 60, yVal + 38);

        // Card 5: New Admissions
        doc.rect(218, yVal, 158, 56).fillAndStroke('#F9FAFB', '#E5E7EB');
        doc.fontSize(7.5).fillColor(lightTextColor).font('Helvetica-Bold').text('NEW ADMISSIONS', 228, yVal + 8);
        doc.fontSize(12).fillColor('#10B981').font('Helvetica-Bold').text(`+${newStudentsThisMonth.length} Enrolled`, 228, yVal + 20);
        doc.fontSize(7).fillColor(lightTextColor).font('Helvetica').text(`Joined during ${monthName}`, 228, yVal + 38);

        // Card 6: Engagement Rate & Dormant Risk
        doc.rect(386, yVal, 158, 56).fillAndStroke('#F9FAFB', '#E5E7EB');
        doc.fontSize(7.5).fillColor(lightTextColor).font('Helvetica-Bold').text('ENGAGEMENT & RETENTION', 396, yVal + 8);
        doc.fontSize(12).fillColor(primaryColor).font('Helvetica-Bold').text(`${activeEngagementRate}% Active`, 396, yVal + 20);
        const dormantColor = dormantCount > 0 ? '#EF4444' : lightTextColor;
        doc.fontSize(7).fillColor(dormantColor).font('Helvetica').text(`${dormantCount} Dormant / Retention Risk`, 396, yVal + 38);

        yVal += 72;

        // --- III. Executive Highlights & Institutional Governance ---
        yVal = drawSectionHeading('III. Institutional Governance & Audit Scope', yVal);

        doc.rect(50, yVal, 495, 84).fillAndStroke('#F9FAFB', '#E5E7EB');
        doc.fontSize(8).fillColor(darkTextColor).font('Helvetica');
        
        doc.text(`* Institutional audit compiled for ${monthStr} encompassing ${fees.length} fee ledgers, ${salaries.length} faculty payroll lines, ${allStudents.length} enrolled students (${totalActive} active), and ${attendanceLogs.length} verified learning sessions.`, 65, yVal + 10, { width: 465, lineGap: 2 });
        
        doc.text(`* Student Cohort Health: ${activeStudentIdSet.size} active learners participated in classes this month (${activeEngagementRate}% engagement rate). ${newStudentsThisMonth.length} new student admissions joined in this cycle, while ${dormantCount} registered students were identified with zero attendance requiring counselor outreach.`, 65, yVal + 32, { width: 465, lineGap: 2 });

        doc.text(`* Tutor Payroll Governance: Instructor disbursements are strictly gated by student billing settlement rules. Only sessions backed by verified student fee payments qualify for immediate payout.`, 65, yVal + 56, { width: 465, lineGap: 2 });

        // =========================================================================
        // --- PAGE 2+ : ITEMIZED AUDIT LEDGERS & CONTROLLERSHIP ---
        // =========================================================================
        doc.addPage();
        let currentY = 50;

        // Generic table renderer with automatic page breaks and continuation headers
        const drawTable = (
            title: string, 
            headers: { label: string; width: number; align?: 'left' | 'right' | 'center' }[], 
            rows: any[][]
        ) => {
            // Check if title + header + 1 row fits
            if (currentY + 60 > 690) {
                doc.addPage();
                currentY = 50;
            }

            // Section Header
            doc.fontSize(10).fillColor(primaryColor).font('Helvetica-Bold').text(title.toUpperCase(), 50, currentY);
            currentY += 15;

            // Header Row
            doc.rect(50, currentY, 495, 18).fill(primaryColor);
            let xOffset = 50;
            headers.forEach(h => {
                const align = h.align || 'left';
                doc.fontSize(7.5).fillColor('#FFFFFF').font('Helvetica-Bold')
                    .text(h.label, xOffset + 8, currentY + 5, { width: h.width - 16, align: align });
                xOffset += h.width;
            });
            currentY += 18;

            if (rows.length === 0) {
                doc.rect(50, currentY, 495, 20).fillAndStroke('#FFFFFF', '#E5E7EB');
                doc.fontSize(8).fillColor(lightTextColor).font('Helvetica-Oblique')
                    .text('No ledger logs recorded for this category.', 60, currentY + 6);
                currentY += 20;
            } else {
                rows.forEach((row, rIdx) => {
                    // Check if current row fits
                    if (currentY + 20 > 690) {
                        doc.addPage();
                        currentY = 50;

                        // Redraw header for continuation
                        doc.rect(50, currentY, 495, 18).fill(primaryColor);
                        let xOff = 50;
                        headers.forEach(h => {
                            const align = h.align || 'left';
                            doc.fontSize(7.5).fillColor('#FFFFFF').font('Helvetica-Bold')
                                .text(`${h.label} (Cont.)`, xOff + 8, currentY + 5, { width: h.width - 16, align: align });
                            xOff += h.width;
                        });
                        currentY += 18;
                    }

                    const bg = rIdx % 2 === 0 ? '#FFFFFF' : '#F9FAFB';
                    doc.rect(50, currentY, 495, 18).fillAndStroke(bg, '#E5E7EB');

                    let xOff = 50;
                    row.forEach((cellVal, cIdx) => {
                        const h = headers[cIdx];
                        const align = h.align || 'left';
                        
                        let cellColor = darkTextColor;
                        let cellFont = 'Helvetica';

                        const valStr = String(cellVal);
                        if (valStr === 'PAID' || valStr === 'ACTIVE' || valStr === 'HONOR ROLL') {
                            cellColor = '#10B981';
                            cellFont = 'Helvetica-Bold';
                        } else if (valStr === 'PENDING' || valStr === 'UNPAID' || valStr === 'DORMANT') {
                            cellColor = '#F59E0B';
                            cellFont = 'Helvetica-Bold';
                        } else if (valStr === 'INACTIVE' || valStr === 'UNBILLED') {
                            cellColor = '#6B7280';
                        } else if (valStr === 'NEW ADMISSION') {
                            cellColor = '#3B82F6';
                            cellFont = 'Helvetica-Bold';
                        }

                        if (String(cellVal).startsWith('-Rs. ')) {
                            cellColor = '#EF4444';
                        }

                        doc.fontSize(7.5).fillColor(cellColor).font(cellFont)
                            .text(valStr, xOff + 8, currentY + 5, { width: h.width - 16, align: align, ellipsis: true });
                        xOff += h.width;
                    });
                    currentY += 18;
                });
            }

            currentY += 14; // padding below table
        };

        // Table 1: Student Population, Lifecycle & Activity Audit
        const studentHeaders = [
            { label: 'Student Name / Class', width: 155 },
            { label: 'Region & Syllabus', width: 95 },
            { label: 'Lifecycle Status', width: 90, align: 'center' as const },
            { label: 'Month Classes', width: 85, align: 'right' as const },
            { label: 'Exam Avg', width: 70, align: 'center' as const }
        ];
        const studentRows = studentProfiles.map(s => {
            const statusBadge = s.status === 'inactive' ? 'INACTIVE' : s.isNewThisMonth ? 'NEW ADMISSION' : s.isDormant ? 'DORMANT' : 'ACTIVE';
            return [
                `${s.name} (${s.class === 'N/A' ? 'Unassigned' : 'Class ' + s.class})`,
                `${s.location} • ${s.syllabus}`,
                statusBadge,
                `${s.hours}h (${s.sessions}s)`,
                s.examAvg !== null ? `${s.examAvg}%` : '—'
            ];
        });
        drawTable('1. Student Population, Lifecycle & Learning Activity Audit', studentHeaders, studentRows);

        // Table 2: Student Academic Mastery & Dedication Honors
        if (topAcademicStudents.length > 0 || topDedicatedStudents.length > 0) {
            const honorHeaders = [
                { label: 'Honor Recognition', width: 135 },
                { label: 'Student Name & Class', width: 160 },
                { label: 'Performance Metric', width: 100, align: 'right' as const },
                { label: 'Assessments / Sessions', width: 100, align: 'center' as const }
            ];
            const honorRows = [
                ...topAcademicStudents.map(s => [
                    'HONOR ROLL',
                    `${s.name} (${s.class === 'N/A' ? 'Unassigned' : 'Class ' + s.class})`,
                    `${s.examAvg}% Avg Score`,
                    `${s.examsCount} Exams`
                ]),
                ...topDedicatedStudents.map(s => [
                    'DEDICATED SCHOLAR',
                    `${s.name} (${s.class === 'N/A' ? 'Unassigned' : 'Class ' + s.class})`,
                    `${s.hours} Total Hours`,
                    `${s.sessions} Sessions`
                ])
            ];
            drawTable('2. Student Academic Mastery & Dedication Honors', honorHeaders, honorRows);
        }

        // Table 3: Faculty Contribution & Remuneration Audit
        const facultyHeaders = [
            { label: 'Faculty Member', width: 215 },
            { label: 'Sessions Conducted', width: 140, align: 'right' as const },
            { label: 'Hours Contributed', width: 140, align: 'right' as const }
        ];
        const facultyRows = teacherStatsArray.map(t => [
            t.name,
            `${t.sessions} Sessions`,
            `${t.hours} hrs`
        ]);
        drawTable('3. Faculty Contribution & Teaching Delivery Audit', facultyHeaders, facultyRows);

        // Table 4: Student Fees Ledger
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
        drawTable('4. Student Fee Income Ledger', feeHeaders, feeRows);

        // Table 5: Tutor Payroll Ledger
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
        drawTable('5. Faculty Payroll Ledger', salaryHeaders, salaryRows);

        // Table 6: General Operating Expenses Ledger
        const expenseHeaders = [
            { label: 'Expense Name', width: 175 },
            { label: 'Category', width: 125 },
            { label: 'Amount', width: 100, align: 'right' as const },
            { label: 'Date Filed', width: 95, align: 'center' as const }
        ];
        const expenseRows = expenses.map(e => [
            e.description || e.title || 'General Expense',
            e.category || 'Operations',
            `-Rs. ${e.amount?.toLocaleString() || '0'}`,
            e.date ? new Date(e.date).toLocaleDateString('en-GB') : 'N/A'
        ]);
        drawTable('6. General Operations Expense Ledger', expenseHeaders, expenseRows);

        // Table 7: Student Attendance Audits
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
            log.subjectId?.subjectName || log.subjectId?.name || 'General'
        ]);
        drawTable('7. Monthly Learning Session Audit Trail', attendanceHeaders, attendanceRows);

        // Table 8: Student Exam Records
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
        drawTable('8. Academic Assessment Audit Ledger', examHeaders, examRows);

        // =========================================================================
        // --- TWO-PASS: APPLY BORDERS AND ACCURATE PAGE NUMBERS ---
        // =========================================================================
        const range = doc.bufferedPageRange();
        for (let i = 0; i < range.count; i++) {
            doc.switchToPage(i);
            
            // Top colored accent bar
            doc.rect(0, 0, 595, 12).fill(primaryColor);

            // Subheader banner (pages 2+)
            if (i > 0) {
                doc.fontSize(7.5).fillColor(lightTextColor).font('Helvetica-Oblique')
                    .text(`BrightPath Tuition Center - Monthly Audit Executive Dossier (${monthStr})`, 50, 26, { align: 'right' });
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
