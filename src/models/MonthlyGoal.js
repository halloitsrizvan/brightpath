import mongoose from 'mongoose';

const MonthlyGoalSchema = new mongoose.Schema({
    month: { type: String, required: true, unique: true }, // e.g., "March 2026"
    targetRevenue: { type: Number, default: 0 },
    targetHours: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.MonthlyGoal || mongoose.model('MonthlyGoal', MonthlyGoalSchema);
