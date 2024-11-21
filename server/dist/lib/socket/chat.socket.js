import { SocketService } from "./socket.lib.js";
import { kafka, pubsub } from "../../app.js";
class ChatSocket extends SocketService {
    constructor(server) {
        super(server);
    }
    async registerEvents(socket) {
        console.log("ChatSocket registerEvents called.");
        socket.on("messages", async ({ senderId, username, messageId, chatType, chatId, messageType, memberIds, status, content, createdAt }) => {
            console.log(`Message from ${socket.id}: ${content}`);
            console.log("Members: ", chatId);
            await kafka.publishMessage({ senderId, username, messageId, chatId, chatType, messageType, memberIds, content, status, createdAt });
        });
        socket.on("typing", async ({ senderId, username, chatId, memberIds }) => {
            console.log(`Typing from ${socket.id}`);
            await pubsub.publish("typing", JSON.stringify({ senderId, username, chatId, memberIds }));
        });
        socket.on('message-read', async ({ chatId, senderId, messageIds, readBy, chatType }) => {
            console.log(`Message read from ${socket.id}`);
            await kafka.publishMessageRead({ chatId, senderId, messageIds, readBy, chatType });
        });
    }
    async emitEvents(event, data) {
        const socketMembers = this.getSockets(data.memberIds);
        this.io.to(socketMembers).emit(event, data);
    }
    async refetchChats(event, { chatId, memberIds, adminId }) {
        const socketMembers = this.getSockets(memberIds);
        this.io.to(socketMembers).emit(event, { chatId, adminId });
    }
    async emitOnlineStatus(event, { userId, status }) {
        this.io.emit(event, { userId, status });
    }
    async emitMessageRead(event, { chatId, senderId, messageIds }) {
        const socketMembers = this.getSockets([senderId]);
        console.log("Emitting message read to: ", socketMembers);
        this.io.to(socketMembers).emit(event, { chatId, senderId, messageIds });
    }
}
export { ChatSocket };
