import { checkRole, getRolesList, roleMessage } from "../../helpers";
import { useAuthStore, useDrawerStore, useGroupsStore, useMembersModal, useViewStore } from "../../hooks"
import { MembersModal } from "./MembersModal";
import { Navbar, Nav, Container, Button } from "react-bootstrap";


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

    changeView({ type: 'calendar', view: 1 })
    
  }
  
  return (
    <>
    <Navbar bg="dark" variant="dark" expand='lg' className="mb-2 px-4">
      <Container fluid>
    <Navbar.Brand className="d-flex align-items-center">
        <button className="btn btn-dark me-2" onClick={handleToggleDrawer}>
          <i className="fa-solid fa-bars"></i>
        </button>        
          { activeGroup == null ? '' : activeGroup.name }    
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />

      <Navbar.Collapse id="navbar-nav">
        <Nav className="w-100 align-items-center">
      
            { hasGroupSelected && (
              <>
              <button className="btn btn-dark me-2 my-1" onClick={handleMembersBtn}>
                <i className="fa-solid fa-users"></i> Usuarios
              </button>                      
              
              <button className="btn btn-dark me-2 my-1" onClick={handleCalendarBtn}>
                <i className="fa-solid fa-calendar"></i> Calendar
              </button>                    
              
              <button className="btn btn-dark me-2 my-0" onClick={handleRepoBtn}>
                <i className="fa-solid fa-archive"></i> Repo
              </button>
              
              </>
            )}
          </Nav>          

          <Nav className="align-items-center">
            <Button
              variant="outline-danger"
              onClick={startLogout}
              className="me-2 ms-lg-auto my-1"
              style={{ width: '80px' }}
            >
              <i className="fas fa-sign-out-alt"></i> Salir
            </Button>
          </Nav>  
    
    </Navbar.Collapse>
    </Container>
    </Navbar>
    {
      ( activeGroup != null && checkRole( currentRoles, getRolesList().Administrador )) &&
      <MembersModal />
    }
    </>
  )
}
