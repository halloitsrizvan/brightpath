import mongoose from 'mongoose';
import './Student';
import './Teacher';
import './Subject';

const AttendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
    sessionId: { type: String },
    date: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    status: { type: String, enum: ['Present', 'Absent'], default: 'Present' },
    billRateAtTime: { type: Number },
    salaryRateAtTime: { type: Number },
    notes: { type: String }
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
