import Redis from "ioredis";
import { RedisService } from "./redis.lib.js";
import { REDIS_URL } from "../../config/config.js";
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
        this.subscriber = new Redis(REDIS_URL);
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
        this.subscribe("messages", async (message) => {
            const msg = JSON.parse(message) as MessageEvent;
            const {
                messageId,
                senderId,
                username,
                messageType,
                chatId,
                memberIds,
                content,
                status,
                createdAt,
            } = msg;
            socketService.emitEvents("messages", {
                messageId,
                senderId,
                username,
                messageType,
                chatId,
                memberIds,
                content,
                status,
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
        this.subscribe(`online-status`, (message) => {
            console.log("Received message on online-status channel:", message);
            const msg = JSON.parse(message) as { status: string, userId: string };
            const { status, userId } = msg; 
            console.log("User status:", status, userId);
            socketService.emitOnlineStatus(`online-status/${userId}`, { userId, status });
        });
    }

    async subscribeMessageReadCallback() {
        this.subscribe("message-read", async (message) => {
            const msg = JSON.parse(message) as { chatId: string, senderId: string, messageIds: string[] };
            const { chatId, senderId, messageIds } = msg;
            socketService.emitMessageRead("message-read", { chatId, senderId, messageIds });
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
        await this.subscribeMessageReadCallback();
    }
}

export { PubSubRedis };
