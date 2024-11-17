import Redis from "ioredis";
import { RedisService } from "./redis.lib.js";
import { REDIS_HOST, REDIS_PORT } from "../../config/config.js";
import {
    GroupJoinedEvent,
    GroupLeftEvent,
    GroupRemoveEvent,
    MessageEvent,
    TypingEvent,
} from "../../types/types.js";
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
        console.log(
            `Message published to channel: ${channel}`,
            "Message:",
            message
        );
    }

    async subscribe(channel: string, handler: (message: string) => void) {
        this.subscriber?.subscribe(channel);
        console.log(`Subscribed to channel: ${channel}`);
        this.subscriber?.on("message", (receivedChannel, message) => {
            if (receivedChannel === channel) {
                console.log(
                    `Received message on channel: ${channel}`,
                    "Message:",
                    message
                );
                handler(message);
            } else if(receivedChannel.startsWith("online-status")) {
                console.log(
                    `Received message on channel: ${receivedChannel}`,
                    "Message:",
                    message
                );
                handler(message);
            }
        });
    }

    async subscribeChatsCallback() {
        this.subscribe("messages", (message) => {
            const msg = JSON.parse(message) as MessageEvent;
            const {
                senderId,
                username,
                messageType,
                chatId,
                memberIds,
                content,
                createdAt,
            } = msg;
            socketService.emitEvents("messages", {
                senderId,
                username,
                messageType,
                chatId,
                memberIds,
                content,
                createdAt,
            });
        });
    }

    async subscribeTypingCallback() {
        this.subscribe("typing", (message) => {
            const msg = JSON.parse(message) as TypingEvent;
            const { senderId, username, chatId, memberIds } = msg;
            socketService.emitEvents("typing", {
                senderId,
                username,
                chatId,
                memberIds,
            });
        });
    }

    async subscribeGroupJoinedCallback() {
        this.subscribe("group-joined", async (message) => {
            const msg = JSON.parse(message) as GroupJoinedEvent;
            const { chatId, memberIds, messages } = msg;
            socketService.emitEvents("group-joined", { chatId, memberIds, messages });
        });
    }

    async subscribeGroupRemoveCallback() {
        this.subscribe("group-removed", async (messageReceived) => {
            const msg = JSON.parse(messageReceived) as GroupRemoveEvent;
            const { chatId, memberIds, message } = msg;
            socketService.emitEvents("group-removed", { chatId, memberIds, message });
        });
    }

    async subscribeGroupLeftCallback() {
        this.subscribe("group-left", async (messageReceived) => {
            const msg = JSON.parse(messageReceived) as GroupLeftEvent;
            const { chatId, memberIds, message } = msg;
            socketService.emitEvents("group-left", { chatId, memberIds, message });
        });
    }

    async subscribeMakeAdminCallback() {
        this.subscribe("make-admin", async (messageReceived) => {
            const msg = JSON.parse(messageReceived) as GroupLeftEvent;
            const { chatId, memberIds, message } = msg;
            socketService.emitEvents("make-admin", { chatId, memberIds, message });
        });
    }

    async subscribeDismissAdminCallback() {
        this.subscribe("dismiss-admin", async (messageReceived) => {
            const msg = JSON.parse(messageReceived) as GroupLeftEvent;
            const { chatId, memberIds, message } = msg;
            socketService.emitEvents("dismiss-admin", { chatId, memberIds, message });
        });
    }

    async subscribeRefetchChats() {
        this.subscribe("refetch-chats", async (message) => {
            const msg = JSON.parse(message) as {
                chatId: string;
                memberIds: string[];
                adminId: string;
            };
            const { chatId, memberIds, adminId } = msg;
            socketService.refetchChats("refetch-chats", {
                chatId,
                memberIds,
                adminId,
            });
        });
    }

    async subscribeUserStatusCallback() {
        this.subscribe(`online-status:46497c0a-0211-4b91-9e69-15607a6ccc97`, (message) => {
            console.log("Received message on online-status channel:", message);
            const msg = JSON.parse(message);
            const { status } = msg; 
            console.log("User status:", status);
            const userId = message.split(":")[1];
            socketService.emitOnlineStatus("online-status", { userId, status });
        });
    }

    async unsubscribe(channel: string) {
        this.subscriber?.unsubscribe(channel);
    }

    async subscribeToChannels() {
        await this.subscribeUserStatusCallback();
        await this.subscribeChatsCallback();
        await this.subscribeTypingCallback();
        await this.subscribeGroupJoinedCallback();
        await this.subscribeGroupRemoveCallback();
        await this.subscribeGroupLeftCallback();
        await this.subscribeMakeAdminCallback();
        await this.subscribeDismissAdminCallback();
        await this.subscribeRefetchChats();
    }
}

export { PubSubRedis };
