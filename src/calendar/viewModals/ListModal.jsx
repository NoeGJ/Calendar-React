import Modal from "react-modal";
import { useCalendarStore, useGroupsStore, useViewModalsStore } from "../../hooks";
import { useEffect } from "react";

export const ListModal = () => {

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

    const { isOpenList, closeList } = useViewModalsStore();
    const { events, categories } = useCalendarStore();
    const { loadCategories, activeGroup } = useGroupsStore();

    useEffect(() => {
        if( activeGroup.length <= 0 ) return;
       loadCategories();
      console.log(
       categories)
      
    }, [activeGroup])
    
    
  return (

    <Modal
    isOpen={ isOpenList }
    onRequestClose={ closeList }
    style={customStyles}
    className="modal"
    overlayClassName="modal-fondo"
    closeTimeoutMS={200}
    >   
     <div>
          <h3>Listado</h3>
          <table style={{ width: "100%", backgroundColor: "#ddd" }}>
            <thead>
              <tr>
                <th>Evento</th>
                <th>Categorias</th>
              </tr>
            </thead>
            <tbody>
              {events?.map((item, index) => (
                <tr key={index}>
                  <td>{item.title}</td>
              {categories?.map( category => {
                
                <td>{category.id}</td> 

              })
              }
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    
    </Modal>
  )
}
