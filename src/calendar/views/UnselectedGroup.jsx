import { useState } from "react"
import { useGroupsStore, useNameGroupStore, useViewStore } from "../../hooks"
import { NameGroupModal } from "../components/NameGroupModal";




export const UnselectedGroup = () => {

    const { groups, setActiveGroup } = useGroupsStore();
    //const [groups, setGroups] = useState([])
    const { openModalName, isOpenModalName } = useNameGroupStore();
    const { changeView } = useViewStore();

    const colors = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-info']

    const handleSelectGroup = (group, index) => {
        // setActiveGroup( group )
        changeView({ type: 'Calendar', view: 1, group });
    }

    const handleNewGroup = () => {
        openModalName();
         
    }

    return (
        <>
        <div className="container container-lg justify-content-center" style={{ width: '100vw' }}>
            <h4>Recientes</h4>
            <div className="row">
            <div className="col-md-4">
                        <div className="card bg-light text-secondary col m-2 justify-content-center align-items-center shadow-5" style={{ cursor: 'pointer' }} onClick={ handleNewGroup }>
                            
                            <div className="card-body mt-3">
                                <h5 className="card-title mb-3">Crear Nuevo Grupo</h5>
                                
                            </div>
                        </div>
                    </div>
                {
                    groups.slice(-5).map((group, index) => {
                        const color = colors[index % colors.length];
                    return(
                        <div className="col-md-4 " key={index}>
                            <div className={`card text-white col m-2  shadow-lg ${ color }`}>
                                <button className=" btn position-absolute top-0 m-2 text-light" style={{ top: -10, right: -10 }}>
                                <i className="fa-solid fa-ellipsis" />
                                </button>
                                <div className="card-body justify-content-center align-items-center" style={{ cursor: 'pointer' }} onClick={ () => handleSelectGroup(group, index ) }>
                                    <h5 className="card-title">{group.name}</h5>
                                    <p className="d-flex card-text"> Autor:</p>
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
