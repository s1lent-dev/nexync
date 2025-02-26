"use client"

import { configureStore } from "@reduxjs/toolkit"
import { NavigationSlice } from "./reducers/navigation.reducer";
import { UserSlice } from "./reducers/user.reducer";
import { ConnectionSlice } from "./reducers/connections.reducer";
import { NewConnectionSlice } from "./reducers/newConnection.reducer";
import { ChatSlice } from "./reducers/chats.reducer";

const store = configureStore({
    reducer: {
        [UserSlice.name]: UserSlice.reducer,
        [ConnectionSlice.name]: ConnectionSlice.reducer,
        [NewConnectionSlice.name]: NewConnectionSlice.reducer,
        [ChatSlice.name]: ChatSlice.reducer,
        [NavigationSlice.name]: NavigationSlice.reducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export { store };