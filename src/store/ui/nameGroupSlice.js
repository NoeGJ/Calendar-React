import { createSlice } from "@reduxjs/toolkit";

export const nameGroupSlice = createSlice({
  name: "nameGroup",
  initialState: {
    isOpenModalName: false,
  },
  reducers: {
    onOpenisOpenModalName: (state) => {
      state.isOpenModalName = true;
    },
    onCloseisOpenModalName: (state) => {
      state.isOpenModalName = false;
    },
  },
});

export const { onCloseisOpenModalName, onOpenisOpenModalName } = nameGroupSlice.actions;