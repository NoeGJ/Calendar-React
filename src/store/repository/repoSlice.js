import { createSlice } from '@reduxjs/toolkit';

const data = [
    {
        id: 1,
        tag: 1,
        name: 'cat2.jpeg',
        fileType: 'image/jpeg',
        size: 525637,
        uploadedAt: "2025-03-28T20:36:22",
        UploaderId: 1,
        groupId: 2
    },
    {
        id: 2,
        tag: 1,
        name: 'cat2.jpeg',
        fileType: 'image/jpeg',
        size: 525637,
        uploadedAt: "2025-03-21T20:36:22",
        UploaderId: 1,
        groupId: 2
    },
    {
        id: 3,
        tag: 1,
        name: 'cat2.jpeg',
        fileType: 'image/jpeg',
        size: 107329,
        uploadedAt: "2025-03-23T20:36:22",
        UploaderId: 2,
        groupId: 2
    },
    {
        id: 4,
        tag: 1,
        name: 'cat2.jpeg',
        fileType: 'image/jpeg',
        size: 525637,
        uploadedAt: "2025-03-24T20:36:22",
        UploaderId: 3,
        groupId: 2
    }

]


export const repoSlice = createSlice({
    name: 'repo',
    initialState: {        
        isLoadingFiles: true,
        files: data,
        isUploadingFile: false,
        selectedFile: null
        },
    reducers: {

        onAddFile: ( state, { payload } ) => {
            state.files.push( payload );
        },
        onDeleteFile: ( state, { payload }) => {            
            state.files = state.files.filter( ( file ) => file.id !== payload.id );
        },
        onLoadFiles: (state, { payload } ) => {
            state.isLoadingFiles = false;
            state.files = payload;
        
        },
    }

});
// Action creators are generated for each case reducer function
export const { onAddFile, onDeleteFile, onLoadFiles } = repoSlice.actions;