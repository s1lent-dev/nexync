import { SocketService } from "./socket.lib.js";
import { Socket } from "socket.io";
import { Server } from "http";
import { prisma } from "../db/prisma.db.js";

interface MessageEvent {
    senderId: number;
    receiverId: number;
    memberIds: number[];
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

            let chat = await prisma.chat.findFirst({
                where: {
                    users: {
                        every: {
                            userId: { in: [senderId, receiverId] }
                        }
                    }
                },
                include: { users: true }
            });

            if (!chat) {
                chat = await prisma.chat.create({
                    data: {
                        users: {
                            connect: [{ userId: senderId }, { userId: receiverId }]
                        }
                    },
                    include: { users: true }
                });
            }

            await prisma.message.create({
                data: {
                    chatId: chat.chatId,
                    userId: senderId,
                    content: message,
                }
            });

            const socketMembers = this.getSockets(memberIds) as string[];
            console.log("SocketMembers: ", socketMembers);
            this.io.to(socketMembers).emit("messages", { senderId, receiverId, message });
        });
    }
}

export { ChatSocket };
