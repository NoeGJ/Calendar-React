import Modal from "react-modal";
import { useCalendarStore, useGroupsStore, useViewModalsStore } from "../../hooks";

export const PanelModal = () => {

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-20%",
      transform: "translate(-50%, -50%)",
      width: "500px",
    },
  };

  const { isOpenPanel, closePanel } = useViewModalsStore();
  const { events } = useCalendarStore(); // Asegúrate que cada evento tiene al menos { title, category }
  const { groups } = useGroupsStore();   // Si los grupos tienen info de categoría, también puedes usarlos

  // Agrupar eventos por categoría
  const groupedEvents = events.reduce((acc, curr) => {
    const categories = curr.category || "Sin categoría";
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
      <div>
        <h3 style={{ textAlign: "center", marginBottom: 20 }}>Panel de Eventos</h3>
        {Object.keys(groupedEvents).length === 0 && (
          <p>No hay eventos disponibles.</p>
        )}
        {Object.keys(groupedEvents).map((categories) => (
          <div
            key={categories}
            style={{
              backgroundColor:
              categories === "personal"
                  ? "#dff0f0"
                  : categories === "escuela"
                  ? "#f0def0"
                  : "#f0f5d0",
              padding: 10,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <strong>{categories}</strong>
            <ul style={{ marginTop: 5 }}>
              {groupedEvents[categories].map((evento, index) => (
                <li key={index}>{evento}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Modal>
  );
};


