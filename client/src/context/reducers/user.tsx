"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConnectionChat, IUser } from "@/types/types";

const me: IUser = {
    userId: "",
    googleId: "",
    githubId: "",
    username: "",
    email: "",
    password: "",
    avatarUrl: "",
    bio: "",
}

const selectedUser: IConnectionChat = {
    chatId: "",
    userId: "",
    googleId: "",
    githubId: "",
    username: "",
    email: "",
    password: "",
    avatarUrl: "",
    bio: "",
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
                googleId: "",
                githubId: "",
                username: "",
                email: "",
                password: "",
                avatarUrl: "",
                bio: "",
            }
        },
        setSelectedUser(state, action: PayloadAction<IConnectionChat>) {
            state.selectedUser = action.payload;
        },
        resetSelectedUser(state) {
            state.selectedUser = {
                chatId: "",
                userId: "",
                googleId: "",
                githubId: "",
                username: "",
                email: "",
                password: "",
                avatarUrl: "",
                bio: "",
            }
        }
    },
});

export const { setMe, resetMe, setSelectedUser, resetSelectedUser } = UserSlice.actions;
export { UserSlice };
