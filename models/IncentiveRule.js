import mongoose from 'mongoose';
import './Teacher'; // Ensure Teacher model is registered for population

const IncentiveRuleSchema = new mongoose.Schema({
    ruleName: { type: String, default: 'Monthly Incentive' },
    targetHours: { type: Number, required: true, default: 20 },
    incentiveAmount: { type: Number, required: true, default: 2000 },
    active: { type: Boolean, default: true },
    targetTeachers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }]
}, { timestamps: true });

// Avoid stale models in development
if (mongoose.models.IncentiveRule) {
    delete mongoose.models.IncentiveRule;
}

export default mongoose.model('IncentiveRule', IncentiveRuleSchema);
