"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "@/types/types";

const user: IUser = {
    userId: "",
    username: "",
    email: "",
    avatarUrl: "",
    bio: "",
    isFollowing: false,
    isRequested: false,
}

const searchedUsers: IUser[] = [];

const initialState = {
    user: user,
    searchedUsers: searchedUsers,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
        state.user = action.payload;
    },
    setSearchedUsers(state, action: PayloadAction<IUser[]>) {
        state.searchedUsers = action.payload;
    },
    resetUser(state) {
        state.user = {
            userId: "",
            username: "",
            email: "",
            avatarUrl: "",
            bio: "",
            isFollowing: false,
            isRequested: false,
        }
    },
    resetSearchedUsers(state) {
        state.searchedUsers = [];
    }
  },
});

export const { setUser, setSearchedUsers, resetUser, resetSearchedUsers } = UserSlice.actions;
export { UserSlice };