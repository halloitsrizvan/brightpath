import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        index: true
    },
    actor: {
        type: String, // User ID or name
        required: true
    },
    actorRole: {
        type: String,
        required: true
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    ip: String,
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
