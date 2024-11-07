import { SocketService } from "./socket.lib.js";
import { Socket } from "socket.io";
import { Server } from "http";
import { prisma } from "../db/prisma.db.js";

interface MessageEvent {
    senderId: string;
    memberIds: string[];
    content: string;
    createdAt: Date | null;
}

class ChatSocket extends SocketService {
    constructor(server: Server) {
        super(server);
    }

    protected async registerEvents(socket: Socket) {
        console.log("ChatSocket registerEvents called.");

        socket.on("messages", async ({ senderId, memberIds, content, createdAt }: MessageEvent) => {
            console.log(`Message from ${socket.id}: ${content}`);
            console.log("Members: ", memberIds);
            const socketMembers = this.getSockets(memberIds) as string[];
            console.log("SocketMembers: ", socketMembers);
            this.io.to(socketMembers).emit("messages", { senderId, memberIds, content });
        });
    }

    public async emitEvents(event: string, userIds: string[], data: any) {
        const socketMembers = this.getSockets(userIds) as string[];
        this.io.to(socketMembers).emit(event, data);
    }
}

export { ChatSocket };
