import { z } from "zod";
// Enum validations for MessageType and MessageStatus
const MessageType = z.enum(['TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'FILE', 'LOCATION', 'CONTACT']);
const MessageStatus = z.enum(['PENDING', 'SENT', 'DELIVERED', 'READ']);
// User schema validation
const UserSchema = z.object({
    userId: z.string().uuid({ message: "Invalid user id" }).optional(),
    googleId: z.string().uuid().optional(),
    githubId: z.string().uuid().optional(),
    username: z.string().min(4).max(20),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "Email must end with @gmail.com" }),
    password: z.string().min(8).max(20),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(200).optional(),
    refreshToken: z.string().uuid().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
});
// Chat schema validation
const ChatSchema = z.object({
    chatId: z.string().uuid(),
    name: z.string().optional(),
    isGroup: z.boolean().default(false),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    lastActive: z.date().nullable().optional()
});
// UserChat schema validation
const UserChatSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    chatId: z.string().uuid(),
    joinedAt: z.date().default(new Date()),
    isAdmin: z.boolean().default(false),
    lastSeenAt: z.date().nullable().optional(),
    notifications: z.boolean().default(true)
});
// Message schema validation
const MessageSchema = z.object({
    messageId: z.string().uuid(),
    content: z.string().optional(),
    senderId: z.string().uuid(),
    chatId: z.string().uuid(),
    createdAt: z.date().optional(),
    messageType: MessageType,
    status: MessageStatus.default('PENDING'),
    mediaUrl: z.string().url().optional()
});
// Exports
export { ChatSchema, UserChatSchema, MessageSchema, UserSchema, MessageType, MessageStatus };
