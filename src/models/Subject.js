import mongoose from 'mongoose';

const SubjectSchema = new mongoose.Schema({
    subjectName: { type: String, required: true },
    description: { type: String },
    classLevel: { type: String },
    syllabus: { type: String }
}, { timestamps: true });

export default mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
