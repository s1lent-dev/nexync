"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IConnection, IConnectionRequests, IUser } from "@/types/types";

const connections: IUser[] = [];
const followers: IConnection[] = [];
const following: IConnection[] = [];
const connectionRequests: IConnectionRequests[] = [];

const initialState = {
    connections: connections,
    followers: followers,
    following: following,
    connectionRequests: connectionRequests,
};

const ConnectionSlice = createSlice({
    name: "connection",
    initialState,
    reducers: {
        setConnections(state, action: PayloadAction<IUser[]>) {
            state.connections = action.payload;
        },
        setFollowers(state, action: PayloadAction<IConnection[]>) {
            state.followers = action.payload;
        },
        setFollowing(state, action: PayloadAction<IConnection[]>) {
            state.following = action.payload;
        },
        setConnectionRequests(state, action: PayloadAction<IConnectionRequests[]>) {
            state.connectionRequests = action.payload;
        },
    },
});

export const { setConnections, setFollowers, setFollowing, setConnectionRequests } = ConnectionSlice.actions;
export { ConnectionSlice };
