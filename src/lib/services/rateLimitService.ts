interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    }
}

const store: RateLimitStore = {};

export class RateLimitService {
    /**
     * Checks if a request is within the rate limit.
     * @param identifier - Unique ID for the requester (IP, UserID, etc.)
     * @param limit - Max requests allowed
     * @param windowMs - Time window in milliseconds
     * @returns boolean - true if allowed, false if limited
     */
    static check(identifier: string, limit: number, windowMs: number): { success: boolean; remaining: number; reset: number } {
        const now = Date.now();
        const record = store[identifier];

        if (!record || now > record.resetTime) {
            store[identifier] = {
                count: 1,
                resetTime: now + windowMs
            };
            return { success: true, remaining: limit - 1, reset: store[identifier].resetTime };
        }

        if (record.count >= limit) {
            return { success: false, remaining: 0, reset: record.resetTime };
        }

        record.count += 1;
        return { success: true, remaining: limit - record.count, reset: record.resetTime };
    }

    // Utility to get IP from headers in Next.js
    static getIP(req: Request): string {
        const xForwardedFor = req.headers.get('x-forwarded-for');
        if (xForwardedFor) {
            return xForwardedFor.split(',')[0].trim();
        }
        return 'anonymous';
    }
}
