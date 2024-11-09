import { Request, Response, NextFunction } from "express";
import { AsyncHandler, ErrorHandler, ResponseHandler } from "../utils/handlers.util.js";
import { CustomRequest } from "../types/types";
import { prisma } from "../lib/db/prisma.db.js";
import { HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../config/config.js";


const getAllConnectionsChats = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const following = await prisma.connection.findMany({
        where: {
            followerId: user?.userId,
        },
        include: {
            following: true,
        }
    });
    const followers = await prisma.connection.findMany({
        where: {
            followingId: user?.userId,
        },
        include: {
            follower: true,
        }
    });
    const followingData = following.map((f) => f.following);
    const followersData = followers.map((f) => f.follower);
    const connectionsMap = new Map();
    followingData.forEach((connection) => connectionsMap.set(connection.userId, connection));
    followersData.forEach((connection) => {
        if (!connectionsMap.has(connection.userId)) {
            connectionsMap.set(connection.userId, connection);
        }
    });
    const connections = Array.from(connectionsMap.values());

    const connectionsWithChat = await Promise.all(connections.map(async (connection) => {
        const chat = await prisma.chat.findFirst({
            where: {
                AND: [
                    { users: { some: { userId: user?.userId } } },
                    { users: { some: { userId: connection.userId } } }
                ]
            },
            select: { chatId: true }
        });
        return {
            ...connection,
            chatId: chat?.chatId || null, 
        };
    }));

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Connections found.", { connections: connectionsWithChat }));
});

const getGroupChats = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {

});

const getMessages = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const chat = await prisma.chat.findFirst({
        where: { chatId},
        include: { messages: true }
    })

    if (!chat) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Chat not found.", {}));
    }

    const response = {
        messages: chat.messages.map((message) => ({
            senderId: message.senderId,
            chatId: message.chatId,
            content: message.content,
            createdAt: message.createdAt,
        }))
    }

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Chat found.", response));
});

export { getAllConnectionsChats, getMessages };

