import { createSlice } from "@reduxjs/toolkit";

export const drawerSlice = createSlice({
  name: "drawer",
  initialState: {
    isOpenDrawer: false,
  },
  reducers: {
    onOpenDrawer: (state) => {
      state.isOpenDrawer = true;
    },
    onCloseDrawer: (state) => {
      state.isOpenDrawer = false;
    },
  },
});

export const { onCloseDrawer, onOpenDrawer } = drawerSlice.actions;