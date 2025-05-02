import Modal from "react-modal";
import { useCalendarStore, useGroupsStore, useViewModalsStore } from "../../hooks";
import { useEffect } from "react";

export const PanelModal = () => {

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-20%",
      transform: "translate(-50%, -50%)",
      width: "90%",
    },
  };

  const { isOpenPanel, closePanel } = useViewModalsStore();
 const { events } = useCalendarStore(); 
 const { loadCategories, activeGroup } = useGroupsStore();

  useEffect(() => {
      if( activeGroup.length <= 0 ) return;
      loadCategories();
    console.log(
      events)
    
  }, [activeGroup])

  // Agrupar eventos por categoría
  const groupedEvents = events.reduce((acc, curr) => {
    const categories = curr.category || "__no_category__";
    if (!acc[categories]) acc[categories] = [];
    acc[categories].push(curr.title || "Evento sin título");
    return acc;
  }, {});

  return (
    <Modal
      isOpen={isOpenPanel}
      onRequestClose={closePanel}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h3 style={{ textAlign: "center", marginBottom: 20 }}>Panel de Eventos</h3>
      <div style={{ height: '90%', overflowY: 'auto'}}>
        {Object.keys(groupedEvents).length === 0 && (
          <p>No hay eventos disponibles.</p>
        )}
        <div>
        {Object.keys(groupedEvents).map((categories, index) => {          
          const display = categories === "__no_category__" ? 'Sin Categoría' : categories
          return(
          <div
          className={ `text-black `}
            key={index}
            style={{
              padding: 10,
              marginBottom: 10,
            }}
          >
            <strong className={ categories !== "__no_category__" ? '' : 'text-danger' }>{ display }</strong>
            <ul className="list-group list-group-flush" style={{ marginTop: 5 }}>
              {groupedEvents[categories].map((evento, index) => (
                <li className="list-group-item " key={index}>{evento}</li>
              ))}
            </ul>
          </div>
        )})}
        </div>
      </div>
    </Modal>
  );
};
