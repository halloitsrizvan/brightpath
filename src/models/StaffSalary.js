import mongoose from 'mongoose';
import './Admin';

const StaffSalarySchema = new mongoose.Schema({
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true }, // e.g. "October 2026"
    status: { type: String, enum: ['pending', 'paid'], default: 'paid' },
    paymentDate: { type: Date, default: Date.now },
    paymentMethod: { type: String, default: 'Bank Transfer' },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.models.StaffSalary || mongoose.model('StaffSalary', StaffSalarySchema);
