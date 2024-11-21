import Redis from "ioredis";
import { REDIS_URL } from "../../config/config.js";
class RedisService {
    constructor() {
        this.client = null;
        this.initClient();
    }
    async initClient() {
        this.client = new Redis(REDIS_URL);
        this.client.on('connect', () => {
            console.log('Redis connected');
        });
        this.client.on('error', (err) => {
            console.error('Redis error', err);
        });
    }
    async disconnect() {
        if (this.client) {
            await this.client.quit();
            console.log('Redis disconnected');
        }
    }
}
;
export { RedisService };
