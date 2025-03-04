import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking',
        user: {},
        message: undefined
        },
    reducers: {
        onChecking: (state, /* action */ ) => {
            state.status = 'checking';
            state.user = {};
            state.message = undefined;
        },
        onLogin: (state,  { payload }  ) => {
            state.status = 'authenticated';
            state.user = payload;
            state.message = undefined;
        },
        onLogout: (state, { payload }) => {
            state.status = 'not-authenticated';
            state.user = {};
            state.message = payload;
            },
        clearErrorMessage: ( state ) => {                
            state.message = undefined;
        }
    }
});
// Action creators are generated for each case reducer function
export const { onChecking, onLogin, onLogout, clearErrorMessage } = authSlice.actions;