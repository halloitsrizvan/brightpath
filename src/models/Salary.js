import mongoose from 'mongoose';
import './Teacher';

const SalarySchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    month: { type: String, required: true },
    totalHours: { type: Number, required: true },
    qualifiedHours: { type: Number, default: 0 },
    salaryPerHour: { type: Number, required: true },
    totalSalary: { type: Number, required: true },
    qualifiedSalary: { type: Number, default: 0 },
    pendingStudentSalary: { type: Number, default: 0 },
    disbursedAmount: { type: Number, default: 0 },
    paidStatus: { type: String, enum: ['paid', 'unpaid', 'partial'], default: 'unpaid' },
    paymentDate: { type: Date },
    disbursementCutoffDate: { type: Date },
    settlementId: { type: String }
}, { timestamps: true });

export default mongoose.models.Salary || mongoose.model('Salary', SalarySchema);
