import { useEffect, useRef, useState } from "react";
import { useRepoStore } from "../../hooks/useRepoStore";
import { checkRole, formatBytes, getRolesList } from "../../helpers";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useAuthStore, useGroupsStore } from "../../hooks";
import { MembersModal } from "../components/MembersModal";
import Swal from "sweetalert2";

const LIMITE = 15000000;


export const ListRepoView = () => {

const imageRef = useRef();
// const [selectedFile, setSelectedFile] = useState({
//   name: '',
//   fileType: '',
//   size: 0,
//   uploadedAt: new Date()
// });

const { files, downloadFile, deleteFile, uploadFile, loadFiles } = useRepoStore();
const { activeGroup, currentRoles } = useGroupsStore();
const { user } = useAuthStore();


useEffect(() => {
  loadFiles();
  
  
}, [])

const handleNewFile = () => {
    imageRef.current.click();

}

const handleChange = ( event ) => {
  const file = event.target.files[0];

  //console.log(file);
  
  transferData( file )

  //setSelectedFile();
  
}

const transferData = async( file ) => {

  const res = checkRole(currentRoles, getRolesList().Subida) 
  
  if(!res) {
    Swal.fire("No tienes permisos", "Contacta con el administrador" ); 
    return;
  }
  
  if (!file) return; 

  if (file.size >= LIMITE) {
    Swal.fire("Limite Excedido", "El limite para subir archivos es de 15 MB");
    return;
  }

  const fileData = {
    file,
    name: file.name,
    fileType: file.type,
    size: file.size,
    uploadedAt: new Date(), 
    groupId: activeGroup.id,
    userId: user.uid  
  };
  
  await uploadFile( fileData );
  
}

const handleDownload = ( file ) => {
  
  //console.log(file);
  downloadFile( file );
  
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
  <div >
    <table className="table table-hover " >
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
        <tr  key={ index } style={{  overflowY: 'auto' }}> 
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
    </div>
    <MembersModal />      
  </>
)
}
