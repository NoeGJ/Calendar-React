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
        onResetView: ( state ) => {
            state.type = 'unselected';
            state.currentView = 0;
        }
    }

});
// Action creators are generated for each case reducer function
export const { onChangeView, onResetView } = viewSlice.actions;