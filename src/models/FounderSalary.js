import mongoose from 'mongoose';

const FounderSalarySchema = new mongoose.Schema({
    founderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Founder', required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true }, // "April 2026"
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paymentDate: { type: Date },
    debtContribution: { type: Number, default: 0 }, // For future "debt from profit" logic
    notes: { type: String }
}, { timestamps: true });

export default mongoose.models.FounderSalary || mongoose.model('FounderSalary', FounderSalarySchema);
