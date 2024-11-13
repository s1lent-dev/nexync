import { SocketService } from "./socket.lib.js";
import { Socket } from "socket.io";
import { Server } from "http";
import { prisma } from "../db/prisma.db.js";
import { MessageEvent } from "../../types/types.js";
import { kafka, pubsub } from "../../app.js";

class ChatSocket extends SocketService {
    constructor(server: Server) {
        super(server);
    }

    protected async registerEvents(socket: Socket) {
        console.log("ChatSocket registerEvents called.");

        socket.on("messages", async ({ senderId, chatId, memberIds, content, createdAt }: MessageEvent) => {
            console.log(`Message from ${socket.id}: ${content}`);
            console.log("Members: ", chatId);
            await kafka.publishMessage({ senderId, chatId, memberIds, content, createdAt });
            await pubsub.publish("chats", JSON.stringify({ senderId, chatId, memberIds, content, createdAt }));
        });
    }

    public async emitEvents(event: string, { senderId, chatId, memberIds, content, createdAt }: MessageEvent) {
        const socketMembers = this.getSockets(memberIds) as string[];
        this.io.to(socketMembers).emit(event, { senderId, chatId, memberIds, content, createdAt });
    }
}

export { ChatSocket };
