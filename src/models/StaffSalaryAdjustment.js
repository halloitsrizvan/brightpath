import mongoose from 'mongoose';
import './Admin';

const StaffSalaryAdjustmentSchema = new mongoose.Schema({
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    type: { type: String, enum: ['increment', 'cut'], required: true },
    changeAmount: { type: Number, required: true },
    previousSalary: { type: Number, required: true },
    newSalary: { type: Number, required: true },
    reason: { type: String, required: true },
    effectiveMonth: { type: String },
    effectiveDate: { type: Date, default: Date.now },
    performedBy: { type: String }
}, { timestamps: true });

export default mongoose.models.StaffSalaryAdjustment || mongoose.model('StaffSalaryAdjustment', StaffSalaryAdjustmentSchema);
