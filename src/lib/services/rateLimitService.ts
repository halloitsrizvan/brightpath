import dbConnect from '@/lib/db/mongodb';
import RateLimit from '@/models/RateLimit';

export class RateLimitService {
    /**
     * Checks if a request is within the rate limit. Counters live in MongoDB so the
     * limit holds across serverless instances and restarts.
     * @param identifier - Unique ID for the requester (IP, UserID, etc.)
     * @param limit - Max requests allowed
     * @param windowMs - Time window in milliseconds
     */
    static async check(identifier: string, limit: number, windowMs: number): Promise<{ success: boolean; remaining: number; reset: number }> {
        await dbConnect();
        const now = new Date();

        // Start a fresh window when the previous one has expired (TTL cleanup can lag by ~60s)
        await RateLimit.deleteOne({ key: identifier, expiresAt: { $lte: now } });

        let record: any;
        try {
            record = await RateLimit.findOneAndUpdate(
                { key: identifier },
                { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(now.getTime() + windowMs) } },
                { upsert: true, new: true }
            ).lean();
        } catch (err: any) {
            // Two concurrent first requests can race on the unique key; retry once as an update
            if (err.code !== 11000) throw err;
            record = await RateLimit.findOneAndUpdate({ key: identifier }, { $inc: { count: 1 } }, { new: true }).lean();
        }

        const reset = new Date(record.expiresAt).getTime();
        return { success: record.count <= limit, remaining: Math.max(0, limit - record.count), reset };
    }

    /**
     * Client IP. Prefers headers set by the hosting platform (Vercel / reverse proxy),
     * which clients cannot forge, over the spoofable left-most X-Forwarded-For entry.
     */
    static getIP(req: Request): string {
        const platformIp = req.headers.get('x-vercel-forwarded-for') || req.headers.get('x-real-ip');
        if (platformIp) return platformIp.split(',')[0].trim();

        // Behind a single proxy the right-most entry is the one the proxy appended
        const xForwardedFor = req.headers.get('x-forwarded-for');
        if (xForwardedFor) {
            const parts = xForwardedFor.split(',').map(p => p.trim()).filter(Boolean);
            return parts[parts.length - 1] || 'anonymous';
        }
        return 'anonymous';
    }
}
