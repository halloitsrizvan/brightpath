import mongoose from 'mongoose';

const RateLimitSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    // TTL index: MongoDB deletes the document once the window has passed
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
});

export default mongoose.models.RateLimit || mongoose.model('RateLimit', RateLimitSchema);
