import { useEffect, useRef } from "react";
import { useRepoStore } from "../../hooks/useRepoStore";
import { checkRole, formatBytes, getRolesList, roleMessage } from "../../helpers";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { useAuthStore, useGroupsStore } from "../../hooks";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";


const LIMITE = 15000000;

export const ListRepoView = () => {

const imageRef = useRef();

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
  
  transferData( file )

}

const transferData = async( file ) => {

  const res = checkRole(currentRoles, getRolesList().Subida) 
  
  if(!res) {
    roleMessage();
    return;
  }
  
  if (!file) return; 

  if (file.size >= LIMITE) {
    roleMessage("Limite Excedido", "El limite para subir archivos es de 15 MB");
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
  
  const res =  checkRole( currentRoles, getRolesList().Descarga );
  
  if(!res){
    roleMessage();
    return;
  }

  downloadFile( file );
  
}

const handleDelete = ( file ) => {
  const res =  checkRole(currentRoles, getRolesList().Administrador);
  
  if(!res){
    roleMessage();
    return;
  }

  Swal.fire({
    text: "¿Seguro que quieres eliminar el archivo?",
    showCancelButton: true,
    confirmButtonText: "Confirmar",
  }).then(({ isConfirmed }) => {
    if (!isConfirmed) return;
      deleteFile( file.id );
  })
}

const handleDrop = ( event ) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0]
 
  transferData( file )
}

const handleDragOver = ( event ) => {
  event.preventDefault();
}


return (
  <> 
  <Container className="d-flex justify-content-center align-items-center" fluid>
    <div className="table-responsive d-none d-md-block" style={{ width: '100%'}}>
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
            <button title="Eliminar" className="btn" onClick={ () => handleDelete( file ) }>
              <i className="fa fa-close" />
            </button>
          </td>
        </tr>

      ))}
      </tbody>
    </table>
    </div>

      <div className="d-block d-md-none " style={{ width: '100%' }}>
        <ul className="list-unstyled" style={{ overflowY: 'auto' }}>
          <li className="d-flex list-group-item-action justify-content-center align-items-center my-1">
          <button className="btn" onClick={ handleNewFile }>
              <i className="fa fa-plus mr-2" />              
            </button>
          </li>
          {files.map( (file, index) => (
            <li key={index} className="d-flex justify-content-between align-items-center list-group-item-action">
              <div>
                <strong className="text-dark">{ file?.name.length >= 25 ? file?.name.slice(0, 22) + '...' : file.name  }</strong>
                <small className="d-block text-muted">{ format (new Date(file.uploadedAt), "dd MMMM yyyy, HH:mm:ss",{ locale: es }) }</small>
              </div>
                <div className="d-flex align-items-center">
                  <button className="btn text-primary mr-2" onClick={ () => handleDownload( file ) }>
                    <i className="fa fa-download"></i>
                  </button>
                  <button className="btn text-danger" onClick={ () => handleDelete( file ) }>
                    <i className="fa fa-close"></i>
                  </button>
                </div>
            </li>
          ))}
        </ul>
      </div>      
    </Container>
  </>
)
}
