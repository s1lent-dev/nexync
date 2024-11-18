import { Request, Response, NextFunction } from "express";
import { AsyncHandler, ErrorHandler, ResponseHandler } from "../utils/handlers.util.js";
import { CustomRequest } from "../types/types";
import { prisma } from "../lib/db/prisma.db.js";
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_FORBIDDEN, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../config/config.js";
import { pubsub, cache,socketService } from "../app.js";
import { MessageType } from "@prisma/client";


const CreateGroupChat = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { name, memberIds, tagline } = req.body;
    const user = req.user;

    if (!name || !memberIds || !Array.isArray(memberIds)) {
        return res.status(400).json(new ResponseHandler(400, "Invalid input data.", {}));
    }

    const chat = await prisma.chat.create({
        data: {
            chatType: 'GROUP',
            name,
            tagline: tagline || '', 
        },
    });

    const userChatData = [
        ...memberIds.map((memberId: string) => ({
            chatId: chat.chatId,
            userId: memberId,
        })),
        {
            chatId: chat.chatId,
            userId: user?.userId!,
            isAdmin: true,
        },
    ];

    await prisma.userChat.createMany({
        data: userChatData,
        skipDuplicates: true, 
    });

    const cacheKeysToDelete = [
        `get-group-chats-${user?.userId}`,
        ...memberIds.map((id) => `get-group-chats-${id}`),
    ];

    await Promise.all(cacheKeysToDelete.map((key) => cache.delCache(key)));

    return res
        .status(HTTP_STATUS_CREATED)
        .json(new ResponseHandler(HTTP_STATUS_CREATED, "Group chat created successfully.", { chatId: chat.chatId }));
});


const RenameGroupChat = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId, name } = req.body;
    const user = req.user;
    const chat = await prisma.chat.findFirst({
        where: { chatId, chatType: 'GROUP' }
    });

    if (!chat) {
        return next(new ErrorHandler("Chat not found.", HTTP_STATUS_NOT_FOUND));
    }

    const admin = await prisma.userChat.findFirst({
        where: { chatId, userId: user?.userId }
    })

    if (!admin?.isAdmin) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "You are not an admin of this group chat.", {}));
    }

    await prisma.chat.update({
        where: { chatId },
        data: { name }
    });

    await cache.delCache(`get-group-chats-${user?.userId}`);

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Group chat renamed.", {}));
});


const ChangeGroupChatTagline = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId, tagline } = req.body;
    const user = req.user;
    const chat = await prisma.chat.findFirst({
        where: { chatId, chatType: 'GROUP' }
    });

    if (!chat) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Chat not found.", {}));
    }

    const admin = await prisma.userChat.findFirst({
        where: { chatId, userId: user?.userId }
    })

    if (!admin?.isAdmin) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "You are not an admin of this group chat.", {}));
    }

    await prisma.chat.update({
        where: { chatId },
        data: { tagline }
    });

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Group chat tagline changed.", {}));
});


const AddNewMembersToGroupChat = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId, newMemberIds, memberIds } = req.body;
    const user = req.user;

    if (!chatId || !newMemberIds || !Array.isArray(newMemberIds)) {
        return res.status(400).json(new ResponseHandler(400, "Invalid input data.", {}));
    }

    const chat = await prisma.chat.findUnique({
        where: { chatId },
    });

    if (!chat || chat.chatType !== 'GROUP') {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Group chat not found.", {}));
    }

    const adminRecord = await prisma.userChat.findFirst({
        where: { chatId, userId: user?.userId, isAdmin: true },
    });

    if (!adminRecord) {
        return res.status(403).json(new ResponseHandler(403, "You are not authorized to add members to this group chat.", {}));
    }

    await prisma.userChat.createMany({
        data: newMemberIds.map((memberId: string) => ({
            chatId,
            userId: memberId,
        })),
        skipDuplicates: true, 
    });

    const newAddedMembers = await prisma.user.findMany({
        where: {
            userId: { in: newMemberIds },
        },
        select: { username: true, userId: true }, 
    });

    const messages = newAddedMembers.map((member) => ({
        chatId,
        senderId: user?.userId!,
        content: `${member.username} joined the group chat.`,
        messageType: 'GROUP' as MessageType,
    }));

    await prisma.message.createMany({ data: messages });

    const cacheKeysToDelete = [
        `get-group-chats-${user?.userId}`,
        ...memberIds.map((id: string) => `get-group-chats-${id}`),
        ...newMemberIds.map((id: string) => `get-group-chats-${id}`),
    ];

    await Promise.all(cacheKeysToDelete.map((key) => cache.delCache(key)));

    const emitMessages = newAddedMembers.map((member) => ({
        content: `${member.username} joined the group chat.`,
        messageType: 'GROUP',
    }));

    pubsub.publish("group-joined", JSON.stringify({ chatId, memberIds, messages: emitMessages }));
    pubsub.publish("refetch-chats", JSON.stringify({ chatId, memberIds: [...memberIds, ...newMemberIds], adminId: user?.userId }));

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Users added to group chat.", {}));
});


const AddNewMemberToGroupChat = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId, userId } = req.body;
    const user = req.user;
    const chat = await prisma.chat.findFirst({
        where: { chatId, chatType: 'GROUP' }
    });

    if (!chat) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Chat not found.", {}));
    }

    const admin = await prisma.userChat.findFirst({
        where: { chatId, userId: user?.userId }
    })

    if (!admin?.isAdmin) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "You are not an admin of this group chat.", {}));
    }

    const userChat = await prisma.userChat.create({
        data: {
            chatId,
            userId,
        }
    });

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "User added to group chat.", {}));
});


const RemoveMemberFromGroupChat = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId, memberId } = req.body;
    const user = req.user;

    if (!chatId || !memberId) {
        return res.status(400).json(new ResponseHandler(400, "Invalid input data.", {}));
    }

    const chat = await prisma.chat.findUnique({
        where: { chatId },
        include: {
            users: {
                select: { userId: true },
            },
        },
    });

    if (!chat || chat.chatType !== 'GROUP') {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Group chat not found.", {}));
    }

    const adminRecord = await prisma.userChat.findFirst({
        where: { chatId, userId: user?.userId, isAdmin: true },
    });

    if (!adminRecord) {
        return res.status(HTTP_STATUS_FORBIDDEN).json(new ResponseHandler(HTTP_STATUS_FORBIDDEN, "You are not authorized to remove members from this group chat.", {}));
    }

    const memberExists = chat.users.some((u) => u.userId === memberId);

    if (!memberExists) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Member not found in this group chat.", {}));
    }

    await prisma.userChat.delete({
        where: {
            userId_chatId: {
                chatId,
                userId: memberId,
            },
        },
    });

    const removedMember = await prisma.user.findUnique({
        where: { userId: memberId },
        select: { username: true },
    });

    const message = `${removedMember?.username || 'A user'} was removed from the group chat.`;

    await prisma.message.create({
        data: {
            chatId,
            senderId: user?.userId as string,
            content: message,
            messageType: 'GROUP',
        },
    });

    const memberIds = chat.users.map((u) => u.userId);
    const cacheKeysToDelete = [
        `get-group-chats-${user?.userId}`,
        ...memberIds.map((id) => `get-group-chats-${id}`),
        `get-group-chats-${memberId}`,
    ];

    await Promise.all(cacheKeysToDelete.map((key) => cache.delCache(key)));

    const emitMessage = {
        content: message,
        messageType: 'GROUP',
    };

    pubsub.publish("group-removed", JSON.stringify({ chatId, memberIds, message: emitMessage }));
    pubsub.publish("refetch-chats", JSON.stringify({ chatId, memberIds, adminId: user?.userId }));

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "User removed from group chat.", {}));
});


const MakeMemberAdmin = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId, memberId } = req.body;
    const user = req.user;

    if (!chatId || !memberId) {
        return res.status(400).json(new ResponseHandler(400, "Invalid input data.", {}));
    }

    const chat = await prisma.chat.findUnique({
        where: { chatId },
        include: {
            users: {
                select: { userId: true },
            },
        },
    });

    if (!chat || chat.chatType !== 'GROUP') {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Group chat not found.", {}));
    }

    const adminRecord = await prisma.userChat.findFirst({
        where: { chatId, userId: user?.userId, isAdmin: true },
    });

    if (!adminRecord) {
        return res.status(HTTP_STATUS_FORBIDDEN).json(new ResponseHandler(HTTP_STATUS_FORBIDDEN, "You are not authorized to make members admin in this group chat.", {}));
    }

    const memberExists = chat.users.some((u) => u.userId === memberId);

    if (!memberExists) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Member not found in this group chat.", {}));
    }

    await prisma.userChat.update({
        where: {
            userId_chatId: {
                chatId,
                userId: memberId,
            },
        },
        data: {
            isAdmin: true,
        },
    });

    const member = await prisma.user.findUnique({
        where: { userId: memberId },
        select: { username: true },
    });

    const message = `${member?.username || 'A user'} was made an admin in the group chat.`;

    await prisma.message.create({
        data: {
            chatId,
            senderId: user?.userId as string,
            content: message,
            messageType: 'GROUP',
        },
    });

    const memberIds = chat.users.map((u) => u.userId);
    const cacheKeysToDelete = [
        `get-group-chats-${user?.userId}`,
        ...memberIds.map((id) => `get-group-chats-${id}`),
        `get-group-chats-${memberId}`,
    ];

    await Promise.all(cacheKeysToDelete.map((key) => cache.delCache(key)));

    const emitMessage = {
        content: message,
        messageType: 'GROUP',
    };

    pubsub.publish("make-admin", JSON.stringify({ chatId, memberIds, message: emitMessage }));
    pubsub.publish("refetch-chats", JSON.stringify({ chatId, memberIds, adminId: user?.userId }));

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "User made admin in group chat.", {}));
});


const DismissAdmin = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId, memberId } = req.body;
    const user = req.user;

    if (!chatId || !memberId) {
        return res.status(400).json(new ResponseHandler(400, "Invalid input data.", {}));
    }

    const chat = await prisma.chat.findUnique({
        where: { chatId },
        include: {
            users: {
                select: { userId: true },
            },
        },
    });

    if (!chat || chat.chatType !== 'GROUP') {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Group chat not found.", {}));
    }

    const adminRecord = await prisma.userChat.findFirst({
        where: { chatId, userId: user?.userId, isAdmin: true },
    });

    if (!adminRecord) {
        return res.status(HTTP_STATUS_FORBIDDEN).json(new ResponseHandler(HTTP_STATUS_FORBIDDEN, "You are not authorized to dismiss admins in this group chat.", {}));
    }

    const memberExists = chat.users.some((u) => u.userId === memberId);

    if (!memberExists) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Member not found in this group chat.", {}));
    }

    await prisma.userChat.update({
        where: {
            userId_chatId: {
                chatId,
                userId: memberId,
            },
        },
        data: {
            isAdmin: false,
        },
    });

    const member = await prisma.user.findUnique({
        where: { userId: memberId },
        select: { username: true },
    });

    const message = `${member?.username || 'A user'} was dismissed as an admin in the group chat.`;

    await prisma.message.create({
        data: {
            chatId,
            senderId: user?.userId as string,
            content: message,
            messageType: 'GROUP',
        },
    });

    const memberIds = chat.users.map((u) => u.userId);
    const cacheKeysToDelete = [
        `get-group-chats-${user?.userId}`,
        ...memberIds.map((id) => `get-group-chats-${id}`),
        `get-group-chats-${memberId}`,
    ];

    await Promise.all(cacheKeysToDelete.map((key) => cache.delCache(key)));

    const emitMessage = {
        content: message,
        messageType: 'GROUP',
    };

    pubsub.publish("dismiss-admin", JSON.stringify({ chatId, memberIds, message: emitMessage }));
    pubsub.publish("refetch-chats", JSON.stringify({ chatId, memberIds, adminId: user?.userId }));

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "User dismissed as admin in group chat.", {}));
});


const LeaveGroupChat = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId } = req.body;
    const user = req.user;

    if (!chatId) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json(new ResponseHandler(HTTP_STATUS_BAD_REQUEST, "Invalid input data.", {}));
    }

    const chat = await prisma.chat.findUnique({
        where: { chatId },
        include: {
            users: {
                select: { userId: true },
            },
        },
    });

    if (!chat || chat.chatType !== 'GROUP') {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Group chat not found.", {}));
    }

    const isMember = chat.users.some((u) => u.userId === user?.userId);

    if (!isMember) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "You are not a member of this group chat.", {}));
    }

    await prisma.userChat.delete({
        where: {
            userId_chatId: {
                chatId,
                userId: user?.userId as string,
            },
        },
    });

    const message = `${user?.username || 'A user'} left the group chat.`;

    await prisma.message.create({
        data: {
            chatId,
            senderId: user?.userId as string,
            content: message,
            messageType: 'GROUP',
        },
    });

    const memberIds = chat.users.map((u) => u.userId);
    const cacheKeysToDelete = [
        `get-group-chats-${user?.userId}`,
        ...memberIds.map((id) => `get-group-chats-${id}`),
    ];

    await Promise.all(cacheKeysToDelete.map((key) => cache.delCache(key)));

    const emitMessage = {
        content: message,
        messageType: 'GROUP',
    };

    pubsub.publish("group-left", JSON.stringify({ chatId, memberIds, message: emitMessage }));
    pubsub.publish("refetch-chats", JSON.stringify({ chatId, memberIds, adminId: ''}));

    return res
        .status(HTTP_STATUS_OK)
        .json(new ResponseHandler(HTTP_STATUS_OK, "You have successfully left the group chat.", {}));
});


const GetConnectionChats = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.userId) return next(new ErrorHandler("User not found.", HTTP_STATUS_NOT_FOUND));

    const cacheKey = `get-connection-chats:${user.userId}`;
    let connections = [];

    if (await cache.hasCache(cacheKey)) {
        const cacheData = await cache.getCache(cacheKey);
        connections = cacheData.connections;
    } else {
        const chats = await prisma.chat.findMany({
            where: {
                users: { some: { userId: user?.userId } },
                chatType: 'PRIVATE'
            },
            include: {
                users: {
                    include: {
                        user: true
                    }
                },
                messages: true
            }
        });
        connections = chats.flatMap((chat) =>
            chat.users
                .filter((u) => u.userId !== user?.userId)
                .map((otherUser) => ({
                    chatId: chat.chatId,
                    userId: otherUser.userId,
                    username: otherUser.user.username,
                    email: otherUser.user.email,
                    avatarUrl: otherUser.user.avatarUrl,
                    bio: otherUser.user.bio,
                }))
        );

        await cache.setCache(cacheKey, { connections });
    }

    connections = connections.map((connection: any) => ({
        ...connection,
        status: socketService.isUserOnline(connection.userId) ? 'online' : 'offline'
    }));

    const unreadMessages = await prisma.message.groupBy({
        by: ['chatId'],
        where: {
            chatId: { in: connections.map((c: any) => c.chatId) },
            senderId: { not: user.userId },
            status: { in: ['SENT', 'PENDING'] }
        },
        _count: {
            _all: true
        }
    });

    const unread = unreadMessages.map((message) => ({
        chatId: message.chatId,
        count: message._count._all
    }));

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Chats found.", { connections, unread }));
});



const GetGroupChats = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.userId) return next(new ErrorHandler("User not found.", HTTP_STATUS_NOT_FOUND));

    const cacheKey = `get-group-chats-${user.userId}`;
    let groups = [];

    if (await cache.hasCache(cacheKey)) {
        const cacheData = await cache.getCache(cacheKey);
        groups = cacheData.groups;
    } else {
        const chats = await prisma.chat.findMany({
            where: {
                users: { some: { userId: user?.userId } },
                chatType: 'GROUP'
            },
            include: {
                users: {
                    include: {
                        user: true
                    }
                }
            }
        });
        groups = chats.map((group) => ({
            chatId: group.chatId,
            name: group.name,
            avatarUrl: group.avatarUrl,
            tagline: group.tagline,
            members: group.users.map((u) => ({
                userId: u.userId,
                username: u.user.username,
                email: u.user.email,
                avatarUrl: u.user.avatarUrl,
                bio: u.user.bio,
                isAdmin: u.isAdmin
            }))
        }));

        await cache.setCache(cacheKey, { groups });
    }

    const unreadMessages = await prisma.message.groupBy({
        by: ['chatId'],
        where: {
            chatId: { in: groups.map((g: any) => g.chatId) },
            senderId: { not: user.userId },
            NOT: {
                reads: { some: { userId: user.userId } },
            }
        },
        _count: {
            _all: true
        }
    });

    const unread = unreadMessages.map((message) => ({
        chatId: message.chatId,
        count: message._count._all
    }));

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Groups found.", { groups, unread }));
});

const GetMessages = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId } = req.params;
    const chat = await prisma.chat.findFirst({
        where: { chatId },
        include: {
            messages: {
                include: {
                    sender: true
                }
            }
        }
    })

    if (!chat) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Chat not found.", {}));
    }

    const response = {
        messages: chat.messages.map((message) => ({
            messageId: message.messageId,
            username: message.sender.username,
            messageType: message.messageType,
            chatType: chat.chatType,
            senderId: message.senderId,
            chatId: message.chatId,
            content: message.content,
            status: message.status,
            createdAt: message.createdAt,
        }))
    }

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Chat found.", response));
});


const GetInfiniteScrollMessages = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId, lastMessageId } = req.params;
    const user = req.user;

    if (!chatId) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json(new ResponseHandler(HTTP_STATUS_BAD_REQUEST, "Chat ID is required.", {}));
    }

    let chat;
    
    if (lastMessageId !== 'undefined') {

        const lastMessage = await prisma.message.findUnique({
            where: { messageId: lastMessageId },
            select: { createdAt: true }
        });

        if (!lastMessage) {
            return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Last message not found.", {}));
        }

        chat = await prisma.chat.findFirst({
            where: { chatId },
            include: {
                messages: {
                    where: {
                        createdAt: { lt: lastMessage.createdAt }, 
                    },
                    orderBy: { createdAt: 'desc' },  
                    take: 20,
                    include: { sender: true }
                }
            }
        });
    } else {
        console.log('this runs when lastMessageId is undefined');
        chat = await prisma.chat.findFirst({
            where: { chatId },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    include: { sender: true }
                }
            }
        });
    }

    if (!chat) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Chat not found.", {}));
    }

    let messages = chat.messages.map((message) => ({
        messageId: message.messageId,
        username: message.sender.username,
        messageType: message.messageType,
        chatType: chat.chatType,
        senderId: message.senderId,
        chatId: message.chatId,
        content: message.content,
        status: message.status,
        createdAt: message.createdAt,
    }));

    messages = messages.reverse();

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Messages found.", { messages }));
});

export { CreateGroupChat, RenameGroupChat, ChangeGroupChatTagline, AddNewMembersToGroupChat, AddNewMemberToGroupChat, RemoveMemberFromGroupChat, MakeMemberAdmin, DismissAdmin, LeaveGroupChat, GetMessages, GetInfiniteScrollMessages, GetConnectionChats, GetGroupChats };

