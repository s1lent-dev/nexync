import { SocketService } from "./socket.lib.js";
import { Socket } from "socket.io";
import { Server } from "http";
import { ChatType, GroupJoinedEvent, GroupLeftEvent, GroupRemoveEvent, MessageEvent, TypingEvent } from "../../types/types.js";
import { kafka, pubsub } from "../../app.js";

class ChatSocket extends SocketService {
    constructor(server: Server) {
        super(server);
    }

    protected async registerEvents(socket: Socket) {
        console.log("ChatSocket registerEvents called.");

        socket.on("messages", async ({ senderId, username, messageId, chatType, chatId, messageType, memberIds, status, content, createdAt }: MessageEvent) => {
            console.log(`Message from ${socket.id}: ${content}`);
            console.log("Members: ", chatId);
            await kafka.publishMessage({ senderId, username, messageId, chatId, chatType, messageType, memberIds, content, status, createdAt });
        });

        socket.on("typing", async ({ senderId, username, chatId, memberIds }: TypingEvent) => {
            console.log(`Typing from ${socket.id}`);
            await pubsub.publish("typing", JSON.stringify({ senderId, username, chatId, memberIds }));
        });

        socket.on('message-read', async ({ chatId, senderId, messageIds, readBy, chatType }: { chatId: string, senderId: string, messageIds: string[], readBy: string, chatType: ChatType }) => {
            console.log(`Message read from ${socket.id}`);
            await kafka.publishMessageRead({ chatId, senderId, messageIds, readBy, chatType });
        });
    }

    public async emitEvents(event: string, data: MessageEvent | TypingEvent | GroupJoinedEvent | GroupRemoveEvent | GroupLeftEvent ) {
        const socketMembers = this.getSockets(data.memberIds) as string[];
        this.io.to(socketMembers).emit(event, data);
    }

    public async refetchChats(event: string, {chatId, memberIds, adminId}: {chatId: string, memberIds: string[], adminId: string}) {
        const socketMembers = this.getSockets(memberIds) as string[];
        this.io.to(socketMembers).emit(event, {chatId, adminId});
    }

    public async emitOnlineStatus(event: string, {userId, status}: {userId: string, status: string}) {
        this.io.emit(event, {userId, status});
    }

    public async emitMessageRead(event: string, {chatId, senderId, messageIds}: {chatId: string, senderId: string, messageIds: string[]}) {
        const socketMembers = this.getSockets([senderId]) as string[];
        console.log("Emitting message read to: ", socketMembers);
        this.io.to(socketMembers).emit(event, {chatId, senderId, messageIds});
    }

}

export { ChatSocket };
