import { checkRole, getRolesList, roleMessage } from "../../helpers";
import { useAuthStore, useDrawerStore, useGroupsStore, useMembersModal, useViewStore } from "../../hooks"
import { MembersModal } from "./MembersModal";


export const NavBar = () => {
  
  const { startLogout } = useAuthStore();
  const { isOpenDrawer, openDrawer, closeDrawer } = useDrawerStore();
  const { hasGroupSelected } = useGroupsStore();
  const { openModalMembers } = useMembersModal();
  const { changeView } = useViewStore();
  const { activeGroup, currentRoles } = useGroupsStore();
  
  
  const handleToggleDrawer = () => {
    if (isOpenDrawer) closeDrawer();
    else openDrawer();
  
  };

  const handleMembersBtn = () => {
    const res = checkRole( currentRoles, getRolesList().Administrador );
    
    if (!res) {
      roleMessage();
      return;
    }
    openModalMembers();
  }

  const handleRepoBtn = () => {
    changeView({ type: 'repository', view: 2 });
  }

  const handleCalendarBtn = () => {
    console.log(activeGroup);
    
    changeView({ type: 'calendar', view: 1 })
    
  }
  
  return (
    <>
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
        
        <span className="navbar-brand">
          <span className="">
            <button className="btn btn-dark mb-1 mr-2" onClick={handleToggleDrawer}>
              <i className="fa-solid fa-bars"></i>
            </button>
            { activeGroup == null ? '' : activeGroup.name }
          </span>
          <span>
          { hasGroupSelected && <>
          <button className="btn btn-dark  ml-3 mb-1" onClick={ handleMembersBtn }>
            
              <i className="fa-solid fa-users"></i>
              Usuarios
            
          </button>
          <button className="btn btn-dark ml-1 mb-1" onClick={ handleCalendarBtn }>
              <i className="fa-solid fa-calendar" ></i>
              Calendar
          </button>
          <button className="btn btn-dark  ml-1 mb-1" onClick={ handleRepoBtn }>
            <i className="fa-solid fa-archive"></i>
            Repo
          </button>
          </>
        }
        </span>
        </span>
        


        <div className="d-flex justify-content-end">
          {
            !hasGroupSelected &&
            <button className="btn btn-dark  mr-3">
              <i class="fa-solid fa-plus"></i>
            </button>
          }
          <button 
          className="btn btn-outline-danger"
          onClick={ startLogout }
          >
              <i className="fas fa-sign-out-alt"></i>
              &nbsp;
              
              <span>Salir</span>
          </button>
        </div>
    </div>
    {
      ( activeGroup != null && checkRole( currentRoles, getRolesList().Administrador )) &&
      <MembersModal />
    }
    </>
  )
}
