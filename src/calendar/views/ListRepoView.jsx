import { useEffect, useRef, useState } from "react";
import { useRepoStore } from "../../hooks/useRepoStore";
import { formatBytes } from "../../helpers";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useAuthStore, useGroupsStore } from "../../hooks";
import { MembersModal } from "../components/MembersModal";

export const ListRepoView = () => {

const imageRef = useRef();
// const [selectedFile, setSelectedFile] = useState({
//   name: '',
//   fileType: '',
//   size: 0,
//   uploadedAt: new Date()
// });

const { loadFiles, files, downloadFile, deleteFile, uploadFile, setSelectedFile, selectedFile } = useRepoStore();
const { activeGroup } = useGroupsStore();
const { user } = useAuthStore();

useEffect(() => {
  //LoadFiles();

}, [])

const handleNewFile = () => {
    imageRef.current.click();

    
}

const handleChange = ( event ) => {
  const file = event.target.files[0]; // Asegúrate de tomar el primer archivo
  
  transferData( file )

  //setSelectedFile();
  
}

const transferData = async( file ) => {

  //console.log( file );

  if (!file) return; 

  const fileData = {
    name: file.name,
    fileType: file.type,
    size: file.size,
    uploadedAt: new Date(), 
    groupId: activeGroup.id,
    userId: user.id  
  };
  
  await uploadFile( fileData );
  
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
  const file = event.dataTransfer.files[0]
  //console.log(event.dataTransfer.files);
  transferData( file )
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
