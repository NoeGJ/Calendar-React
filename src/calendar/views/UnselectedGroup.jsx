import { useEffect, useState } from "react"
import { useAuthStore, useGroupsStore, useNameGroupStore, useViewStore } from "../../hooks"
import { NameGroupModal } from "../components/NameGroupModal";
import { Dropdown } from "react-bootstrap";




export const UnselectedGroup = () => {

    const { user } = useAuthStore();
    const { groups, setActiveGroup, deleteGroup } = useGroupsStore();
    const { openModalName } = useNameGroupStore();
    const { changeView } = useViewStore();

    const colors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-info']

    useEffect(() => {
    console.log(groups);
      const selectGroup = JSON.parse( localStorage.getItem('group'));
      if (!selectGroup ) return;
      
      
      setActiveGroup( selectGroup );
      changeView({ type: 'Calendar', view: 1 });
    }, [])
    

    const handleSelectGroup = (group, index) => {
        console.log(group);
        
        setActiveGroup( group )
        changeView({ type: 'Calendar', view: 1 });
    }

    const handleNewGroup = () => {
        setActiveGroup( null );
        openModalName();
         
    }

    const handleEdit = ( group ) => {
        setActiveGroup( group );
          
        openModalName()
  
    }

    const handleDelete = async ( groupId ) => {
        await deleteGroup( groupId );
  
    }

    return (
        <>
        <div className="container container-lg justify-content-center" style={{ width: '100vw' }}>
            <h4>Recientes</h4>
            <div className="row">
            <div className="col-md-4">
                        <div className="card bg-light text-secondary col m-2 justify-content-center align-items-center shadow-5" style={{ cursor: 'pointer' }} onClick={ handleNewGroup }>
                            
                            <div className="card-body mt-3">
                                <h5 className="card-title mb-3"> Nuevo Grupo</h5>
                                
                            </div>
                        </div>
                    </div>
                {
                    groups.slice(-5).map((group, index) => {
                        const color = colors[index % colors.length];
                    return(
                        <div className="col-md-4 " key={index}>
                            <div className={`card text-white col m-2  shadow-lg ${ color }`}>
                                {group.creatorId == user.uid &&
                                <Dropdown className="btn position-absolute top-0 m-2 text-light" style={{ display: 'inline-block', width: 'auto', height: '100%', top: -10, right: -10}} >
                                    <Dropdown.Toggle id="dropdown-drawer">
                                    <i className="fa-solid fa-ellipsis" />
                                    </Dropdown.Toggle>
                                    
                                    <Dropdown.Menu className="position-fixed">
                                    <Dropdown.Item onClick={ () => handleEdit( group ) }>editar</Dropdown.Item>
                                    <Dropdown.Item onClick={ () => handleDelete( group.id ) } >Eliminar</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                }
                                {/* <button className=" btn position-absolute top-0 m-2 text-light" style={{ top: -10, right: -10 }}>
                                <i className="fa-solid fa-ellipsis" />
                                </button> */}
                                <div className="card-body justify-content-center align-items-center" style={{ cursor: 'pointer' }} onClick={ () => handleSelectGroup(group, index ) }>
                                    <h5 title={ group.name } className="card-title">{group.name.length > 20 ? group.name.slice(0,17) + "..." : group.name }</h5>
                                    <br/>
                                    <p className="d-flex card-text"></p>
                                </div>
                            </div>
                        </div>
                    )})
                }

            </div>
            <NameGroupModal />
        </div>
        </>
    )

}
