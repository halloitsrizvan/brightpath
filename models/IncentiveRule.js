import mongoose from 'mongoose';

const IncentiveRuleSchema = new mongoose.Schema({
    ruleName: { type: String, default: 'Monthly Incentive' },
    targetHours: { type: Number, required: true, default: 20 },
    incentiveAmount: { type: Number, required: true, default: 2000 },
    active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.IncentiveRule || mongoose.model('IncentiveRule', IncentiveRuleSchema);
