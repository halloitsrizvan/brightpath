import mongoose from 'mongoose';

const SalarySchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    month: { type: String, required: true },
    totalHours: { type: Number, required: true },
    salaryPerHour: { type: Number, required: true },
    totalSalary: { type: Number, required: true },
    paidStatus: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }
}, { timestamps: true });

export default mongoose.models.Salary || mongoose.model('Salary', SalarySchema);
