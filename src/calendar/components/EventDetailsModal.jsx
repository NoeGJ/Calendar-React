import Modal from "react-modal";
import { useCalendarStore, useUiStore } from "../../hooks";
import { useEventModalStore } from "../../hooks";
import { getPrioList } from "../../helpers";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    minWidth: "75%",
    transform: "translate(-50%, -50%)",
    padding: "50px",
  },
};

export const EventDetailsModal = () => {
  const { activeEvent, setActiveEvent, startDeleteEvent } = useCalendarStore();
  const { openDateModal } = useUiStore();
  const { isEventModalOpen, closeEventModal, removeEventWithDeatils } =
    useEventModalStore();

  const colorsPrid = [
    "#007bff",
    "#28a745",
    "#ffc107",
    "#e67e22",
    "#dc3545",
    "#6c757d",
  ];
  const [color, setColor] = useState([0]);

  useEffect(() => {
    if (activeEvent != null) {
      setColor(
        Object.entries(getPrioList()).find(([key, value]) => {
          return value[0] === activeEvent?.priority;
        })
      );
    }
  }, [activeEvent]);

  const handleDelete = () => {
    startDeleteEvent();
    closeEventModal();
  };

  const handleEdit = () => {
    openDateModal();
    closeEventModal();
  };

  const onCloseModal = () => {
    closeEventModal();
    removeEventWithDeatils();
    setActiveEvent(null);
  };

  return (
    <Modal
      isOpen={isEventModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <div className="container">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <span
              className="badge badge-pill text-white d-block mr-2"
              style={{
                backgroundColor:
                  color != null ? colorsPrid[color[0]] : "#007bff",
              }}
            >
              {activeEvent?.priority}
            </span>
            <h2>
              <span className="text-primary" title={activeEvent?.title}>
                {" "}
                {activeEvent?.title.length > 23
                  ? activeEvent?.title.split(0, 20) + "..."
                  : activeEvent?.title}
              </span>
            </h2>
          </div>

          <div className=" py-1 justify-content-end gx-1">
            {activeEvent?.userCan?.deleteEvent ? (
              <button className="btn btn-danger mr-2" onClick={handleDelete}>
                {" "}
                Delete{" "}
              </button>
            ) : (
              ""
            )}
            {activeEvent?.userCan?.updateEvent ? (
              <button className="btn btn-primary" onClick={handleEdit}>
                {" "}
                Update{" "}
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <Tabs id="uncontrolled-tab-example" className="mb-3 mt-4">
          <Tab eventKey="details" title="Detalles">
            <div className="d-flex mb-2">
              <div className="fw-bold mr-2">Categoría: </div>
              {activeEvent?.category != null ? (
                <span className="text-primary"> {activeEvent.category} </span>
              ) : (
                <span className="text-danger"> Sin Categoría </span>
              )}
            </div>

              <div className="col">
                <div className="row">
                  <span className="fw-bold">Duración</span>
                </div>
                <div className="ml-1 row">
                  <p className="mr-2">Inicio:</p>
                  <span className="text-primary">
                    {activeEvent?.start &&
                      format(
                        new Date(activeEvent?.start),
                        "dd 'de' MMMM 'del' yyyy, HH:mm:ss",
                        { locale: es }
                      )}
                  </span>
                </div>
                <div className="ml-1 row">
                  <p className="mr-2">Fin:</p>
                  <span className="text-primary">
                    {activeEvent?.end &&
                      format(
                        new Date(activeEvent?.end),
                        "dd 'de' MMMM 'del' yyyy, HH:mm:ss",
                        { locale: es }
                      )}
                  </span>
                </div>
              </div>
            

            <div className="d-flex mb-0">
              <p className="fw-bold mr-2">Última modificación: </p>
              {activeEvent?.updatedAt != null && (
                <span className="text-primary">
                  {format(
                    new Date(activeEvent?.updatedAt),
                    "dd 'de' MMMM 'del' yyyy, HH:mm:ss",
                    { locale: es }
                  )}
                </span>
              )}
            </div>

            <div className="d-flex">
              <p className="fw-bold mr-2">Creador: </p>
              <span className="text-primary">
                {activeEvent?.creator?.username}
              </span>
            </div>
          </Tab>

          <Tab eventKey="notas" title="Notas">
            {/* <p className="fw-bold">Notas: </p> */}
            <textarea
              className="w-100 form-control"
              style={{ height: "200px" }}
              name="notas"
              id="notas"
              disabled
              value={activeEvent?.notes}
            ></textarea>
          </Tab>
        </Tabs>

        <div className="row my-2 border-top border-black"></div>

        
          <h5 className="fw-bold">Actividades</h5>
          <div className="list-group" style={{ overflowY: 'auto', minHeight: '30px', height: '100%' }}>
            {activeEvent?.activities?.map((activity, key) => (
              <div className="d-flex list-group-flush list-group-item-action justify-items-center align-items-center" style={{ height: '40px' }} key={key}>
                <div className="col ">
                  <input
                    className="mr-2"
                    type="checkbox"
                    checked={activity.status !== "Pending"}
                    readOnly
                    disabled
                  />
                </div>
                <div className="col">
                  {activity.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      
    </Modal>
  );
};
