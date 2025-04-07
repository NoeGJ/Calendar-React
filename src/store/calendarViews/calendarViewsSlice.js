import { createSlice } from '@reduxjs/toolkit';

export const calendarViewsSlice = createSlice({
    name: 'calendarViews',
    initialState: {
        isOpenPanel: false,
        isOpenList: false,
        },
    reducers: {
    onOpenPanel: (state, /* action */ ) => {
        state.isOpenPanel = true;
    },
    onClosePanel: (state, /* action */ ) => {
        state.isOpenPanel = false;
        },
    onOpenList: (state, /* action */ ) => {
        state.isOpenList = true;
    },
    onCloseList: (state, /* action */ ) => {
        state.isOpenList = false;
        
        },
    }

});
// Action creators are generated for each case reducer function
export const { 
    onOpenPanel,
    onClosePanel,
    onOpenList,
    onCloseList 
} = calendarViewsSlice.actions;