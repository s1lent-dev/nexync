"use client"

import { configureStore } from "@reduxjs/toolkit"
import { NavigationSlice } from "./reducers/navigation";
import { UserSlice } from "./reducers/user";

const store = configureStore({
    reducer: {
        [UserSlice.name]: UserSlice.reducer,
        [NavigationSlice.name]: NavigationSlice.reducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export { store };