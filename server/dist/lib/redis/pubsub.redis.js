import Redis from "ioredis";
import { RedisService } from "./redis.lib.js";
import { REDIS_URL } from "../../config/config.js";
import { socketService } from "../../app.js";
import notifyService from "../../services/notify.service.js";
import { prisma } from "../db/prisma.db.js";
class PubSubRedis extends RedisService {
    constructor() {
        super();
        this.subscriber = null;
        this.subscriber = new Redis(REDIS_URL);
    }
    async publish(channel, message) {
        await this.client?.publish(channel, message);
        console.log(`Message published to channel: ${channel}`, "Message:", message);
    }
    async subscribe(channel, handler) {
        this.subscriber?.subscribe(channel);
        console.log(`Subscribed to channel: ${channel}`);
        this.subscriber?.on("message", (receivedChannel, message) => {
            if (receivedChannel === channel) {
                console.log(`Received message on channel: ${channel}`, "Message:", message);
                handler(message);
            }
            else if (receivedChannel.startsWith("online-status")) {
                console.log(`Received message on channel: ${receivedChannel}`, "Message:", message);
                handler(message);
            }
        });
    }
    async subscribeChatsCallback() {
        this.subscribe("messages", async (message) => {
            const msg = JSON.parse(message);
            const { messageId, senderId, username, messageType, chatId, memberIds, content, status, createdAt, } = msg;
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
            // Notify users of new messages
            const offlineUsers = memberIds.filter((id) => !socketService.isUserOnline(id));
            if (offlineUsers.length > 0) {
                const [sender, members] = await Promise.all([
                    prisma.user.findUnique({ where: { userId: senderId } }),
                    prisma.user.findMany({
                        where: {
                            userId: {
                                in: offlineUsers,
                            },
                        },
                        select: {
                            deviceToken: true,
                        },
                    }),
                ]);
                const notificationPromises = members
                    .filter((member) => member.deviceToken)
                    .map((member) => notifyService.sendNotification({
                    title: "New Message",
                    body: `${sender?.username} sent you a message`,
                    token: member.deviceToken,
                }));
                await Promise.all(notificationPromises);
            }
        });
    }
    async subscribeTypingCallback() {
        this.subscribe("typing", (message) => {
            const msg = JSON.parse(message);
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
            const msg = JSON.parse(message);
            const { chatId, memberIds, messages } = msg;
            socketService.emitEvents("group-joined", { chatId, memberIds, messages });
        });
    }
    async subscribeGroupRemoveCallback() {
        this.subscribe("group-removed", async (messageReceived) => {
            const msg = JSON.parse(messageReceived);
            const { chatId, memberIds, message } = msg;
            socketService.emitEvents("group-removed", { chatId, memberIds, message });
        });
    }
    async subscribeGroupLeftCallback() {
        this.subscribe("group-left", async (messageReceived) => {
            const msg = JSON.parse(messageReceived);
            const { chatId, memberIds, message } = msg;
            socketService.emitEvents("group-left", { chatId, memberIds, message });
        });
    }
    async subscribeMakeAdminCallback() {
        this.subscribe("make-admin", async (messageReceived) => {
            const msg = JSON.parse(messageReceived);
            const { chatId, memberIds, message } = msg;
            socketService.emitEvents("make-admin", { chatId, memberIds, message });
        });
    }
    async subscribeDismissAdminCallback() {
        this.subscribe("dismiss-admin", async (messageReceived) => {
            const msg = JSON.parse(messageReceived);
            const { chatId, memberIds, message } = msg;
            socketService.emitEvents("dismiss-admin", { chatId, memberIds, message });
        });
    }
    async subscribeRefetchChats() {
        this.subscribe("refetch-chats", async (message) => {
            const msg = JSON.parse(message);
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
            const msg = JSON.parse(message);
            const { status, userId } = msg;
            console.log("User status:", status, userId);
            socketService.emitOnlineStatus(`online-status/${userId}`, { userId, status });
        });
    }
    async subscribeMessageReadCallback() {
        this.subscribe("message-read", async (message) => {
            const msg = JSON.parse(message);
            const { chatId, senderId, messageIds } = msg;
            socketService.emitMessageRead("message-read", { chatId, senderId, messageIds });
        });
    }
    async unsubscribe(channel) {
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
