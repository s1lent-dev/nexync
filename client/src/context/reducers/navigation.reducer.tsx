"use client"

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INavigationItem } from "@/types/types";

const initialState: INavigationItem = {
  title: "chats",
};

const NavigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setNavigation: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
  },
});

export const { setNavigation } = NavigationSlice.actions;
export { NavigationSlice };