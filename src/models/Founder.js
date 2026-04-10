import mongoose from 'mongoose';

const FounderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    role: { type: String },
    baseSalary: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Founder || mongoose.model('Founder', FounderSchema);
