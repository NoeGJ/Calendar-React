import { configureStore } from "@reduxjs/toolkit";
import { authSlice, calendarSlice, drawerSlice, groupsSlice, uiSlice, nameGroupSlice, membersModalSlice, viewSlice, repoSlice } from "./";




export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        calendar: calendarSlice.reducer,
        ui: uiSlice.reducer,
        drawer: drawerSlice.reducer,
        nameGroup: nameGroupSlice.reducer,
        groups: groupsSlice.reducer,
        membersModal: membersModalSlice.reducer,
        view: viewSlice.reducer,
        repo: repoSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})