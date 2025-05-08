import PropTypes from 'prop-types';
import { useState } from 'react';

export const FileIdsPanel = ({files, onFileIdsChange, selectedFileIds}) => {

    const selectedFiles = selectedFileIds ? selectedFileIds.map( (fileId) => files.find( (file) => file.id == fileId )) : [];
    const unselectedFiles = files.filter( (file) => !selectedFiles.some( (selectedFile) => file.id === selectedFile.id ));

    const [fileList, setFileList] = useState(selectedFiles);
    const [availableFiles, setAvailableFiles] = useState(unselectedFiles);

    const changeCurrentIds = (fileListAdvance) => {
        const target = {
            value: fileListAdvance.map( (file) => file.id ),
            name: 'fileIds',
        };
        onFileIdsChange({target: target})
    };

    const onFileAdded = ({target}) => {
        if(target.value == null || target.value == 0){
            return;
        }

        const foundFile = files.find( (file) => file.id == target.value );
        const fileListAdvance = [...fileList, foundFile];

        setAvailableFiles(availableFiles.filter( (file) => file.id != foundFile.id ));
        setFileList(fileListAdvance);
        changeCurrentIds(fileListAdvance);
    };

    const onFileRemoved = (fileId) => {
        const foundFile = files.find( (file) => file.id == fileId );
        const fileListAdvance = fileList.filter( (file) => file.id != fileId ,)

        setFileList(fileListAdvance);
        setAvailableFiles([...availableFiles, foundFile]);
        changeCurrentIds(fileListAdvance);
    };
 
    return (
        <div className="form-group mb-2">
            <label>Recursos del Evento</label>
            <select className='form-control' onChange={onFileAdded} value={"null"}
                name="fileIds" id="fileIds">
                <option value="null" key={0}>Seleccione un archivo para agregarlo al listado...</option>
                { availableFiles.map((file) => (
                    <option key={file.id} value={file.id}>{file.name}</option>
                ))}
            </select>
            <div className='panel panel-default p-1 mt-1'>
            { fileList.map( (file) =>  (
                    <div key={file.id} className='list-group-item d-flex justify-content-between align-items-center'>
                        <div>{ file.name }</div>
                        <button className='btn btn-danger btn-sm' onClick={()=>onFileRemoved(file.id)}>
                            <i className="fa fa-close"></i>
                        </button>
                    </div>
                )) }
          </div>
        </div>
    )
};

FileIdsPanel.propTypes = {
    files: PropTypes.array.isRequired,
    onFileIdsChange: PropTypes.func.isRequired,
    selectedFileIds: PropTypes.array,
};