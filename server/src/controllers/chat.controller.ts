import { Request, Response, NextFunction } from "express";
import { AsyncHandler, ErrorHandler, ResponseHandler } from "../utils/handlers.util.js";
import { CustomRequest } from "../types/types";
import { prisma } from "../lib/db/prisma.db.js";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../config/config.js";

const getChatsWithUser = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const { userId } = req.params;
    const chat = await prisma.chat.findFirst({
        where: {
            AND: [
                { users: { some: { userId: user?.userId } } },
                { users: { some: { userId } } }
            ]
        },
        include: {
            users: {
                include: {
                    user: {
                        select: {
                            userId: true,
                            username: true,
                            email: true,
                        }
                    }
                }
            },
            messages: {
                orderBy: { createdAt: "asc" },
            }
        }
    });

    if (!chat) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Chat not found.", {}));
    }

    const response = {
        messages: chat.messages.map(message => ({
            senderId: message.senderId,
            memberIds: message.senderId === user?.userId ? [user.userId, userId] : [userId, user?.userId],
            content: message.content,
            createdAt: message.createdAt,
        }))
    }

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Chat found.", response));
});

export { getChatsWithUser };

