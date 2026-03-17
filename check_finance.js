
import dbConnect from './lib/mongodb';
import Fee from './models/Fee';
import Salary from './models/Salary';

async function checkFinance() {
    await dbConnect();
    const feesCount = await Fee.countDocuments();
    const salariesCount = await Salary.countDocuments();
    console.log('Fees total:', feesCount);
    console.log('Salaries total:', salariesCount);
    const unpaidFees = await Fee.find({ paymentStatus: { $ne: 'paid' } }).populate('studentId', 'fullName');
    const unpaidSalaries = await Salary.find({ paidStatus: { $ne: 'paid' } }).populate('teacherId', 'name');
    console.log('Unpaid Fees Example:', unpaidFees.slice(0, 2));
    console.log('Unpaid Salaries Example:', unpaidSalaries.slice(0, 2));
    process.exit();
}
checkFinance();
