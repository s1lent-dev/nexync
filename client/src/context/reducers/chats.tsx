"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChats, IMessage, IConnectionChat } from "@/types/types";

const chats: IChats = {};
const connectionChats: IConnectionChat[] = [];

const initialState = {
    connectionChats: connectionChats,
    chats: chats,
};

const ChatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setConnectionChats: (state, action: PayloadAction<IConnectionChat[]>) => {
            state.connectionChats = action.payload;
        },
        setChats: (state, action: PayloadAction<{chatId: string; messages: IMessage[]}>) => {
            const { chatId, messages } = action.payload;
            state.chats[chatId] = messages
        },
        addMessage: (state, action: PayloadAction<{chatId: string; message: IMessage}>) => {
            const { chatId, message } = action.payload;
            state.chats[chatId].push(message);
        },
        resetChats: (state) => {
            state.connectionChats = [];
            state.chats = {};
        }
    },
});

export const { setConnectionChats, setChats, resetChats, addMessage } = ChatSlice.actions;
export { ChatSlice };
