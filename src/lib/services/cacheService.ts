class CacheService {
    private static cache = new Map<string, { value: any, expires: number }>();

    static async get<T>(key: string): Promise<T | null> {
        const item = this.cache.get(key);
        if (!item) return null;
        if (Date.now() > item.expires) {
            this.cache.delete(key);
            return null;
        }
        return item.value as T;
    }

    static async set(key: string, value: any, ttlSeconds: number = 300) {
        this.cache.set(key, {
            value,
            expires: Date.now() + (ttlSeconds * 1000)
        });
    }

    static async invalidate(key: string) {
        this.cache.delete(key);
    }
}

export default CacheService;
