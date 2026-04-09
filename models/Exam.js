import mongoose from 'mongoose';
import './Student';
import './Teacher';

const ExamSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    subject: { type: String, required: true },
    marks: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    paperImage: { type: String },
    progressNote: { type: String },
    examMonth: { type: String },
    examDate: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
