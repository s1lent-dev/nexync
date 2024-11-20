"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConnectionChat, IUser } from "@/types/types";

const me: IUser = {
    userId: "",
    username: "",
    email: "",
    avatarUrl: "",
    bio: "",
    isAdmin: null,
}

const selectedUser: IConnectionChat = {
    chatId: "",
    userId: "",
    username: "",
    email: "",
    avatarUrl: "",
    bio: "",
    status: "",
}

const initialState = {
    me: me,
    selectedUser: selectedUser,
};

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setMe(state, action: PayloadAction<IUser>) {
            state.me = action.payload;
        },
        resetMe(state) {
            state.me = {
                userId: "",
                username: "",
                email: "",
                avatarUrl: "",
                bio: "",
                isAdmin: null
            }
        },
        setSelectedUser(state, action: PayloadAction<IConnectionChat>) {
            state.selectedUser = action.payload;
        },
        resetSelectedUser(state) {
            state.selectedUser = {
                chatId: "",
                userId: "",
                username: "",
                email: "",
                avatarUrl: "",
                bio: "",
                status: "",
            }
        }
    },
});

export const { setMe, resetMe, setSelectedUser, resetSelectedUser } = UserSlice.actions;
export { UserSlice };
