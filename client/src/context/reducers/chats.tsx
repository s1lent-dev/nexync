"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChats, IMessage, IConnectionChat, IGroupChat, ITyping, IChatTypings } from "@/types/types";

const selectedConnectionChat: IConnectionChat = {
    chatId: "",
    userId: "",
    username: "",
    email: "",
    avatarUrl: "",
    bio: "",
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
const chatTypings: IChatTypings = {};


const initialState = {
    selectedConnectionChat: selectedConnectionChat,
    selectedGroupChat: selectedGroupChat,
    connectionChats: connectionChats,
    groupChats: groupChats,
    chats: chats,
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
        setGroupChats: (state, action: PayloadAction<IGroupChat[]>) => {
            state.groupChats = action.payload;
        },
        setChats: (state, action: PayloadAction<{chatId: string; messages: IMessage[]}>) => {
            const { chatId, messages } = action.payload;
            state.chats[chatId] = messages
        },
        addMessage: (state, action: PayloadAction<{chatId: string; message: IMessage}>) => {
            const { chatId, message } = action.payload;
            state.chats[chatId].push(message);
        },
        addTyping: (state, action: PayloadAction<{chatId: string; typing: ITyping}>) => {
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

export const { setSelectedConnectionChat, setSelectedGroupChat, setConnectionChats, setGroupChats, setChats, resetChats, addTyping, removeTyping, addMessage } = ChatSlice.actions;
export { ChatSlice };
