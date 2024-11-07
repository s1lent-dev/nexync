"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConnection } from "@/types/types";

const searchedUsers: IConnection[] = [];
const suggestedUsers: IConnection[] = [];

const initialState = {
    searchedUsers: searchedUsers,
    suggestedUsers: suggestedUsers,
};

const NewConnectionSlice = createSlice({
    name: "new-connection",
    initialState,
    reducers: {
        setSearchedUsers(state, action: PayloadAction<IConnection[]>) {
            state.searchedUsers = action.payload;
        },
        resetSearchedUsers(state) {
            state.searchedUsers = [];
        },
        setSuggestedUsers(state, action: PayloadAction<IConnection[]>) {
            state.suggestedUsers = action.payload;
        },
    },
});

export const { setSearchedUsers, resetSearchedUsers, setSuggestedUsers } = NewConnectionSlice.actions;
export { NewConnectionSlice };
