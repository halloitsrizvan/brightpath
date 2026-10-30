import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: true
    },
    whatsappNumber: {
        type: String,
    },
    country: {
        type: String,
    },
    studentClass: {
        type: String,
    },
    userType: {
        type: String,
        enum: ['student', 'parent', 'teacher'],
        default: 'student'
    },
    leadType: {
        type: String,
        enum: ['demo', 'enquiry'],
        default: 'enquiry'
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'resolved', 'junk'],
        default: 'pending'
    },
    notes: {
        type: String
    },
    source: {
        type: String // Where the lead came from, e.g. "Tuition Page: CBSE Maths"
    },
    // Meta Conversions API matching data
    metaLeadId: {
        type: String // Lead ID from Meta Lead Ads, when the lead came from an instant form
    },
    fbp: {
        type: String
    },
    fbc: {
        type: String
    },
    metaReportedStages: {
        type: [String],
        default: []
    }
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
