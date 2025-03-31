import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { useGroupsStore } from "./useGroupsStore";
import { onLoadFiles, onDeleteFile, onAddFile } from "../store";


export const useRepoStore = () => {

    const { activeGroup } = useGroupsStore();

    const dispatch = useDispatch();

    const {
        isLoadingFiles,
        files,
        isUploadingFile,
        selectedFile
    } = useSelector( state => state.repo );

    const uploadFile = async( file ) => {
        const formData = new FormData();
        formData.append('file', file.name);

        try {
            // const { data } = await calendarApi.post(`/files/upload`, formData, {
            //     params: { file.userId, file.groupId },
            //     headers: { 'Content-Type': 'multipart/form-data' }
            //  });

            //Condicion para evitar agregar otro elemento a la lista (sobrescribir el archivo)
            dispatch( onAddFile( file ) );
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const deleteFile = async( idFile ) => {
        try {
            //await calendarApi.delete(`/files/${ idFile }/delete`);
                     
            dispatch( onDeleteFile({ id: idFile }));

        } catch (error) {
            console.log(error);     
        }
    }

    const loadFiles = async() => {
        
        try {
            //const { data } = await calendarApi.get(`/files`, null, { params: { group: activeGroup.id } });
            
            //dispatch( onLoadFiles( data ) );

        } catch (error) {
            console.log(error);
        }
    }

    const downloadFile = async( idFile ) => {
        try {
            const { data, headers } = await calendarApi.get(`/files/${ idFile }/download`, { responseType: 'blob' });

            const fileName = headers['content-disposition']?.split('filename=')[1]  || 'descarga';

            const url = window.URL.createObjectURL( new Blob([  data /*data.name*/ ]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName );
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

        uploadFile,
        deleteFile,
        loadFiles,
        downloadFile


    }
}
