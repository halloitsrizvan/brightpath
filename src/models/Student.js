import mongoose from 'mongoose';
import './Teacher';
import './Subject';

const StudentSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date },
    class: { type: String },
    syllabus: { type: String },
    district: { type: String },
    residentialLocation: { type: String, enum: ['GCC', 'India'] },
    parentName: { type: String },
    contactNumber: { type: String },
    whatsappNumber: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }],
    preferredTrainers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
    subjectAssignments: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
        billPerHour: { type: Number, default: 0 },
        salaryPerHour: { type: Number, default: 0 }
    }],
    joinedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
    role: { type: String, default: 'student' }
}, { timestamps: true });

// Performance Optimization: Indexes for scalable search and reporting
StudentSchema.index({ status: 1, joinedAt: -1 }); // Optimized for dashboard recent active students
StudentSchema.index({ subjects: 1 }); // Optimize relationship lookups
StudentSchema.index({ preferredTrainers: 1 });

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
