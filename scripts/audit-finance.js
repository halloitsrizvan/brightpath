const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function audit() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const [zeroBillRows, zeroSalarySnapshots, invalidFees, duplicateFeeGroups, overpaidSalaries] = await Promise.all([
        db.collection('attendances').find({ status: 'Present', billRateAtTime: { $lte: 0 } }).toArray(),
        db.collection('attendances').countDocuments({ status: 'Present', salaryRateAtTime: { $lte: 0 } }),
        db.collection('fees').countDocuments({ amount: { $lt: 0 } }),
        db.collection('fees').aggregate([
            { $match: { paymentStatus: { $ne: 'paid' } } },
            { $group: { _id: { studentId: '$studentId', month: '$month' }, count: { $sum: 1 } } },
            { $match: { count: { $gt: 1 } } },
            { $count: 'count' }
        ]).toArray(),
        db.collection('salaries').countDocuments({
            $expr: { $gt: [{ $ifNull: ['$disbursedAmount', 0] }, { $ifNull: ['$totalSalary', 0] }] }
        })
    ]);

    let unresolvedZeroBillSnapshots = 0;
    for (const row of zeroBillRows) {
        const [student, subject] = await Promise.all([
            db.collection('students').findOne({ _id: row.studentId }),
            db.collection('subjects').findOne({ _id: row.subjectId })
        ]);
        const normalizedName = String(subject?.subjectName || '').trim().toLowerCase();
        const assignmentSubjects = await db.collection('subjects').find({
            _id: { $in: (student?.subjectAssignments || []).map(item => item.subjectId) }
        }).toArray();
        const namesById = new Map(assignmentSubjects.map(item => [String(item._id), String(item.subjectName || '').trim().toLowerCase()]));
        const recovered = (student?.subjectAssignments || []).some(item =>
            String(item.teacherId) === String(row.teacherId) &&
            item.billPerHour > 0 &&
            (String(item.subjectId) === String(row.subjectId) || namesById.get(String(item.subjectId)) === normalizedName)
        );
        if (!recovered) unresolvedZeroBillSnapshots += 1;
    }

    console.log(JSON.stringify({
        zeroBillSnapshots: zeroBillRows.length,
        unresolvedZeroBillSnapshots,
        zeroSalarySnapshots,
        negativeFees: invalidFees,
        duplicateUnpaidStudentMonths: duplicateFeeGroups[0]?.count || 0,
        salariesDisbursedAboveAccrued: overpaidSalaries
    }, null, 2));
    await mongoose.disconnect();
}

audit().catch(error => {
    console.error(error.message);
    process.exit(1);
});
