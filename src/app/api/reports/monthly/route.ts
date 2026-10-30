import { NextRequest, NextResponse } from 'next/server';
import { checkAuth, errorResponse } from '@/lib/api/auth';
import dbConnect from '@/lib/db/mongodb';

// Ensure all models are registered
import '@/models/Student';
import '@/models/Teacher';
import '@/models/Subject';
import '@/models/Fee';
import '@/models/Salary';
import '@/models/Expense';
import '@/models/FounderSalary';
import '@/models/Exam';
import '@/models/Attendance';
import '@/models/Lead';

import Attendance from '@/models/Attendance';
import Exam from '@/models/Exam';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Expense from '@/models/Expense';
import FounderSalary from '@/models/FounderSalary';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import Subject from '@/models/Subject';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        await checkAuth(req, ['admin']);

        const { searchParams } = new URL(req.url);
        const monthStr = searchParams.get('month');

        if (!monthStr) {
            return NextResponse.json({ message: "Month selection is required" }, { status: 400 });
        }

        // Parse month string (e.g., "September 2026")
        const monthParts = monthStr.trim().split(/\s+/);
        if (monthParts.length < 2) {
            return NextResponse.json({ message: "Invalid month format" }, { status: 400 });
        }

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthParts[0];
        const year = parseInt(monthParts[1]);
        const monthIndex = monthNames.indexOf(monthName);

        if (monthIndex === -1 || isNaN(year)) {
            return NextResponse.json({ message: "Invalid month name or year" }, { status: 400 });
        }

        const startDate = new Date(year, monthIndex, 1);
        const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

        // Previous Month for Month-over-Month (MoM) calculation
        const prevMonthDate = new Date(year, monthIndex - 1, 1);
        const prevMonthStr = `${monthNames[prevMonthDate.getMonth()]} ${prevMonthDate.getFullYear()}`;
        const prevStartDate = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), 1);
        const prevEndDate = new Date(prevMonthDate.getFullYear(), prevMonthDate.getMonth() + 1, 0, 23, 59, 59, 999);

        // ----------------------------------------------------
        // 1. Current Month Financial Data
        // ----------------------------------------------------
        const fees = await Fee.find({ month: monthStr }).populate('studentId', 'fullName class contactNumber parentPhone');
        const salaries = await Salary.find({ month: monthStr }).populate('teacherId', 'name salaryPerHour email phone');
        const expenses = await Expense.find({ month: monthStr }).sort({ date: -1 });
        const founderSalaries = await FounderSalary.find({ month: monthStr });

        const totalReceived = fees.filter(f => f.paymentStatus === 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const totalReceivable = fees.filter(f => f.paymentStatus !== 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const totalBilledGross = totalReceived + totalReceivable;
        
        const totalDisbursed = salaries.filter(s => s.paidStatus === 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
        const totalQualifiedPayable = salaries.filter(s => s.paidStatus !== 'paid').reduce((acc, s) => acc + (s.qualifiedSalary !== undefined ? s.qualifiedSalary : s.totalSalary || 0), 0);
        const totalPendingStudentPayable = salaries.reduce((acc, s) => acc + (s.pendingStudentSalary || 0), 0);
        const totalAccruedPayable = salaries.filter(s => s.paidStatus !== 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
        
        const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
        const totalFounderSalaries = founderSalaries.filter(s => s.status === 'paid').reduce((acc, s) => acc + (s.amount || 0), 0);
        const netProfit = totalReceived - (totalDisbursed + totalExpenses + totalFounderSalaries);
        const profitMargin = totalReceived > 0 ? ((netProfit / totalReceived) * 100) : 0;
        const collectionVelocity = totalBilledGross > 0 ? ((totalReceived / totalBilledGross) * 100) : 0;

        // ----------------------------------------------------
        // 2. Previous Month Financial Data (For MoM Delta)
        // ----------------------------------------------------
        const prevFees = await Fee.find({ month: prevMonthStr });
        const prevSalaries = await Salary.find({ month: prevMonthStr });
        const prevExpenses = await Expense.find({ month: prevMonthStr });
        const prevFounderSalaries = await FounderSalary.find({ month: prevMonthStr });

        const prevTotalReceived = prevFees.filter(f => f.paymentStatus === 'paid').reduce((acc, f) => acc + (f.amount || 0), 0);
        const prevTotalDisbursed = prevSalaries.filter(s => s.paidStatus === 'paid').reduce((acc, s) => acc + (s.totalSalary || 0), 0);
        const prevTotalExpenses = prevExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);
        const prevTotalFounderSalaries = prevFounderSalaries.filter(s => s.status === 'paid').reduce((acc, s) => acc + (s.amount || 0), 0);
        const prevNetProfit = prevTotalReceived - (prevTotalDisbursed + prevTotalExpenses + prevTotalFounderSalaries);

        const calcDelta = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? 100 : 0;
            return parseFloat((((curr - prev) / Math.abs(prev)) * 100).toFixed(1));
        };

        const momDeltas: { [key: string]: number } = {
            revenue: calcDelta(totalReceived, prevTotalReceived),
            netProfit: calcDelta(netProfit, prevNetProfit),
            expenses: calcDelta(totalExpenses, prevTotalExpenses),
            receivable: calcDelta(totalReceivable, prevFees.filter(f => f.paymentStatus !== 'paid').reduce((acc, f) => acc + (f.amount || 0), 0))
        };

        // ----------------------------------------------------
        // 3. Attendance & Unit Economics Analysis
        // ----------------------------------------------------
        const attendanceLogs = await Attendance.find({
            date: { $gte: startDate, $lte: endDate },
            status: 'Present'
        })
        .populate('studentId', 'fullName class subjectAssignments')
        .populate('teacherId', 'name salaryPerHour email phone')
        .populate('subjectId', 'name subjectName')
        .sort({ date: -1 });

        const totalTeachingMinutes = attendanceLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0);
        const totalTeachingHours = parseFloat((totalTeachingMinutes / 60).toFixed(1));
        const totalSessions = attendanceLogs.length;
        const avgSessionDuration = totalSessions > 0 ? Math.round(totalTeachingMinutes / totalSessions) : 0;

        // Previous Month Attendance for MoM comparison
        const prevAttendanceLogs = await Attendance.find({
            date: { $gte: prevStartDate, $lte: prevEndDate },
            status: 'Present'
        });
        const prevTotalTeachingMinutes = prevAttendanceLogs.reduce((acc, log) => acc + (log.durationMinutes || 0), 0);
        const prevTotalTeachingHours = parseFloat((prevTotalTeachingMinutes / 60).toFixed(1));
        momDeltas['hours'] = calcDelta(totalTeachingHours, prevTotalTeachingHours);
        momDeltas['sessions'] = calcDelta(totalSessions, prevAttendanceLogs.length);

        // Subject-Wise Unit Economics Breakdown
        const subjectMap: { [key: string]: { name: string; hours: number; sessions: number; revenue: number; tutorCost: number; studentIds: Set<string>; teacherIds: Set<string> } } = {};
        
        // Faculty Distribution & Performance
        const teacherStatsMap: { [key: string]: { id: string; name: string; hours: number; sessions: number; earnings: number; studentIds: Set<string>; subjects: Set<string> } } = {};

        // Track Active Students & Teachers in this month
        const activeStudentIdSet = new Set<string>();
        const activeTeacherIdSet = new Set<string>();

        // Negative Spread / Low Margin Session Warnings
        const anomalySessions: any[] = [];

        attendanceLogs.forEach((log: any) => {
            const student = log.studentId;
            const teacher = log.teacherId;
            const sub = log.subjectId;
            const subName = sub?.subjectName || sub?.name || 'General';
            const tName = teacher?.name || 'Unknown Tutor';
            const tId = teacher?._id?.toString() || 'unknown';
            const sId = student?._id?.toString() || 'unknown';

            if (sId !== 'unknown') activeStudentIdSet.add(sId);
            if (tId !== 'unknown') activeTeacherIdSet.add(tId);

            const hours = (log.durationMinutes || 0) / 60;

            // Determine rates
            let billRate = log.billingRateAtTime || 0;
            let salaryRate = log.salaryRateAtTime || (teacher?.salaryPerHour || 0);

            if (student && student.subjectAssignments && (!billRate || !salaryRate)) {
                const assign = student.subjectAssignments.find((a: any) => 
                    (a.subjectId?.toString() === sub?._id?.toString() || a.subjectId?.toString() === log.subjectId?.toString()) &&
                    (a.teacherId?.toString() === tId)
                );
                if (assign) {
                    if (!billRate && assign.hourlyRate > 0) billRate = assign.hourlyRate;
                    if (!salaryRate && assign.salaryPerHour > 0) salaryRate = assign.salaryPerHour;
                }
            }

            const sessionRevenue = Math.round(hours * billRate);
            const sessionCost = Math.round(hours * salaryRate);

            if (sessionRevenue > 0 && sessionCost > sessionRevenue) {
                anomalySessions.push({
                    id: log._id,
                    date: log.date,
                    studentName: student?.fullName || 'Student',
                    teacherName: tName,
                    subjectName: subName,
                    hours: parseFloat(hours.toFixed(1)),
                    billRate,
                    salaryRate,
                    sessionRevenue,
                    sessionCost,
                    loss: sessionCost - sessionRevenue
                });
            }

            // Group by Subject
            if (!subjectMap[subName]) {
                subjectMap[subName] = {
                    name: subName,
                    hours: 0,
                    sessions: 0,
                    revenue: 0,
                    tutorCost: 0,
                    studentIds: new Set(),
                    teacherIds: new Set()
                };
            }
            subjectMap[subName].hours += hours;
            subjectMap[subName].sessions += 1;
            subjectMap[subName].revenue += sessionRevenue;
            subjectMap[subName].tutorCost += sessionCost;
            if (sId !== 'unknown') subjectMap[subName].studentIds.add(sId);
            if (tId !== 'unknown') subjectMap[subName].teacherIds.add(tId);

            // Group by Teacher
            if (!teacherStatsMap[tId]) {
                teacherStatsMap[tId] = {
                    id: tId,
                    name: tName,
                    hours: 0,
                    sessions: 0,
                    earnings: 0,
                    studentIds: new Set(),
                    subjects: new Set()
                };
            }
            teacherStatsMap[tId].hours += hours;
            teacherStatsMap[tId].sessions += 1;
            teacherStatsMap[tId].earnings += sessionCost;
            if (sId !== 'unknown') teacherStatsMap[tId].studentIds.add(sId);
            teacherStatsMap[tId].subjects.add(subName);
        });

        const subjectEconomics = Object.values(subjectMap).map(s => {
            const grossProfit = s.revenue - s.tutorCost;
            const margin = s.revenue > 0 ? parseFloat(((grossProfit / s.revenue) * 100).toFixed(1)) : 0;
            return {
                name: s.name,
                hours: parseFloat(s.hours.toFixed(1)),
                sessions: s.sessions,
                revenue: s.revenue,
                tutorCost: s.tutorCost,
                grossProfit,
                marginPercent: margin,
                studentsCount: s.studentIds.size,
                teachersCount: s.teacherIds.size
            };
        }).sort((a, b) => b.revenue - a.revenue);

        // ----------------------------------------------------
        // 4. Exam Data & Academic Health Distribution
        // ----------------------------------------------------
        const exams = await Exam.find({
            $or: [
                { examMonth: monthStr },
                { examDate: { $gte: startDate, $lte: endDate } }
            ]
        }).populate('studentId', 'fullName class').sort({ examDate: -1 });

        const prevExams = await Exam.find({
            $or: [
                { examMonth: prevMonthStr },
                { examDate: { $gte: prevStartDate, $lte: prevEndDate } }
            ]
        });

        const avgMarksPercent = exams.length > 0 
            ? (exams.reduce((acc, e) => acc + (e.marks / e.maxMarks), 0) / exams.length) * 100 
            : 0;

        const prevAvgMarksPercent = prevExams.length > 0
            ? (prevExams.reduce((acc, e) => acc + (e.marks / e.maxMarks), 0) / prevExams.length) * 100
            : 0;

        momDeltas['examAverage'] = parseFloat((avgMarksPercent - prevAvgMarksPercent).toFixed(1));

        // Group exams by student to identify student mastery tiers
        const studentExamScores: { [sId: string]: { name: string; totalMarks: number; maxMarks: number; count: number; scores: number[] } } = {};
        exams.forEach(ex => {
            const sId = ex.studentId?._id?.toString() || ex.studentId?.toString() || 'unknown';
            const sName = ex.studentId?.fullName || 'Student';
            if (!studentExamScores[sId]) {
                studentExamScores[sId] = { name: sName, totalMarks: 0, maxMarks: 0, count: 0, scores: [] };
            }
            studentExamScores[sId].totalMarks += ex.marks || 0;
            studentExamScores[sId].maxMarks += ex.maxMarks || 100;
            studentExamScores[sId].count += 1;
            studentExamScores[sId].scores.push(Math.round(((ex.marks || 0) / (ex.maxMarks || 100)) * 100));
        });

        const academicTiers = {
            mastery: [] as any[],     // >= 80%
            proficient: [] as any[],  // 60% - 79%
            developing: [] as any[],  // 45% - 59%
            atRisk: [] as any[]       // < 45%
        };

        Object.entries(studentExamScores).forEach(([sId, data]) => {
            const avg = data.maxMarks > 0 ? (data.totalMarks / data.maxMarks) * 100 : 0;
            const item = {
                studentId: sId,
                name: data.name,
                avgScore: Math.round(avg),
                assessmentsCount: data.count,
                scores: data.scores
            };
            if (avg >= 80) academicTiers.mastery.push(item);
            else if (avg >= 60) academicTiers.proficient.push(item);
            else if (avg >= 45) academicTiers.developing.push(item);
            else academicTiers.atRisk.push(item);
        });

        // Faculty Stats formatted with student counts
        const teacherStats = Object.values(teacherStatsMap).map(t => ({
            id: t.id,
            name: t.name,
            hours: parseFloat(t.hours.toFixed(1)),
            sessions: t.sessions,
            earnings: t.earnings,
            studentsCount: t.studentIds.size,
            subjects: Array.from(t.subjects)
        })).sort((a, b) => b.hours - a.hours);

        // ----------------------------------------------------
        // 5. Comprehensive Student Cohort & Performance Intelligence
        // ----------------------------------------------------
        const allStudents = await Student.find({}).lean();
        const totalEnrolled = allStudents.length;
        const totalActive = allStudents.filter(s => s.status === 'active').length;
        const totalInactive = allStudents.filter(s => s.status === 'inactive').length;

        // Joined this month
        const newStudentsThisMonth = allStudents.filter(s => {
            const d = s.joinedAt ? new Date(s.joinedAt) : (s.createdAt ? new Date(s.createdAt) : null);
            return d && d >= startDate && d <= endDate;
        });

        // Joined previous month (for MoM delta)
        const newStudentsPrevMonth = allStudents.filter(s => {
            const d = s.joinedAt ? new Date(s.joinedAt) : (s.createdAt ? new Date(s.createdAt) : null);
            return d && d >= prevStartDate && d <= prevEndDate;
        });

        const newAdmissionsCount = newStudentsThisMonth.length;
        const prevAdmissionsCount = newStudentsPrevMonth.length;
        momDeltas['newStudents'] = calcDelta(newAdmissionsCount, prevAdmissionsCount);

        // Student Attendance Aggregation for this month
        const studentAttendanceStats: { [id: string]: { sessions: number; minutes: number; hours: number; subjects: Set<string>; teachers: Set<string>; lastDate: Date | null } } = {};
        attendanceLogs.forEach(log => {
            const sId = log.studentId?._id?.toString() || log.studentId?.toString();
            if (!sId) return;
            if (!studentAttendanceStats[sId]) {
                studentAttendanceStats[sId] = { sessions: 0, minutes: 0, hours: 0, subjects: new Set(), teachers: new Set(), lastDate: null };
            }
            studentAttendanceStats[sId].sessions += 1;
            studentAttendanceStats[sId].minutes += log.durationMinutes || 0;
            const sub = log.subjectId?.subjectName || log.subjectId?.name;
            if (sub) studentAttendanceStats[sId].subjects.add(sub);
            const tName = log.teacherId?.name;
            if (tName) studentAttendanceStats[sId].teachers.add(tName);
            if (!studentAttendanceStats[sId].lastDate || new Date(log.date) > new Date(studentAttendanceStats[sId].lastDate!)) {
                studentAttendanceStats[sId].lastDate = log.date;
            }
        });

        Object.values(studentAttendanceStats).forEach(st => {
            st.hours = parseFloat((st.minutes / 60).toFixed(1));
        });

        // Student Financial / Fee Map for this month
        const studentFeeMap: { [id: string]: { paid: number; receivable: number; status: string } } = {};
        fees.forEach(f => {
            const sId = f.studentId?._id?.toString() || f.studentId?.toString();
            if (!sId) return;
            if (!studentFeeMap[sId]) studentFeeMap[sId] = { paid: 0, receivable: 0, status: 'unpaid' };
            if (f.paymentStatus === 'paid') {
                studentFeeMap[sId].paid += (f.amount || 0);
            } else {
                studentFeeMap[sId].receivable += (f.amount || 0);
            }
            studentFeeMap[sId].status = f.paymentStatus || 'pending';
        });

        // Demographics Breakdowns
        const locationCounts: { [key: string]: number } = { GCC: 0, India: 0, Other: 0 };
        const classCounts: { [key: string]: number } = {};
        const syllabusCounts: { [key: string]: number } = {};

        allStudents.forEach(s => {
            const loc = s.residentialLocation === 'GCC' ? 'GCC' : s.residentialLocation === 'India' ? 'India' : 'Other';
            locationCounts[loc] = (locationCounts[loc] || 0) + 1;

            const cls = s.class ? `Class ${s.class}` : 'Unassigned';
            classCounts[cls] = (classCounts[cls] || 0) + 1;

            const syl = s.syllabus || 'Standard';
            syllabusCounts[syl] = (syllabusCounts[syl] || 0) + 1;
        });

        // Combined Student Profiles with Activity Indicators
        const studentProfiles = allStudents.map(s => {
            const sId = s._id.toString();
            const att = studentAttendanceStats[sId] || { sessions: 0, minutes: 0, hours: 0, subjects: new Set(), teachers: new Set(), lastDate: null };
            const examInfo = studentExamScores[sId] || null;
            const feeInfo = studentFeeMap[sId] || { paid: 0, receivable: 0, status: 'unbilled' };

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
                joinedAt: s.joinedAt || s.createdAt,
                isNewThisMonth,
                isDormant,
                sessions: att.sessions,
                hours: att.hours,
                subjects: Array.from(att.subjects),
                teachers: Array.from(att.teachers),
                lastActiveDate: att.lastDate,
                examAvg,
                examsCount: examInfo ? examInfo.count : 0,
                feePaid: feeInfo.paid,
                feeDue: feeInfo.receivable,
                feeStatus: feeInfo.status
            };
        });

        // Leaderboards / Best Students:
        // 1. Top Academic Achievers (Best in Exams)
        const topAcademicStudents = studentProfiles
            .filter(s => s.examAvg !== null && s.examsCount > 0)
            .sort((a, b) => (b.examAvg! - a.examAvg!) || (b.examsCount - a.examsCount))
            .slice(0, 6);

        // 2. Top Dedicated Learners (Highest attendance hours)
        const topDedicatedStudents = studentProfiles
            .filter(s => s.hours > 0)
            .sort((a, b) => (b.hours - a.hours) || (b.sessions - a.sessions))
            .slice(0, 6);

        // 3. Top Value Contributors (Highest fee paid/billed)
        const topValueStudents = studentProfiles
            .filter(s => (s.feePaid + s.feeDue) > 0)
            .sort((a, b) => (b.feePaid + b.feeDue) - (a.feePaid + a.feeDue))
            .slice(0, 6);

        const dormantStudents = studentProfiles.filter(s => s.isDormant);
        const activeLearningCount = activeStudentIdSet.size;
        const activeEngagementRate = totalActive > 0 ? Math.round((activeLearningCount / totalActive) * 100) : 0;

        // ----------------------------------------------------
        // 6. Prescriptive Intelligence: "What To Do Next" Engine
        // ----------------------------------------------------
        const actionItems: any[] = [];

        // Action Item 1: High AR Overdue / Unpaid Fees Blocking Tutor Payroll
        const pendingSalariesWithUnpaid = salaries.filter(s => s.paidStatus !== 'paid' && (s.pendingStudentSalary || 0) > 0);
        if (pendingSalariesWithUnpaid.length > 0) {
            const totalBlockedPayroll = pendingSalariesWithUnpaid.reduce((acc, s) => acc + (s.pendingStudentSalary || 0), 0);
            actionItems.push({
                id: 'action_tutor_payroll_blocked',
                priority: 'urgent',
                category: 'finance',
                title: 'Student Fees Blocking Tutor Disbursements',
                description: `₹${totalBlockedPayroll.toLocaleString()} in tutor remuneration is currently awaiting settlement of student fee bills across ${pendingSalariesWithUnpaid.length} tutors.`,
                metric: `₹${totalBlockedPayroll.toLocaleString()}`,
                badge: 'Cashflow Bottleneck',
                actionLabel: 'Settle AR in Finance',
                actionUrl: '/admin-dashboard/finance'
            });
        }

        // Action Item 2: Outstanding Receivables High Threshold
        if (totalReceivable > 0) {
            const unpaidStudentsCount = fees.filter(f => f.paymentStatus !== 'paid').length;
            actionItems.push({
                id: 'action_ar_collection',
                priority: totalReceivable > 15000 ? 'urgent' : 'medium',
                category: 'finance',
                title: 'Fee Collection Follow-ups Required',
                description: `₹${totalReceivable.toLocaleString()} across ${unpaidStudentsCount} student accounts remains uncollected for ${monthStr}.`,
                metric: `${unpaidStudentsCount} Pending`,
                badge: 'Receivables Follow-up',
                actionLabel: 'Review Pending Fees',
                actionUrl: '/admin-dashboard/finance'
            });
        }

        // Action Item 3: Dormant Active Students Alert
        if (dormantStudents.length > 0) {
            actionItems.push({
                id: 'action_dormant_students',
                priority: dormantStudents.length > 5 ? 'high' : 'medium',
                category: 'students',
                title: 'Dormant Student Retention Risk',
                description: `${dormantStudents.length} active student(s) had 0 attended learning sessions in ${monthStr} (${dormantStudents.slice(0, 3).map(s => s.name).join(', ')}${dormantStudents.length > 3 ? '...' : ''}). Re-engage to prevent dropouts.`,
                metric: `${dormantStudents.length} Dormant`,
                badge: 'Churn Prevention',
                actionLabel: 'View Active Students',
                actionUrl: '/admin-dashboard/students'
            });
        }

        // Action Item 4: Academic Vulnerability / At-Risk Students
        if (academicTiers.atRisk.length > 0) {
            actionItems.push({
                id: 'action_academic_at_risk',
                priority: 'high',
                category: 'academic',
                title: 'Academic Performance Triage Needed',
                description: `${academicTiers.atRisk.length} student(s) scored below 45% on recent assessments (${academicTiers.atRisk.slice(0, 3).map(s => s.name).join(', ')}${academicTiers.atRisk.length > 3 ? '...' : ''}).`,
                metric: `${academicTiers.atRisk.length} At-Risk`,
                badge: 'Academic Alert',
                actionLabel: 'Inspect Students',
                actionUrl: '/admin-dashboard/students'
            });
        }

        // Action Item 5: Negative Spread / Anomaly Margin Sessions
        if (anomalySessions.length > 0) {
            const totalLoss = anomalySessions.reduce((acc, a) => acc + a.loss, 0);
            actionItems.push({
                id: 'action_margin_anomaly',
                priority: 'high',
                category: 'operations',
                title: 'Negative Profit Spread on Classes',
                description: `${anomalySessions.length} session(s) have tutor salary rate higher than student billing rate, generating a net loss of ₹${totalLoss.toLocaleString()}.`,
                metric: `-₹${totalLoss.toLocaleString()}`,
                badge: 'Rate Audit',
                actionLabel: 'Adjust Rates in Students',
                actionUrl: '/admin-dashboard/students'
            });
        }

        // Action Item 6: Faculty Load Imbalances
        const overloadedTeachers = teacherStats.filter(t => t.hours >= 35);
        const underutilizedTeachers = teacherStats.filter(t => t.hours <= 3 && t.hours > 0);
        if (overloadedTeachers.length > 0 || underutilizedTeachers.length > 0) {
            actionItems.push({
                id: 'action_faculty_utilization',
                priority: 'medium',
                category: 'faculty',
                title: 'Faculty Capacity & Workload Balance',
                description: `${overloadedTeachers.length} tutor(s) carrying heavy load (>35 hrs) and ${underutilizedTeachers.length} under-utilized (<3 hrs). Consider rebalancing new batch assignments.`,
                metric: `${overloadedTeachers.length + underutilizedTeachers.length} Tutors`,
                badge: 'Workload Balance',
                actionLabel: 'Manage Tutors',
                actionUrl: '/admin-dashboard/teachers'
            });
        }

        // Action Item 7: New Admissions Milestone
        if (newAdmissionsCount > 0) {
            actionItems.push({
                id: 'action_new_admissions',
                priority: 'low',
                category: 'growth',
                title: 'New Student Cohort Onboarding',
                description: `${newAdmissionsCount} new student(s) joined BrightPath in ${monthStr}. Ensure tutor pairing and baseline diagnostics are completed.`,
                metric: `+${newAdmissionsCount} Enrolled`,
                badge: 'Admissions Growth',
                actionLabel: 'Onboard Students',
                actionUrl: '/admin-dashboard/students'
            });
        }

        // ----------------------------------------------------
        // 7. Return Enriched Analytical Response
        // ----------------------------------------------------
        return NextResponse.json({
            month: monthStr,
            financials: {
                summary: {
                    totalReceived,
                    totalReceivable,
                    totalBilledGross,
                    totalDisbursed,
                    totalQualifiedPayable,
                    totalPendingStudentPayable,
                    totalAccruedPayable,
                    totalPayable: totalAccruedPayable,
                    totalExpenses,
                    totalFounderSalaries,
                    netProfit,
                    profitMargin: parseFloat(profitMargin.toFixed(1)),
                    collectionVelocity: parseFloat(collectionVelocity.toFixed(1))
                },
                momDeltas,
                fees,
                salaries,
                expenses
            },
            attendance: {
                totalSessions,
                totalHours: totalTeachingHours,
                avgSessionDuration,
                activeStudentsCount: activeStudentIdSet.size,
                activeTeachersCount: activeTeacherIdSet.size,
                logs: attendanceLogs,
                teacherStats,
                subjectEconomics,
                anomalySessions
            },
            studentsAnalytics: {
                summary: {
                    totalEnrolled,
                    totalActive,
                    totalInactive,
                    newAdmissionsCount,
                    prevAdmissionsCount,
                    activeLearningCount,
                    dormantCount: dormantStudents.length,
                    activeEngagementRate
                },
                demographics: {
                    locationCounts,
                    classCounts,
                    syllabusCounts
                },
                leaderboards: {
                    topAcademic: topAcademicStudents,
                    topDedicated: topDedicatedStudents,
                    topValue: topValueStudents
                },
                roster: studentProfiles
            },
            exams: {
                count: exams.length,
                averagePerformance: parseFloat(avgMarksPercent.toFixed(1)),
                academicTiers: {
                    mastery: { count: academicTiers.mastery.length, students: academicTiers.mastery },
                    proficient: { count: academicTiers.proficient.length, students: academicTiers.proficient },
                    developing: { count: academicTiers.developing.length, students: academicTiers.developing },
                    atRisk: { count: academicTiers.atRisk.length, students: academicTiers.atRisk }
                },
                records: exams
            },
            prescriptiveIntelligence: {
                actionItemsCount: actionItems.length,
                urgentCount: actionItems.filter(a => a.priority === 'urgent').length,
                actionItems
            }
        });

    } catch (err: any) {
        console.error("Monthly Report Error:", err);
        return errorResponse(err);
    }
}
