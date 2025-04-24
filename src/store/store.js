import { configureStore } from "@reduxjs/toolkit";
import { 
    authSlice, 
    calendarSlice, 
    drawerSlice, 
    groupsSlice, 
    uiSlice, 
    nameGroupSlice, 
    membersModalSlice, 
    viewSlice, 
    repoSlice, 
    calendarViewsSlice, 
    eventModalSlice 
} from "./";



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
        repo: repoSlice.reducer,
        calendarView: calendarViewsSlice.reducer,
        eventModal: eventModalSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})