"use client"

import { configureStore } from "@reduxjs/toolkit"
import { NavigationSlice } from "./reducers/navigation";
import { UserSlice } from "./reducers/user";
import { ConnectionSlice } from "./reducers/connections";
import { NewConnectionSlice } from "./reducers/newConnection";
import { ChatSlice } from "./reducers/chats";

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