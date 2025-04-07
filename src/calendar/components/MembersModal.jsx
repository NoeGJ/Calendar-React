import { useEffect, useState } from "react";
import Modal from "react-modal";

import {
    Dropdown
  } from 'react-bootstrap'

import { useAuthStore, useGroupsStore, useMembersModal } from "../../hooks";
import { checkRole, getRolesList } from "../../helpers";
import Swal from "sweetalert2";

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-20%",
        transform: "translate(-50%, -50%)",
        width: '500px',
    },
  };

export const MembersModal = () => {

    const { isOpenModalMembers, closeModalMembers } = useMembersModal();
    const { currentPermissions, startAddNewMember, loadUnsubscribed, unsubscribedMembers, currentRoles, subscribedMembers, addRole, deleteRole, kickMember } = useGroupsStore();


    const { grupo, can } = currentPermissions;
    
    const [email, setEmail] = useState('')
    //const [selectedRoles, setSelectedRoles] = useState([])

    const { user } = useAuthStore();

    useEffect(() => {
        
        loadUnsubscribed();

        console.log(currentPermissions);
        
        
        
    }, [])


        

    const handleInputChanged = ({ target }) => {
        setEmail( target.value );
    }


    const onSubmit = async ( event ) => {
        event.preventDefault();
        if (email.length <= 0) return;

        const newUser = unsubscribedMembers.find( ( user ) => 
            email == user.email
        )
        console.log( newUser );
        if (!newUser) return;

        setEmail('');
        
        await startAddNewMember( newUser );

    }

    const handleToggleRole = async ({ target }, memberId, roleId ) => {
        if(!target.checked) {
            console.log("eliminar");
            
            
            await deleteRole( memberId, roleId );
            
        } else{
            console.log("agregar");
            await addRole( memberId, roleId )

        }

    }

    const handleDeleteMember = async( memberId ) => {
        Swal.fire({
            text: "Seguro que quieres expulsar al usuario",
            showCancelButton: true,
            confirmButtonText: "Confirmar"
        }).then( ({ isConfirmed }) => {
            if(!isConfirmed) return;
            
            kickMember( memberId );
        }
    )
    
    }


  return (
    <Modal
    isOpen={ isOpenModalMembers }
    onRequestClose={ closeModalMembers }
    className=""    
    overlayClassName="modal-fondo"
    closeTimeoutMS={200}
    style={ customStyles }
    >
        
        <h5>Compartir { grupo?.name }</h5>
        
        <hr/>
        <form className="container" onSubmit={ onSubmit }>
        <div className="form-group">
            <div className="d-flex">
                <input
                    
                    type="text"
                    className="  custom-select custom-select-sm mr-2"
                    placeholder="Correo electrónico "
                    name="email"
                    autoComplete="off"
                    value={ email }
                    onChange={ handleInputChanged }
                    list="emailOptions"
                />
                <datalist id="emailOptions"  >
                    {unsubscribedMembers.map( ({email}, index) => (
                    <option value={ email } key={index}></option>
                ))}   
                </datalist>
                <button className="btn bg-primary text-white w-25" type='submit' onClick={ onSubmit }>
                    Compartir
                </button>
            </div>
        </div>
        
        <div className="form-group mt-2">
            <ul className="list-unstyled">{ subscribedMembers.map( (member, index) => ( 
                <li className="p-2" key={index}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                        <div className="">{ member.username } { member.uid == user.uid ? '(Tú)': '' }</div>
                            <sub className="position-relative text-muted" style={{ top: -10 }}>{ member.email }</sub>
                        </div>
                    <div className="d-flex">
                    <Dropdown   drop="end" >
                        <Dropdown.Toggle variant="primary"  id="dropdown-basic" style={{ width: '100px' }} disabled={ member.currentRoles.some( role => role.id == 1 ) }>
                            { member.currentRoles.some( role => role.id == 1 ) ? 'Creador' : 'Permisos'  }
                        </Dropdown.Toggle>
                        
                        <Dropdown.Menu className="form-check" as="div">
                            {Object.entries(getRolesList()).map( ([keys, value], index) => (
                            value != 1 && (
                                <Dropdown.Item key={index} >
                                    <input 
                                    className="form-check-input"
                                    type='checkbox' 
                                    checked={ member.currentRoles.some(role => role.id == value) } 
                                    onChange={ (event) => handleToggleRole( event, member.uid, value ) }
                                    /> { keys } 
                                </Dropdown.Item>
                            )))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                    { !member.currentRoles.some( role => role.id == 1 ) &&
                        <button className="btn ml-2" onClick={ () => handleDeleteMember( member.uid ) }>
                            <i className="fa fa-close"></i>
                        </button>
                    }
                    </div>
                    </div>

                </li>
                ))
                }
            </ul>
        </div>
        </form>
    </Modal>
  )
}
