import { useAuthStore, useDrawerStore, useGroupsStore, useMembersModal, useViewStore } from "../../hooks"


export const NavBar = () => {
  
  const { startLogout, user } = useAuthStore();
  const { isOpenDrawer, openDrawer, closeDrawer } = useDrawerStore();
  const { hasGroupSelected } = useGroupsStore();
  const { openModalMembers } = useMembersModal();
  const { changeView } = useViewStore();
  
  const handleToggleDrawer = () => {
    if (isOpenDrawer) closeDrawer();
    else openDrawer();
  
  };

  const handleMembersBtn = () => {
    openModalMembers();
  }

  const handleRepoBtn = () => {
    changeView({ type: 'repository', view: 2 });
  }
  
  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
        
        <span className="navbar-brand">
            <button className="btn btn-dark mb-1 mr-2" onClick={handleToggleDrawer}>
              <i class="fa-solid fa-bars"></i>
            </button>
            { user.username }
          { hasGroupSelected && <>
          <button className="btn btn-dark  ml-5 mb-1" onClick={ handleMembersBtn }>
            
              <i class="fa-solid fa-users"></i>
              Usuarios
            
          </button>
          <button className="btn btn-dark  ml-1 mb-1" onClick={ handleRepoBtn }>
            <i class="fa-solid fa-archive"></i>
            Repo
          </button>
          </>
        }
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
  )
}
