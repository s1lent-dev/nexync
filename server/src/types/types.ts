import { Request, Response, NextFunction } from "express";

interface User {
    userId: string;
    googleId?: string | null;
    githubId?: string | null;
    username: string;
    email: string;
    password: string;
    avatarUrl?: string | null;
    bio?: string | null;
    refreshToken?: string | null;
}
enum MessageType {
    TEXT,
    IMAGE,
    VIDEO,
    AUDIO,
    FILE,
    LOCATION,
    CONTACT
}

enum MessageStatus {
    PENDING,
    SENT,
    DELIVERED,
    READ
}

interface Message {
    messageId: string;
    content: string;
    senderId: string;
    chatId: string;
    messageType: MessageType;
    status: MessageStatus;
    mediaUrl: string;
}

interface Chat {
    chatId: string;
    name: string;
    isGroup: boolean;
    lastActive: Date;
}

interface UserChat {
    id: string;
    userId: string;
    chatId: string;
    joinedAt: Date;
    isAdmin: boolean;
    lastSeenAt: Date;
    notifications: boolean;
}

type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;

interface CustomRequest extends Request {
    user?: User;
}


export { ControllerType, CustomRequest, User, Message, Chat, UserChat };