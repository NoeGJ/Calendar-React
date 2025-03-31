import { useAuthStore, useDrawerStore, useGroupsStore, useCalendarStore, useViewStore } from "../../hooks";

import {
  Dropdown
} from 'react-bootstrap'
import { useEffect, useState } from "react";

export const Drawer = () => {
  
    const { closeDrawer, isOpenDrawer } = useDrawerStore();

    const { startLogout, user } = useAuthStore();
    const { setActiveGroup, hasGroupSelected, groups, activeGroup } = useGroupsStore();
    const { setActiveEvent, resetEvents } = useCalendarStore();
    const { changeView } = useViewStore();

    const [isOpen, setIsOpen] = useState(true);

    const handlebtnClose = () => {
        console.log(isOpenDrawer);
        
        closeDrawer();
    }


  const handleSelectGroup = (group, index) => {

    changeView({ type: 'calendar', view: 1, group })
    
    // if (group != activeGroup )
    //       resetEvents();
    
    // setActiveGroup( group );
    // setActiveEvent( null );
    
    
    //console.log(hasGroupSelected);
    //console.log(index);
    closeDrawer();
}

const handleHomeBtn = () => {

    changeView({ type: 'unselected', view: 0 });
    // resetEvents();  
    // setActiveGroup( null );
    // setActiveEvent( null );
    closeDrawer();
    }
  
    return (   
      <div className={`bg-dark drawerito ${ isOpenDrawer? 'open' : 'close' }`}>
        <div className="d-flex align-items-center justify-content-between px-2" >
          <div className="d-flex align-items-center gap-2">
            <i className="fas fa-calendar-alt text-white fa-2x"></i>
            <p className="text-white m-0 ml-3 mt-2 text-justify" title={ user.username }>{ user.username.length > 20 ? user.username.slice(0, 17) + "..." : user.username }</p>
           </div>
           <button onClick={ handlebtnClose} className="btn pt-3 text-white"><i className="fa-solid fa-xmark"></i></button>
        </div>
        <hr/>
          <div>
            <button className="btn d-flex px-4 align-items-center text-white w-100 btn-groups" onClick={ handleHomeBtn }>
              <i className="fa-solid fa-house mb-2"></i>
              <h5 className=" ml-3">Home</h5>
            </button>


            <button className="btn d-flex px-4 align-items-center text-white w-100 justify-content-between btn-groups" onClick={() => setIsOpen(!isOpen)}>
              <div className="d-flex align-items-center justify-content-center">
                <i className="fa-solid fa-users-line mb-2"></i>
                <h5 className=" ml-3">Grupos</h5>
              </div>
              <i className={`fa-solid fa-chevron-${isOpen ? "up" : "down"}  mr-2 mb-1`}></i>
            </button>
          <div className={`scroll-container mt-2 ${isOpen ? "open" : ""}`} 
                style={{  maxHeight: isOpen ? "70vh" : "0px",
                  overflowY: isOpen ? "auto" : "hidden",
                  transition: "max-height 0.3s ease-in-out" }}>
            <ul className="list-group list-group-flush w-100">
              {groups.map((group, index) => (
                <li className={`list-group-item list-group-item-action list-group-item-dark d-flex align-items-center justify-content-between`}  key={index} >
                <span style={{ cursor: 'pointer', flexGrow: 1, fontWeight: 'normal', width: 'auto', display: 'inline-block'}} onClick={ () => handleSelectGroup(group, index) }>
                  { group.name }
                </span>
                <Dropdown className="hidden-btn" style={{ display: 'inline-block', width: 'auto', height: '100%'}}>
                  <Dropdown.Toggle id="dropdown-drawer">
                    <i className="fa-solid fa-ellipsis" />
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu>
                    <Dropdown.Item>Eliminar</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                </li>
              ))
              }
            </ul>
          </div>  
          <hr className={ `${isOpen ? '' : 'd-none'  }`}/>

        </div>
      </div>
  );
};
