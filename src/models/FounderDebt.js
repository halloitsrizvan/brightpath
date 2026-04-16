import mongoose from 'mongoose';

const FounderDebtSchema = new mongoose.Schema({
    founderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Founder', required: true },
    type: { type: String, enum: ['debt', 'return'], required: true }, // 'debt' to increase, 'return' to decrease
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.FounderDebt || mongoose.model('FounderDebt', FounderDebtSchema);
