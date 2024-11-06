import { Request, Response, NextFunction } from "express";
import {
    AsyncHandler,
    ErrorHandler,
    ResponseHandler,
} from "../utils/handlers.util.js";
import { uploadToS3 } from "../services/aws.service.js";
import { CustomRequest } from "../types/types.js";
import { prisma } from "../lib/db/prisma.db.js";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_OK } from "../config/config.js";
import { socketService } from "../app.js";

const getMe = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        res
            .status(HTTP_STATUS_OK)
            .json(new ResponseHandler(HTTP_STATUS_OK, "User details", user));
    }
);

const searchUsers = AsyncHandler(async(req: CustomRequest, res: Response, next: NextFunction) => {
    const { search } = req.query;
    
    const userId  = req.user?.userId;

    const alreadyFollowing = await prisma.connection.findMany({
        where: { followerId: userId },
        include: { following: true }
    });

    const alreadyRequested = await prisma.connectionRequest.findMany({
        where: { senderId: userId },
        include: { receiver: true }
    })

    let users = await prisma.user.findMany({
        where: {
            OR: [
                {
                    username: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
            ],
        },
    });
    users = users.filter((user) => user.userId !== userId);

    users = users.map((user) => {
        const following = alreadyFollowing.find((f) => f.followingId === user.userId);
        const requested = alreadyRequested.find((r) => r.receiverId === user.userId);
        return {
            ...user,
            isFollowing: !!following,
            isRequested: !!requested,
        };
    });
    res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Users", users));
});

const sendConnectionRequest = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const user = req.user;
        if (userId === user?.userId) {
            return next(
                new ErrorHandler(
                    "You cannot send connection request to yourself",
                    HTTP_STATUS_BAD_REQUEST
                )
            );
        }
        const requestExists = await prisma.connectionRequest.findFirst({
            where: {
                senderId: user?.userId,
                receiverId: userId,
            },
        });
        if (requestExists) {
            return next(
                new ErrorHandler("Request already exists", HTTP_STATUS_BAD_REQUEST)
            );
        }
        await prisma.connectionRequest.create({
            data: {
                senderId: user?.userId as string,
                receiverId: userId,
            },
        });
        socketService.emitEvents("connectionRequest", [userId], {
            senderId: user?.userId,
        });
        res
            .status(HTTP_STATUS_OK)
            .json(
                new ResponseHandler(HTTP_STATUS_OK, "Request sent successfully", {})
            );
    }
);

const acceptConnectionRequest = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { userId, status } = req.params;
        const user = req.user;
        const request = await prisma.connectionRequest.findFirst({
            where: {
                senderId: userId,
                receiverId: user?.userId,
            },
        });
        if (!request) {
            return next(
                new ErrorHandler("Request not found", HTTP_STATUS_BAD_REQUEST)
            );
        }
        if (status === "rejected") {
            await prisma.connectionRequest.delete({
                where: {
                    requestId: request.requestId,
                },
            });
            return res
                .status(HTTP_STATUS_OK)
                .json(
                    new ResponseHandler(
                        HTTP_STATUS_OK,
                        "Request rejected successfully",
                        {}
                    )
                );
        }
        await prisma.connectionRequest.delete({
            where: {
                requestId: request.requestId,
            },
        });
        await prisma.connection.create({
            data: {
                followingId: user?.userId as string,
                followerId: userId,
            },
        });

        const chat = await prisma.chat.create({
            data: {
                chatType: "PRIVATE",
            },
        });
        await prisma.userChat.createMany({
            data: [
                { userId: user?.userId as string, chatId: chat.chatId },
                { userId: userId, chatId: chat.chatId }
            ],
        });

        socketService.emitEvents("connectionAccepted", [userId], {
            receiverId: user?.userId,
        });
        res
            .status(HTTP_STATUS_OK)
            .json(
                new ResponseHandler(HTTP_STATUS_OK, "Request accepted successfully", {})
            );
});

const getMyConnections = AsyncHandler(async(req: CustomRequest, res: Response, next: NextFunction) => {
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
    res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Connections", { following, followers }));
});

const getSuggestions = AsyncHandler(async(req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    const alreadyFollowingIds = await prisma.connection.findMany({
        where: { followerId: user?.userId },
        select: { followingId: true },
    }).then((connections) => connections.map((c) => c.followingId));

    const alreadyRequestedIds = await prisma.connectionRequest.findMany({
        where: { senderId: user?.userId },
        select: { receiverId: true },
    }).then((requests) => requests.map((r) => r.receiverId));

    const suggestions = await prisma.user.findMany({
        where: {
            userId: {
                notIn: [...alreadyFollowingIds, ...alreadyRequestedIds, user?.userId!],
            },
        },
        take: 4,
    });

    res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Suggestions", suggestions));
});


const getConnectionRequests = AsyncHandler(async(req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const requests = await prisma.connectionRequest.findMany({
        where: { receiverId: user?.userId },
        include: { sender: true }
    });
    res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Requests", requests));
});

const uploadAvatar = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const filePath = req.file?.path;
        const contentType = req.file?.mimetype;
        const fileName = req.file?.filename;
        const user = req.user;
        if (!filePath || !contentType || !fileName) {
            return next(
                new ErrorHandler("File not uploaded", HTTP_STATUS_BAD_REQUEST)
            );
        }
        const avatarUrl = await uploadToS3(filePath, fileName, contentType);
        await prisma.user.update({
            where: { userId: user?.userId },
            data: { avatarUrl },
        });
        res.json(
            new ResponseHandler(
                HTTP_STATUS_OK,
                "File uploaded successfully",
                avatarUrl
            )
        );
    }
);

const updateBio = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { bio } = req.body;
    const user = req.user;
    await prisma.user.update({
        where: { userId: user?.userId },
        data: { bio },
    });
    res.json(new ResponseHandler(HTTP_STATUS_OK, "Bio updated successfully", {}));
});

export { getMe, searchUsers, sendConnectionRequest, acceptConnectionRequest, getMyConnections, getSuggestions, getConnectionRequests, uploadAvatar, updateBio };
