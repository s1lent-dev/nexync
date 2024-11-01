"use client"

import { configureStore } from "@reduxjs/toolkit"
import { NavigationSlice } from "./reducers/navigation";

const store = configureStore({
    reducer: {
        [NavigationSlice.name]: NavigationSlice.reducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export { store };