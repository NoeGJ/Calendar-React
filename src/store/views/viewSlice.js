import { createSlice } from '@reduxjs/toolkit';

export const viewSlice = createSlice({
    name: 'view',
    initialState: {
        type: 'unselected',
        currentView: 0
        },
    reducers: {
        onChangeView: (state, { payload } ) => {
            state.type = payload.type;
            state.currentView = payload.view;
        },
    }

});
// Action creators are generated for each case reducer function
export const { onChangeView } = viewSlice.actions;