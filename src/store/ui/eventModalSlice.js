import { createSlice } from '@reduxjs/toolkit';

export const eventModalSlice = createSlice({
    name: 'eventModal',
    initialState: {
        isEventModalOpen: false
    },
    reducers: {
        onOpenEventModal: ( state ) => {
            state.isEventModalOpen = true;
        },
        onCloseEventModal: ( state ) => {
            state.isEventModalOpen = false;
        },
    },
});

export const {onOpenEventModal, onCloseEventModal } = eventModalSlice.actions