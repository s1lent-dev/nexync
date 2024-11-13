import { Request, Response, NextFunction } from "express";
import { AsyncHandler, ErrorHandler, ResponseHandler } from "../utils/handlers.util.js";
import { CustomRequest } from "../types/types";
import { prisma } from "../lib/db/prisma.db.js";
import { HTTP_STATUS_CREATED, HTTP_STATUS_NOT_FOUND, HTTP_STATUS_OK } from "../config/config.js";


const CreateGroupChat = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { name, memberIds, tagline } = req.body;
    const user = req.user;
    const chat = await prisma.chat.create({
        data: {
            chatType: 'GROUP',
            name,
            tagline,
        }
    })
    await prisma.userChat.createMany({
        data: [
            ...memberIds.map((memberId: string) => ({
                chatId: chat.chatId,
                userId: memberId
            })),
            {
                chatId: chat.chatId,
                userId: user?.userId,
                isAdmin: true
            }
        ]        
    })
    return res.status(HTTP_STATUS_CREATED).json(new ResponseHandler(HTTP_STATUS_CREATED, "Group chat created.", {}));
});


const RenameGroupChat = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId, name } = req.body;
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
        data: { name }
    });

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
    const { chatId, memberIds } = req.body;
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

    const userChats = await prisma.userChat.createMany({
        data: memberIds.map((memberId: string) => ({
            chatId,
            userId: memberId
        }))
    });

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

    console.log(chatId, memberId);
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

    await prisma.userChat.delete({
        where: {
            userId_chatId: {
                chatId: chatId,
                userId: memberId
            }
        }
    });

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "User removed from group chat.", {}));
});


const LeaveGroupChat = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const { chatId } = req.body;
    const user = req.user;
    const chat = await prisma.chat.findFirst({
        where: { chatId, chatType: 'GROUP' }
    });

    if (!chat) {
        return res.status(HTTP_STATUS_NOT_FOUND).json(new ResponseHandler(HTTP_STATUS_NOT_FOUND, "Chat not found.", {}));
    }

    await prisma.userChat.delete({
        where: {
            userId_chatId: {
                chatId: chatId,
                userId: user?.userId as string
            }
        }
    });

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "User removed from group chat.", {}));
});


const GetConnectionChats = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;
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
            }
        }
    });

    const connections = chats.flatMap((chat) =>
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

    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Chats found.", connections));
});



const GetGroupChats = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const groups = await prisma.chat.findMany({
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

    const response = groups.map((group) => ({
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
    return res.status(HTTP_STATUS_OK).json(new ResponseHandler(HTTP_STATUS_OK, "Groups found.", response));
});

const GetMessages = AsyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
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

export { CreateGroupChat, RenameGroupChat, ChangeGroupChatTagline,  AddNewMembersToGroupChat, AddNewMemberToGroupChat, RemoveMemberFromGroupChat, LeaveGroupChat, GetMessages, GetConnectionChats, GetGroupChats };

