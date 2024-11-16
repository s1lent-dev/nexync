import { SocketService } from "./socket.lib.js";
import { Socket } from "socket.io";
import { Server } from "http";
import { GroupJoinedEvent, GroupLeftEvent, GroupRemoveEvent, MessageEvent, TypingEvent } from "../../types/types.js";
import { kafka, pubsub } from "../../app.js";

class ChatSocket extends SocketService {
    constructor(server: Server) {
        super(server);
    }

    protected async registerEvents(socket: Socket) {
        console.log("ChatSocket registerEvents called.");

        socket.on("messages", async ({ senderId, username, chatId, messageType, memberIds, content, createdAt }: MessageEvent) => {
            console.log(`Message from ${socket.id}: ${content}`);
            console.log("Members: ", chatId);
            await kafka.publishMessage({ senderId, username, chatId, messageType, memberIds, content, createdAt });
            await pubsub.publish("messages", JSON.stringify({ senderId, username, messageType, chatId, memberIds, content, createdAt }));
        });

        socket.on("typing", async ({ senderId, username, chatId, memberIds }: TypingEvent) => {
            console.log(`Typing from ${socket.id}`);
            await pubsub.publish("typing", JSON.stringify({ senderId, username, chatId, memberIds }));
        });
    }

    public async emitEvents(event: string, data: MessageEvent | TypingEvent | GroupJoinedEvent | GroupRemoveEvent | GroupLeftEvent) {
        const socketMembers = this.getSockets(data.memberIds) as string[];
        this.io.to(socketMembers).emit(event, data);
    }

    public async refetchChats(event: string, {chatId, memberIds, adminId}: {chatId: string, memberIds: string[], adminId: string}) {
        const socketMembers = this.getSockets(memberIds) as string[];
        this.io.to(socketMembers).emit(event, {chatId, adminId});
    }
}

export { ChatSocket };
