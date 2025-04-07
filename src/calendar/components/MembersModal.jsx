import { useEffect, useState } from "react";
import Modal from "react-modal";

import {
    Dropdown
  } from 'react-bootstrap'

import { useAuthStore, useGroupsStore, useMembersModal } from "../../hooks";

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
    const { currentPermissions, startAddNewMember, loadUnsubscribed, unsubscribedMembers, activeGroup, subscribedMembers } = useGroupsStore();


    const { grupo, can } = currentPermissions;
    
    const [email, setEmail] = useState('')
    const [unsubscribed, setUnsubscribed] = useState([])

    const { user } = useAuthStore();

    useEffect(() => {
        loadUnsubscribed();
        //console.log(" DSAD",unsubscribedMembers);
        //console.log(currentPermissions);
        console.log(" dsadad");
        
        
    }, [])
    

    const handleInputChanged = ({ target }) => {
        setEmail( target.value );
    }

    const showRolesString = ( permissions ) => {
        
    }

    const onSubmit = async ( event ) => {
        event.preventDefault();
        if (email.length <= 0) return;

        const newUser = unsubscribedMembers.find( ( user ) => 
            email == user.email
        )
        if (!newUser) return;

        setEmail('');
        
        await startAddNewMember( newUser );


        //disabled={  grupo?.creatorId == grupo?.members.uid ? false : true  }
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
                    <div className="">
                    <Dropdown   drop="end" >
                        <Dropdown.Toggle variant="primary"  id="dropdown-basic" style={{ width: '100px' }} disabled>
                            { member.currentRoles.some( role => role.id == 1 ) ? 'Creador' : 'Miembro'  }
                        </Dropdown.Toggle>
                        
                        <Dropdown.Menu>
                            {Object.entries(currentPermissions).map( ([keys, value], index) => (
                            
                            <Dropdown.Item key={index}><input type='checkbox' checked={ value } /> { keys } </Dropdown.Item>

                            ))
                            }
                        </Dropdown.Menu>
                    </Dropdown>
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
