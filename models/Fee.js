import mongoose from 'mongoose';

const FeeSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    month: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentStatus: { type: String, enum: ['paid', 'unpaid', 'pending'], default: 'unpaid' },
    paymentDate: { type: Date }
}, { timestamps: true });

export default mongoose.models.Fee || mongoose.model('Fee', FeeSchema);
