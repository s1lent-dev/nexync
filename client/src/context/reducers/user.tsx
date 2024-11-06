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
const selectedUser: IUser = {
    userId: "",
    username: "",
    email: "",
    avatarUrl: "",
    bio: "",
    isFollowing: false,
    isRequested: false,
};
const followers: IUser[] = [];
const following: IUser[] = [];
const searchedUsers: IUser[] = [];
const suggestions: IUser[] = [];
const connectionRequests: IUser[] = [];

const initialState = {
    user: user,
    selectedUser: selectedUser,
    followers: followers,
    following: following,
    searchedUsers: searchedUsers,
    suggestions: suggestions,
    connectionRequests: connectionRequests,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
        state.user = action.payload;
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
    setSelectedUser(state, action: PayloadAction<IUser>) {
        state.selectedUser = action.payload;
    },
    setFollowers(state, action: PayloadAction<IUser[]>) {
        state.followers = action.payload;
    },
    setFollowing(state, action: PayloadAction<IUser[]>) {
        state.following = action.payload;
    },
    setSuggestions(state, action: PayloadAction<IUser[]>) {
        state.suggestions = action.payload;
    },
    setSearchedUsers(state, action: PayloadAction<IUser[]>) {
        state.searchedUsers = action.payload;
    },
    resetSearchedUsers(state) {
        state.searchedUsers = [];
    },
    setConnectionRequests(state, action: PayloadAction<IUser[]>) {
        state.connectionRequests = action.payload;
    }
  },
});

export const { setUser, setSearchedUsers, resetUser, resetSearchedUsers, setSelectedUser, setFollowers, setFollowing, setSuggestions, setConnectionRequests } = UserSlice.actions;
export { UserSlice };