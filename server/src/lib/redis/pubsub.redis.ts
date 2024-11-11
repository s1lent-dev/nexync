import Redis from "ioredis";
import { RedisService } from "./redis.lib.js";
import { REDIS_HOST, REDIS_PORT } from "../../config/config.js";
import { MessageEvent } from "../../types/types.js";
import { socketService } from "../../app.js";

class PubSubRedis extends RedisService {

    private subscriber: Redis | null = null;
    constructor() {
        super();
        this.subscriber = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
        });
    }
    
    async publish(channel: string, message: string) {
        await this.client?.publish(channel, message);
        console.log(`Message published to channel: ${channel}`, 'Message:', message);
    }

    async subscribe(channel: string, handler: (message: string) => void) {
        this.subscriber?.subscribe(channel);
        this.subscriber?.on('message', (receivedChannel, message) => {
            if(receivedChannel === channel) {
                console.log(`Received message on channel: ${channel}`, 'Message:', message);
                handler(message);
            }
        });
    }

    async subscribeChatsCallback() {
        this.subscribe("chats", (message) => {
            const msg = JSON.parse(message) as MessageEvent;
            const { senderId, chatId, memberIds, content, createdAt } = msg;
            socketService.emitEvents("messages", { senderId, chatId, memberIds, content, createdAt });
        });
    }

    async unsubscribe(channel: string) {
        this.subscriber?.unsubscribe(channel);
    }

}

export { PubSubRedis };