"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChats, IMessage } from "@/types/types";

const chats: IChats = {};

const initialState = {
    chats: chats,
};

const ChatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setChats: (state, action: PayloadAction<{userId: string; messages: IMessage[]}>) => {
            const { userId, messages } = action.payload;
            state.chats[userId] = [...(state.chats[userId] || []), ...messages];
        },
    },
});

export const { setChats } = ChatSlice.actions;
export { ChatSlice };
