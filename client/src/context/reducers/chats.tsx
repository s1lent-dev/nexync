"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChats, IMessage, IConnectionChat, IGroupChat, ITyping, IChatTypings, IUnread } from "@/types/types";

const selectedConnectionChat: IConnectionChat = {
    chatId: "",
    userId: "",
    username: "",
    email: "",
    avatarUrl: "",
    bio: "",
    status: "",
}
const selectedGroupChat: IGroupChat = {
    chatId: "",
    name: "",
    avatarUrl: "",
    tagline: "",
    members: [],
}
const connectionChats: IConnectionChat[] = [];
const groupChats: IGroupChat[] = [];
const chats: IChats = {};
const unread: IUnread = {};
const chatTypings: IChatTypings = {};


const initialState = {
    selectedConnectionChat: selectedConnectionChat,
    selectedGroupChat: selectedGroupChat,
    connectionChats: connectionChats,
    groupChats: groupChats,
    chats: chats,
    unread: unread,
    chatTypings: chatTypings,
};

const ChatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedConnectionChat: (state, action: PayloadAction<IConnectionChat>) => {
            state.selectedConnectionChat = action.payload;
        },
        setSelectedGroupChat: (state, action: PayloadAction<IGroupChat>) => {
            state.selectedGroupChat = action.payload;
        },
        setConnectionChats: (state, action: PayloadAction<IConnectionChat[]>) => {
            state.connectionChats = action.payload;
        },
        setConnectionStatus: (state, action: PayloadAction<{ userId: string; status: string }>) => {
            const { userId, status } = action.payload;
            const connectionChat = state.connectionChats.find(chat => chat.userId === userId);
            if (connectionChat) connectionChat.status = status;
        },
        setGroupChats: (state, action: PayloadAction<IGroupChat[]>) => {
            state.groupChats = action.payload;
        },
        setChats: (state, action: PayloadAction<{ chatId: string; messages: IMessage[] }>) => {
            const { chatId, messages } = action.payload;
            state.chats[chatId] = messages
        },
        setUnread: (state, action: PayloadAction<{ chatId: string; count: number }[]>) => {
            action.payload.forEach(({ chatId, count }) => {
                state.unread[chatId] = count;
            });
        },
        addUnread: (state, action: PayloadAction<{ chatId: string; count: number }>) => {
            const { chatId, count } = action.payload;
            state.unread[chatId] = (state.unread[chatId] || 0) + count;
        },
        addMessage: (state, action: PayloadAction<{ chatId: string; message: IMessage }>) => {
            const { chatId, message } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].push(message);
            } else {
                state.chats[chatId] = [message];
            }
        },
        addMessages: (state, action: PayloadAction<{ chatId: string; messages: IMessage[] }>) => {
            const { chatId, messages } = action.payload;
            state.chats[chatId].push(...messages);
        },
        updateMessageStatus: (state, action: PayloadAction<{ chatId: string; messageIds: string[]; senderId: string; status: string }>) => {
            const { chatId, senderId, messageIds, status } = action.payload;
            const chatMessages = state.chats[chatId];
            if (chatMessages) {
                chatMessages.forEach(message => {
                    if (message.senderId === senderId && messageIds.includes(message.messageId)) {
                        message.status = status;
                    }
                });
            }
        },
        addTyping: (state, action: PayloadAction<{ chatId: string; typing: ITyping }>) => {
            const { chatId, typing } = action.payload;
            state.chatTypings[chatId] = typing;
        },
        removeTyping: (state, action: PayloadAction<string>) => {
            const chatId = action.payload;
            delete state.chatTypings[chatId];
        },
        resetChats: (state) => {
            state.connectionChats = [];
            state.chats = {};
        }
    },
});

export const { setSelectedConnectionChat, setSelectedGroupChat, setConnectionChats, setConnectionStatus, setGroupChats, setChats, resetChats, addTyping, removeTyping, addMessage, addMessages, updateMessageStatus, setUnread, addUnread } = ChatSlice.actions;
export { ChatSlice };
