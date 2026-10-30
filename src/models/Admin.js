import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, // never returned unless explicitly selected
    role: { type: String, default: 'admin' },
    adminRole: { type: String, default: 'Super Admin' },
    isFounder: { type: Boolean, default: false },
    baseSalary: { type: Number, default: 0 },
    debtRemaining: { type: Number, default: 0 },
    lastLogin: { type: Date }
}, { timestamps: true });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
