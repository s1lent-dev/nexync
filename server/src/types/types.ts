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

interface MessageEvent {
    senderId: string;
    username: string;
    chatId: string;
    memberIds: string[];
    content: string;
    createdAt: Date | null;
}

interface TypingEvent {
    senderId: string;
    username: string;
    chatId: string;
    memberIds: string[];
}

interface GroupJoinedEvent {
    chatId: string;
    memberIds: string[];
    messages: string[];
}

interface GroupRemoveEvent {
    chatId: string;
    memberIds: string[];
    message: string
}
interface GroupLeftEvent {
    chatId: string;
    memberIds: string[];
    message: string;
}

enum EventType {
    MESSAGE,
    TYPING
}

type Event = MessageEvent | TypingEvent;

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

enum MailType {
    CONFIRMATION,
    RESET_PASSWORD,
    PASSWORD,
    VERIFY_EMAIL
}
interface MailContent {
    email: string;
    contentType: MailType;
    content: string;
}

type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;

interface CustomRequest extends Request {
    user?: User;
}


export { ControllerType, CustomRequest, User, Message, MessageEvent, TypingEvent, GroupJoinedEvent, GroupRemoveEvent, GroupLeftEvent, Event, EventType, Chat, UserChat, MailContent, MailType };