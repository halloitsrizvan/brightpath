import Attendance from '@/models/Attendance';
import Fee from '@/models/Fee';
import Salary from '@/models/Salary';
import Student from '@/models/Student';
import Teacher from '@/models/Teacher';
import IncentiveRule from '@/models/IncentiveRule';

export async function syncFinancialsForMonth(month: string) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [mName, year] = month.split(' ');
    const mIndex = monthNames.indexOf(mName);
    
    if (mIndex === -1) return;

    const startDate = new Date(parseInt(year), mIndex, 1);
    const endDate = new Date(parseInt(year), mIndex + 1, 0, 23, 59, 59);

    // Fetch all attendance for the month
    const allAttendances = await Attendance.find({
        date: { $gte: startDate, $lte: endDate },
        status: 'Present'
    }).populate('studentId').populate('teacherId');

    const teacherCalcs: { [key: string]: { earnings: number, hours: number, baseRate: number } } = {};
    const studentCalcs: { [key: string]: { totalBill: number, hours: number } } = {};

    for (const rec of allAttendances) {
        const student = rec.studentId as any;
        const teacher = rec.teacherId as any;
        if (!student || !teacher) continue;

        const tId = teacher._id.toString();
        const sId = student._id.toString();
        const hours = (rec.durationMinutes || 0) / 60;

        let billRate = 0;
        let salaryRate = teacher.salaryPerHour || 0;

        // PRIORITIZE SNAPSHOTS if they exist (new records)
        if (rec.billRateAtTime !== undefined && rec.billRateAtTime !== null) {
            billRate = rec.billRateAtTime;
        } else if (student.subjectAssignments) {
            // FALLBACK for old records
            const assignment = student.subjectAssignments.find((a: any) => 
                (a.subjectId.toString() === rec.subjectId?.toString() || a.subjectId?._id?.toString() === rec.subjectId?.toString()) && 
                a.teacherId.toString() === tId
            );
            if (assignment && assignment.billPerHour > 0) billRate = assignment.billPerHour;
        }

        if (rec.salaryRateAtTime !== undefined && rec.salaryRateAtTime !== null) {
            salaryRate = rec.salaryRateAtTime;
        } else if (student.subjectAssignments) {
            // FALLBACK for old records
            const assignment = student.subjectAssignments.find((a: any) => 
                (a.subjectId.toString() === rec.subjectId?.toString() || a.subjectId?._id?.toString() === rec.subjectId?.toString()) && 
                a.teacherId.toString() === tId
            );
            if (assignment && assignment.salaryPerHour > 0) salaryRate = assignment.salaryPerHour;
        }

        if (!teacherCalcs[tId]) teacherCalcs[tId] = { earnings: 0, hours: 0, baseRate: teacher.salaryPerHour || 0 };
        teacherCalcs[tId].earnings += hours * salaryRate;
        teacherCalcs[tId].hours += hours;

        if (!studentCalcs[sId]) studentCalcs[sId] = { totalBill: 0, hours: 0 };
        studentCalcs[sId].totalBill += hours * billRate;
        studentCalcs[sId].hours += hours;
    }

    const allRules = await IncentiveRule.find({ active: true });

    // Update Salaries
    for (const tId in teacherCalcs) {
        const data = teacherCalcs[tId];
        const reachedIncentive = allRules
            .filter(r => r.targetTeachers.some((id: any) => id.toString() === tId) && r.targetHours <= data.hours)
            .reduce((max, r) => Math.max(max, r.incentiveAmount), 0);

        const finalMonthlySalary = Math.round(data.earnings + reachedIncentive);

        const existingSalary = await Salary.findOne({ teacherId: tId, month });
        if (existingSalary && existingSalary.paidStatus === 'paid') {
            continue; // CRITICAL: Protect paid records from updates
        }

        await Salary.findOneAndUpdate(
            { teacherId: tId, month },
            { 
                totalHours: parseFloat(data.hours.toFixed(2)),
                salaryPerHour: data.baseRate,
                totalSalary: finalMonthlySalary
            },
            { upsert: true, new: true }
        );
    }

    // Update Fees
    for (const sId in studentCalcs) {
        const data = studentCalcs[sId];
        if (data.totalBill <= 0) continue;

        const existingFee = await Fee.findOne({ studentId: sId, month });
        if (existingFee && existingFee.paymentStatus === 'paid') {
            continue; // CRITICAL: Protect paid records from updates
        }

        await Fee.findOneAndUpdate(
            { studentId: sId, month },
            { amount: Math.round(data.totalBill) },
            { upsert: true, new: true }
        );
    }
}
