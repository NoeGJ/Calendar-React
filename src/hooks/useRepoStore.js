import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { useGroupsStore } from "./useGroupsStore";
import { onLoadFiles, onDeleteFile, onAddFile, onSetSelectedFile } from "../store";


export const useRepoStore = () => {

    const { activeGroup } = useGroupsStore();

    const dispatch = useDispatch();

    const {
        isLoadingFiles,
        files,
        isUploadingFile,
        selectedFile
    } = useSelector( state => state.repo );

    const setSelectedFile = ( file ) => {
        
        dispatch( onSetSelectedFile( file ) );
    }

    const uploadFile = async( content ) => {
        const { userId, groupId, file  } = content;
        
        const formData = new FormData();
        formData.append("file", file );
        
        try {
             const { data } = await calendarApi.post(`/files/upload`, formData, {
                 params: { user: userId, group: groupId },
                 headers: { 'Content-Type': 'multipart/form-data' }
              });
              
            dispatch( onAddFile( data ) );
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const deleteFile = async( idFile ) => {
        try {
            await calendarApi.delete(`/files/${ idFile }/delete`);
                     
            dispatch( onDeleteFile({ id: idFile }));

        } catch (error) {
            console.log(error);     
        }
    }

    const loadFiles = async() => {
        
        try {
            
            const { data } = await calendarApi.get(`/files`, { params: { group: activeGroup.id } });
        
            dispatch( onLoadFiles( data ) );

        } catch (error) {
            console.log(error);
        }
    }

    const downloadFile = async( file ) => {
        try {
            const { data, headers } = await calendarApi.get(`/files/${ file.id }/download`, { responseType: 'blob' });

            const type = file.name.split('.');
            
            const fileName = headers['content-disposition']?.split('filename=')[1]  || 'descarga';
            
            const url = window.URL.createObjectURL( new Blob([  data ]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}.${type[type.length -1]}`);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

            
        } catch (error) {
            console.log(error);
            
        }
    }

    return {
        isLoadingFiles,
        files,
        isUploadingFile,
        selectedFile,

        setSelectedFile,
        uploadFile,
        deleteFile,
        loadFiles,
        downloadFile

    }
}
