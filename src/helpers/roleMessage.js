import Swal from "sweetalert2"


export const roleMessage = ( title= 'No tienes permisos', subtitle= 'Contacta con el administrador' ) => {
  return (
    Swal.fire(
        title,
        subtitle
    )
  )
}
