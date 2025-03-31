import { createSlice } from "@reduxjs/toolkit";

export const membersModalSlice = createSlice({
  name: "membersModal",
  initialState: {
    isOpenModalMembers: false,
  },
  reducers: {
    onOpenModalMembers: (state) => {
      state.isOpenModalMembers = true;
    },
    onCloseModalMembers: (state) => {
      state.isOpenModalMembers = false;
    },
  },
});

export const { onOpenModalMembers, onCloseModalMembers } = membersModalSlice.actions;