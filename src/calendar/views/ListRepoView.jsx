import { useEffect, useRef, useState } from "react";
import { useRepoStore } from "../../hooks/useRepoStore";
import { formatBytes } from "../../helpers";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useAuthStore, useGroupsStore } from "../../hooks";
import { MembersModal } from "../components/MembersModal";

export const ListRepoView = () => {

const imageRef = useRef();
const [selectedFile, setSelectedFile] = useState();

const { loadFiles, files, downloadFile, deleteFile, uploadFile } = useRepoStore();
const { activeGroup } = useGroupsStore();
const { user } = useAuthStore();

useEffect(() => {
  //LoadFiles();

}, [])

const handleNewFile = () => {
    imageRef.current.click();

    
}

const handleChange = ( { target } ) => {
  const file = Array.from(target.files);
  console.log(target.files);
  
  console.log({ ...file });
  
  setSelectedFile( { ...file[0], groupId: activeGroup.id, userId: user.id  } );
  
  console.log( selectedFile );

  uploadFile( selectedFile );

  setSelectedFile();
  
}

const handleDownload = ( file ) => {
  //console.log(file);
  downloadFile( file.id );
  
}

const handleDelete = ( file ) => {
    deleteFile( file.id );
}

const handleDrop = ( event ) => {
  event.preventDefault();
  //const data = event.dataTransfer.getData();
  console.log(event.dataTransfer.files);
  
}

const handleDragOver = ( event ) => {
  event.preventDefault();
}


return (
  <>      
    <table className="table table-hover">
      <thead>
      <tr>
        <th>Nombre</th>
        <th>Tamaño</th>
        <th>Tipo</th>
        <th>Subido en</th>
        
        <th>
          <button className="btn  text-black w-100" onClick={ handleNewFile } style={{ display: 'none' }}>
            <i className="fa fa-plus mr-2" />
            Nuevo
          </button>
          <input type="file" style={{ display: 'none' }}  onChange={ handleChange } ref={imageRef}/>
        </th>
      </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan="5"  onDrop={ handleDrop } onDragOver={ handleDragOver }>
            <button className="btn  w-100 " onClick={ handleNewFile }>
              <i className="fa fa-plus mr-2" />
              
            </button>
            <input type="file" style={{ display: 'none' }}  onChange={ handleChange } ref={imageRef}/>
          </td>
        </tr>
      {files.map( (file, index) => (
        <tr  key={ index }> 
        <td >{ file.name.split('.')[0] } </td>
        <td  > {  formatBytes(file.size) } </td>
        <td  > {  file.fileType } </td>
        <td> { format (new Date(file.uploadedAt), "dd MMMM yyyy, HH:mm:ss",{ locale: es }) } </td>
        
          <td >
            <button className="btn bg-primary text-white mr-2" onClick={ () => handleDownload( file ) }>
              Descargar
            </button>
            <button className="btn" onClick={ () => handleDelete( file ) }>
              <i className="fa fa-close" />
            </button>
          </td>
        </tr>

      ))}
      </tbody>
    </table>      

    <MembersModal />      
  </>
)
}
