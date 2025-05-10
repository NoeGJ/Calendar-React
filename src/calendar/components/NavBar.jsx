import { checkRole, getRolesList, roleMessage } from "../../helpers";
import { useAuthStore, useDrawerStore, useGroupsStore, useMembersModal, useViewModalsStore, useViewStore } from "../../hooks"
import { MembersModal, ListModal, PanelModal } from "../";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";

export const NavBar = () => {
  
  const { startLogout } = useAuthStore();
  const { isOpenDrawer, openDrawer, closeDrawer } = useDrawerStore();
  const { hasGroupSelected } = useGroupsStore();
  const { openModalMembers } = useMembersModal();
  const { changeView } = useViewStore();
  const { activeGroup, currentRoles } = useGroupsStore();
  const {  openList, openPanel } = useViewModalsStore();
    
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
          <small title={ activeGroup?.name }>{ activeGroup == null ? '' : activeGroup.name.length > 15 ? activeGroup.name.slice(0, 12) + "..." : activeGroup.name } </small>
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
            <Dropdown   style={{ display: 'inline-block', width: 'auto', height: '100%', position: 'relative'}}>
            <Dropdown.Toggle className="btn btn-dark me-2 my-0">
            <i className="fas fa-book"></i> Vistas
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => openList() }> Lista </Dropdown.Item>
              <Dropdown.Item onClick={() => openPanel() }> Panel </Dropdown.Item>
          
              </Dropdown.Menu>
            </Dropdown>
              
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
    { activeGroup != null &&
    <>
      <ListModal />
      <PanelModal />
      </>
    }
    </>
  )
}
