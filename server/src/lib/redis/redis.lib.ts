import Redis from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "../../config/config.js";

class RedisService {
  protected client: Redis | null = null;

  constructor() {
    this.initClient();
  }
  
  async initClient() {
    this.client = new Redis({
      host: REDIS_HOST,
      port: REDIS_PORT,
    });
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
};

export { RedisService };
