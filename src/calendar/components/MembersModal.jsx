import { useEffect, useState } from "react";
import Modal from "react-modal";

import { Dropdown } from "react-bootstrap";

import { useAuthStore, useGroupsStore, useMembersModal } from "../../hooks";
import { getRolesList } from "../../helpers";
import Swal from "sweetalert2";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-20%",
    transform: "translate(-50%, -50%)",
    width: "100vw",
    maxWidth: '500px',
    overflowY: 'hidden'
  },
};

export const MembersModal = () => {
  const { isOpenModalMembers, closeModalMembers } = useMembersModal();
  const {
    currentPermissions,
    activeGroup,
    startAddNewMember,
    loadUnsubscribed,
    unsubscribedMembers,
    subscribedMembers,
    addRole,
    deleteRole,
    kickMember,
  } = useGroupsStore();

  const { grupo, can } = currentPermissions;

  const [email, setEmail] = useState("");

  const { user } = useAuthStore();

  useEffect(() => {
    loadUnsubscribed();
      
  }, [activeGroup]);

  const handleInputChanged = ({ target }) => {
    setEmail(target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (email.length <= 0) return;

    const newUser = unsubscribedMembers.find((user) => email == user.email);
    if (!newUser) return;

    setEmail("");

    await startAddNewMember(newUser);
  };

  const handleToggleRole = async ({ target }, memberId, roleId) => {
    if (!target.checked) 
      await deleteRole(memberId, roleId);
     else 
      await addRole(memberId, roleId);
    
  };

  const handleDeleteMember = async (memberId) => {
    Swal.fire({
      text: "¿Seguro que quieres expulsar al usuario?",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
    }).then(({ isConfirmed }) => {
      if (!isConfirmed) return;

      kickMember(memberId);
    });
  };

  const onCloseModal = () => {
    closeModalMembers();
  }

  return (
    <Modal
      isOpen={isOpenModalMembers}
      onRequestClose={onCloseModal}
      className=""
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
      style={customStyles}
    >
      <form className="container" onSubmit={onSubmit}>
      <h5 className="ml-2">Compartir {grupo?.name}</h5>

      <hr />
        <div className="form-group">
          <div className="d-flex ml-2">
            <input
              type="text"
              className="  custom-select custom-select-sm mr-2"
              placeholder="Correo electrónico "
              name="email"
              autoComplete="off"
              value={email}
              onChange={handleInputChanged}
              list="emailOptions"
            />
            <datalist id="emailOptions">
              {unsubscribedMembers.map(({ email }, index) => (
                <option value={email} key={index}></option>
              ))}
            </datalist>
            <button
              className="btn bg-primary text-white w-25 btn-sm"
              type="submit"
              onClick={onSubmit}
              
            >
              Compartir
            </button>
          </div>
        </div>
        
        <div className="form-group mt-2" style={{ overflowY: 'auto', minHeight: '300px', height: '200px' }}>
          <ul className="list-unstyled" >
            {subscribedMembers.map((member, index) => (
              <li className="p-2 list-group-item-action" key={index} >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>
                      {member.username} {member.uid == user.uid ? "(Tú)" : ""}
                    </strong>
                    <small
                      className="d-block text-muted"
                      style={{ top: -10 }}
                    >
                      {member.email}
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    {member?.state !== "pending" ? ( <>
                    {!member?.currentRoles.some((role) => role.id == getRolesList().Creador) ? (
                    <Dropdown drop="end">
                      <Dropdown.Toggle
                        variant="primary"
                        id="dropdown-basic"
                        style={{ width: "100px" }}
                        size="sm"
                      >
                        Permisos
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="form-check" as="div">
                        {Object.entries(getRolesList()).map(
                          ([keys, value], index) =>
                            value != getRolesList().Creador && (
                              <Dropdown.Item key={index}>
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  checked={member?.currentRoles.some(
                                    (role) => role.id == value
                                  )}
                                  onChange={(event) =>
                                    handleToggleRole(event, member.uid, value)
                                  }
                                />{" "}
                                {keys}
                              </Dropdown.Item>
                            )
                        )}
                      </Dropdown.Menu>
                    </Dropdown>
                    )
                    :
                    <span  className="badge bg-primary text-white">Creador</span>
                    }
                    {!member?.currentRoles.some((role) => role.id == getRolesList().Creador) && (
                      <button
                        className="btn btn-outline-danger btn-sm ml-2"
                        onClick={() => handleDeleteMember(member.uid)}
                      >
                        <i className="fa fa-user-times"></i>
                      </button>
                    )}
                  </>):(
                  <span className="text-danger">
                    <small>Por confirmar</small>
                    </span>
                    
                )}
                  </div>
                </div>
              </li>
            ))}

          </ul>
        </div>
      </form>
    </Modal>
  );
};
