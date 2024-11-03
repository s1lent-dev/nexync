import { SocketService } from "./socket.lib.js";
import { Socket } from "socket.io";
import { Server } from "http";
import { prisma } from "../db/prisma.db.js";

interface MessageEvent {
    senderId: string;
    receiverId: string;
    memberIds: string[];
    message: string;
}

class ChatSocket extends SocketService {
    constructor(server: Server) {
        super(server);
    }

    protected async registerEvents(socket: Socket) {
        console.log("ChatSocket registerEvents called.");

        socket.on("messages", async ({ senderId, receiverId, memberIds, message }: MessageEvent) => {
            console.log(`Message from ${socket.id}: ${message}`);
            const socketMembers = this.getSockets(memberIds) as string[];
            console.log("SocketMembers: ", socketMembers);
            this.io.to(socketMembers).emit("messages", { senderId, receiverId, message });
        });
    }
}

export { ChatSocket };
