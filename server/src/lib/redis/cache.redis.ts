import { RedisService } from "./redis.lib.js";

class RedisCache extends RedisService {

    constructor() {
        super();
    }
    async setCache(key: string, value: any, ttl: number = 3600) {
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

    async flushCache() {
        await this.client?.flushall();
        console.log('Cache flushed');
    }
}

export { RedisCache };