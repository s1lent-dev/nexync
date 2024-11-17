import { Request, Response, NextFunction } from "express";
import {
    AsyncHandler,
    ErrorHandler,
    ResponseHandler,
} from "../utils/handlers.util.js";
import { uploadToS3 } from "../services/aws.service.js";
import { CustomRequest } from "../types/types.js";
import { prisma } from "../lib/db/prisma.db.js";
import {
    HTTP_STATUS_BAD_REQUEST,
    HTTP_STATUS_NOT_FOUND,
    HTTP_STATUS_OK,
} from "../config/config.js";
import { cache } from "../app.js";
import { canUpdateUsername } from "../utils/helper.util.js";

const getMe = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        res
            .status(HTTP_STATUS_OK)
            .json(new ResponseHandler(HTTP_STATUS_OK, "User details", user));
    }
);

const searchUsers = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { search } = req.query;

        const userId = req.user?.userId;

        const alreadyFollowers = await prisma.connection.findMany({
            where: { followingId: userId },
            include: { follower: true },
        });

        const alreadyFollowing = await prisma.connection.findMany({
            where: { followerId: userId },
            include: { following: true },
        });

        const alreadyRequested = await prisma.connectionRequest.findMany({
            where: { senderId: userId },
            include: { receiver: true },
        });

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
            const follower = alreadyFollowers.find(
                (f) => f.followerId === user.userId
            );
            const following = alreadyFollowing.find(
                (f) => f.followingId === user.userId
            );
            const requested = alreadyRequested.find(
                (r) => r.receiverId === user.userId
            );
            return {
                ...user,
                isFollower: !!follower,
                isFollowing: !!following,
                isRequested: !!requested,
            };
        });
        res
            .status(HTTP_STATUS_OK)
            .json(new ResponseHandler(HTTP_STATUS_OK, "Users", users));
    }
);

const sendConnectionRequest = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
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

        await cache.delCache(`getSuggestions:${user?.userId}`);

        res
            .status(HTTP_STATUS_OK)
            .json(
                new ResponseHandler(HTTP_STATUS_OK, "Request sent successfully", {})
            );
    }
);


const unsendConnectionRequest = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = req.user;
    const request = await prisma.connectionRequest.findFirst({
        where: { senderId: user?.userId, receiverId: userId },
    });
    if (!request) {
        return next(
            new ErrorHandler("Request not found", HTTP_STATUS_BAD_REQUEST)
        );
    }
    await prisma.connectionRequest.delete({
        where: { requestId: request.requestId },
    });

    await cache.delCache(`getSuggestions:${user?.userId}`);

    res
        .status(HTTP_STATUS_OK)
        .json(
            new ResponseHandler(HTTP_STATUS_OK, "Request unsend successfully", {})
        );
});

const acceptConnectionRequest = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { userId, status } = req.params;
        const user = req.user;

        const request = await prisma.connectionRequest.findFirst({
            where: { senderId: userId, receiverId: user?.userId },
        });
        if (!request) {
            return next(
                new ErrorHandler("Request not found", HTTP_STATUS_BAD_REQUEST)
            );
        }

        if (status === "rejected") {
            await prisma.connectionRequest.delete({
                where: { requestId: request.requestId },
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
            where: { requestId: request.requestId },
        });
        await prisma.connection.create({
            data: {
                followingId: user?.userId as string,
                followerId: userId,
            },
        });

        const chatExists = await prisma.chat.findFirst({
            where: {
                users: {
                    every: {
                        userId: { in: [user?.userId as string, userId] },
                    },
                },
                chatType: "PRIVATE",
            },
        });

        if (chatExists) {
            return res
                .status(HTTP_STATUS_OK)
                .json(
                    new ResponseHandler(
                        HTTP_STATUS_OK,
                        "Request accepted successfully",
                        {}
                    )
                );
        }

        const chat = await prisma.chat.create({
            data: {
                chatType: "PRIVATE",
            },
        });
        await prisma.userChat.createMany({
            data: [
                { userId: user?.userId as string, chatId: chat.chatId },
                { userId: userId, chatId: chat.chatId },
            ],
        });

        await cache.delCache(`getMyConnections:${user?.userId}`);
        await cache.delCache(`getAllConnections:${user?.userId}`);
        await cache.delCache(`getSuggestions:${user?.userId}`);
        await cache.delCache(`get-connection-chats-${user?.userId}`);
        await cache.delCache(`getMyConnections:${userId}`);
        await cache.delCache(`getAllConnections:${userId}`);
        await cache.delCache(`getSuggestions:${userId}`);
        await cache.delCache(`get-connection-chats-${userId}`);

        res
            .status(HTTP_STATUS_OK)
            .json(
                new ResponseHandler(HTTP_STATUS_OK, "Request accepted successfully", {})
            );
    }
);

const removeFollowers = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const user = req.user;

        const chatExists = await prisma.chat.findFirst({
            where: {
                users: {
                    every: {
                        userId: { in: [user?.userId as string, userId] },
                    },
                },
                chatType: "PRIVATE",
            },
        });

        if (!chatExists)
            return next(new ErrorHandler("Chat not found", HTTP_STATUS_NOT_FOUND));

        const isFollowing = await prisma.connection.findFirst({
            where: {
                followerId: user?.userId as string,
                followingId: userId,
            },
        });

        if (!isFollowing) {
            await prisma.userChat.deleteMany({
                where: { chatId: chatExists.chatId },
            });
            
            await prisma.chat.delete({
                where: { chatId: chatExists.chatId },
            });
        }

        await prisma.connection.delete({
            where: {
                followerId_followingId: {
                    followerId: userId,
                    followingId: user?.userId as string,
                },
            },
        });

        await cache.delCache(`getMyConnections:${user?.userId}`);
        await cache.delCache(`getAllConnections:${user?.userId}`);
        await cache.delCache(`get-connection-chats:${user?.userId}`);
        await cache.delCache(`getMyConnections:${userId}`);
        await cache.delCache(`getAllConnections:${userId}`);
        await cache.delCache(`get-connection-chats:${userId}`);

        res
            .status(HTTP_STATUS_OK)
            .json(
                new ResponseHandler(HTTP_STATUS_OK, "Follower removed successfully", {})
            );
    }
);

const removeFollowing = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { userId } = req.params;
        const user = req.user;

        const chatExists = await prisma.chat.findFirst({
            where: {
                users: {
                    every: {
                        userId: { in: [user?.userId as string, userId] },
                    },
                },
                chatType: "PRIVATE",
            },
        });

        if (!chatExists)
            return next(new ErrorHandler("Chat not found", HTTP_STATUS_NOT_FOUND));

        const isFollower = await prisma.connection.findFirst({
            where: {
                followerId: userId,
                followingId: user?.userId as string,
            },
        });

        if (!isFollower) {
            await prisma.userChat.deleteMany({
                where: { chatId: chatExists.chatId },
            });

            await prisma.chat.delete({
                where: { chatId: chatExists.chatId },
            });
        }

        await prisma.connection.delete({
            where: {
                followerId_followingId: {
                    followerId: user?.userId as string,
                    followingId: userId,
                },
            },
        });

        await cache.delCache(`getMyConnections:${user?.userId}`);
        await cache.delCache(`getAllConnections:${user?.userId}`);
        await cache.delCache(`get-connection-chats:${user?.userId}`);
        await cache.delCache(`getMyConnections:${userId}`);
        await cache.delCache(`getAllConnections:${userId}`);
        await cache.delCache(`get-connection-chats:${userId}`);

        res
            .status(HTTP_STATUS_OK)
            .json(
                new ResponseHandler(
                    HTTP_STATUS_OK,
                    "Following removed successfully",
                    {}
                )
            );
    }
);

const getMyConnections = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user?.userId) {
            return next(new ErrorHandler("User not found", HTTP_STATUS_NOT_FOUND));
        }

        const cacheKey = `getMyConnections:${user.userId}`;
        let followingData = [];
        let followersData = [];

        if (await cache.hasCache(cacheKey)) {
            const cachedData = await cache.getCache(cacheKey);
            followingData = cachedData.followingData;
            followersData = cachedData.followersData;
        } else {

            const following = await prisma.connection.findMany({
                where: { followerId: user.userId },
                include: { following: true },
            });

            const followers = await prisma.connection.findMany({
                where: { followingId: user.userId },
                include: { follower: true },
            });

            const connectionRequests = await prisma.connectionRequest.findMany({
                where: { senderId: user.userId },
                include: { receiver: true },
            });

            followingData = following.map((f) => {
                const isFollower = followers.some(
                    (follower) => follower.followerId === f.following.userId
                );

                return {
                    userId: f.following.userId,
                    username: f.following.username,
                    email: f.following.email,
                    avatarUrl: f.following.avatarUrl,
                    bio: f.following.bio,
                    isFollower,
                    isFollowing: true,
                    isRequested: false
                };
            });

            followersData = followers.map((f) => {
                const isFollowing = following.some(
                    (followed) => followed.followingId === f.follower.userId
                );

                const isRequested = connectionRequests.some(
                    (req) => req.receiverId === f.follower.userId && req.status === "pending"
                );

                return {
                    userId: f.follower.userId,
                    username: f.follower.username,
                    email: f.follower.email,
                    avatarUrl: f.follower.avatarUrl,
                    bio: f.follower.bio,
                    isFollower: true,
                    isFollowing,
                    isRequested,
                };
            });

            await cache.setCache(cacheKey, { followingData, followersData });
        }

        res.status(200).json(
            new ResponseHandler(200, "Connections fetched successfully", {
                followingData,
                followersData,
            })
        );
    }
);


const getAllConnections = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user?.userId)
            return next(new ErrorHandler("User not found", HTTP_STATUS_NOT_FOUND));

        const cacheKey = `getAllConnections:${user.userId}`;
        let connections = [];

        if (await cache.hasCache(cacheKey)) {
            const cachedData = await cache.getCache(cacheKey);
            connections = cachedData.connections;
        } else {
            const following = await prisma.connection.findMany({
                where: {
                    followerId: user?.userId,
                },
                include: {
                    following: true,
                },
            });
            const followers = await prisma.connection.findMany({
                where: {
                    followingId: user?.userId,
                },
                include: {
                    follower: true,
                },
            });
            const followingData = following.map((f) => f.following);
            const followersData = followers.map((f) => f.follower);
            const connectionsMap = new Map();
            followingData.forEach((connection) =>
                connectionsMap.set(connection.userId, connection)
            );
            followersData.forEach((connection) => {
                if (!connectionsMap.has(connection.userId)) {
                    connectionsMap.set(connection.userId, connection);
                }
            });
            connections = Array.from(connectionsMap.values());
            connections = connections.map((connection) => {
                return {
                    userId: connection.userId,
                    username: connection.username,
                    email: connection.email,
                    avatarUrl: connection.avatarUrl,
                    bio: connection.bio,
                };
            });
        }
        return res
            .status(HTTP_STATUS_OK)
            .json(
                new ResponseHandler(HTTP_STATUS_OK, "Connections found.", connections)
            );
    }
);

const getSuggestions = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user?.userId)
            return next(new ErrorHandler("User not found", HTTP_STATUS_NOT_FOUND));

        const cacheKey = `getSuggestions:${user.userId}`;
        let suggestions = [];

        if (await cache.hasCache(cacheKey)) {
            const cachedData = await cache.getCache(cacheKey);
            suggestions = cachedData.suggestions;
        } else {

            const alreadyFollowerIds = await prisma.connection
                .findMany({
                    where: { followingId: user?.userId },
                    select: { followerId: true },
                })
                .then((connections) => connections.map((c) => c.followerId));

            const alreadyFollowingIds = await prisma.connection
                .findMany({
                    where: { followerId: user?.userId },
                    select: { followingId: true },
                })
                .then((connections) => connections.map((c) => c.followingId));

            const alreadyRequestedIds = await prisma.connectionRequest
                .findMany({
                    where: { senderId: user?.userId },
                    select: { receiverId: true },
                })
                .then((requests) => requests.map((r) => r.receiverId));

            const rawSuggestions = await prisma.user.findMany({
                where: {
                    userId: {
                        notIn: [
                            ...alreadyFollowingIds,
                            ...alreadyRequestedIds,
                            user?.userId!,
                        ],
                    },
                },
            });

            suggestions = rawSuggestions.map((suggestion) => ({
                ...suggestion,
                isFollower: alreadyFollowerIds.includes(suggestion.userId),
            }));

            cache.setCache(cacheKey, { suggestions });
        }

        res
            .status(HTTP_STATUS_OK)
            .json(new ResponseHandler(HTTP_STATUS_OK, "Suggestions", suggestions));
    }
);

const getConnectionRequests = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const user = req.user;
        const requests = await prisma.connectionRequest.findMany({
            where: { receiverId: user?.userId },
            include: { sender: true },
        });
        const requestsSenders = requests.map((request) => request.sender);
        res
            .status(HTTP_STATUS_OK)
            .json(new ResponseHandler(HTTP_STATUS_OK, "Requests", requestsSenders));
    }
);

const updateUsername = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { username } = req.body;
        const user = req.user;

        if (!user) {
            return next(new ErrorHandler("User not found", HTTP_STATUS_NOT_FOUND));
        }

        const result = await canUpdateUsername(user);
        if (!result) {
            return next(
                new ErrorHandler("Unable to update username", HTTP_STATUS_BAD_REQUEST)
            );
        }

        const { canUpdate, remainingDays } = result;

        if (!canUpdate) {
            return next(
                new ErrorHandler(
                    `You can update your username after ${remainingDays} days`,
                    HTTP_STATUS_BAD_REQUEST
                )
            );
        }

        await prisma.user.update({
            where: { userId: user?.userId },
            data: {
                username,
                lastUsernameEdit: new Date(),
            },
        });

        const prefixes = [
            "getMyConnections",
            "getAllConnections",
            "get-connection-chats",
            "get-group-chats",
            "getSuggestions",
        ];

        const deleteCachePromises = prefixes.map((prefix) =>
            cache.delCachePattern(`${prefix}:*`)
        );

        await Promise.all(deleteCachePromises);

        res.json(
            new ResponseHandler(HTTP_STATUS_OK, "Username updated successfully", {})
        );
    }
);

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

const updateBio = AsyncHandler(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { bio } = req.body;
        console.log("Bio:", bio);
        const user = req.user;
        await prisma.user.update({
            where: { userId: user?.userId },
            data: { bio },
        });
        res.json(
            new ResponseHandler(HTTP_STATUS_OK, "Bio updated successfully", {})
        );
    }
);

export {
    getMe,
    searchUsers,
    sendConnectionRequest,
    unsendConnectionRequest,
    acceptConnectionRequest,
    removeFollowers,
    removeFollowing,
    getMyConnections,
    getAllConnections,
    getSuggestions,
    getConnectionRequests,
    updateUsername,
    uploadAvatar,
    updateBio,
};
