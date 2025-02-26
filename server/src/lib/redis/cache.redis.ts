import { RedisService } from "./redis.js";

class RedisCache extends RedisService {

    constructor() {
        super();
    }

    async hasCache(key: string) {
        const value = await this.client?.exists(key);
        return value === 1;
    }

    async setCache(key: string, value: any, ttl: number = 240) {
        await this.client?.set(key, JSON.stringify(value), 'EX', ttl);
        console.log(`Cache set for key: ${key}`);
    }

    async getCache(key: string) {
        const value = await this.client?.get(key);
        console.log(`Cache get for key: ${key}`);
        return value ? JSON.parse(value) : null;
    }

    async delCache(key: string) {
        await this.client?.del(key);
        console.log(`Cache deleted for key: ${key}`);
    }

    async delCachePattern(pattern: string) {
        let cursor = '0';
        do {
            const result = await this.client?.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            if (!result) break;
            const [nextCursor, keys] = result;
            cursor = nextCursor;

            if (keys.length) {
                const pipeline = this.client?.pipeline();
                keys.forEach((key) => pipeline?.del(key));
                await pipeline?.exec();
                console.log(`Deleted keys: ${keys}`);
            }
        } while (cursor !== '0');
    }

    async flushCache() {
        await this.client?.flushall();
        console.log('Cache flushed');
    }
}

export { RedisCache };