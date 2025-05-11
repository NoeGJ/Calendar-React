import Modal from "react-modal";
import { useCalendarStore, useGroupsStore, useUiStore } from "../../hooks";
import { useEventModalStore, useRepoStore } from "../../hooks";
import { checkRole, formatBytes, getPrioList, getRolesList } from "../../helpers";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Tab, Tabs, Card } from "react-bootstrap";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    minWidth: "65%",
    transform: "translate(-50%, -50%)",
    padding: "50px",
    height: "500px",
    minHeight: "600px",
    maxHeight: "500px",
  },
};

export const EventDetailsModal = () => {
  const { activeEvent, setActiveEvent, startDeleteEvent } = useCalendarStore();
  const { openDateModal } = useUiStore();
  const { isEventModalOpen, closeEventModal, removeEventWithDeatils } =
    useEventModalStore();
    const {  downloadFile } = useRepoStore();
    const { currentRoles } = useGroupsStore();

  const ESTADOS_ACTIVIDAD = {
    NO_INICIADA: { title: "No iniciada", color: "bg-secondary" },
    EN_DESARROLLO: { title: "En desarrollo", color: "bg-warning" },
    TERMINADA: { title: "Terminada", color: "bg-success" },
  };

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
      console.log(activeEvent);
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

  const onClickDownload = ( file ) => {
    console.log(file);
    downloadFile( file )
  }

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
        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            width: "100%",
          }}
        >
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
            <Tab
              eventKey="details"
              title="Detalles"
              style={{ height: "200px" }}
            >
              <div className="row mr-2">
                <div className="col d-block">
                  <div className=" mb-2 ">
                    <div className="d-flex font-weight-bold mr-2 align-items-center">
                      Categoría{" "}
                    </div>
                    {activeEvent?.category != null ? (
                      <span className="text-primary">
                        {" "}
                        {activeEvent.category}{" "}
                      </span>
                    ) : (
                      <span className="text-danger"> Sin Categoría </span>
                    )}
                  </div>
                </div>

                <div className=" col ">
                  <div className="d-block ml-1 ">
                    <span className="d-flex mr-2 font-weight-bold d-block align-items-center">
                      Inicio
                    </span>
                    <span className="text-primary">
                      {activeEvent?.start &&
                        format(
                          new Date(activeEvent?.start),
                          "dd'/'MMMM'/'yyyy, HH:mm:ss",
                          { locale: es }
                        )}
                    </span>
                  </div>
                </div>
                <div className="col">
                  <span className=" font-weight-bold   mr-2 d-block">Fin</span>
                  <span className="text-primary">
                    {activeEvent?.end &&
                      format(
                        new Date(activeEvent?.end),
                        "dd'/'MMMM'/'yyyy, HH:mm:ss",
                        { locale: es }
                      )}
                  </span>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-sm-4">
                  <div>
                    <span className="d-block font-weight-bold mr-2">
                      Última edición
                    </span>
                    {activeEvent?.updatedAt != null && (
                      <span className="text-primary">
                        {format(
                          new Date(activeEvent?.updatedAt),
                          "dd'/'MMMM'/'yyyy, HH:mm:ss",
                          { locale: es }
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="d-block">
                    <span className="d-block font-weight-bold mr-2">
                      Creador
                    </span>
                    <span className="text-primary">
                      {activeEvent?.creator?.username}
                    </span>
                  </div>
                </div>
                <div className="col">
                  <div className="d-block">
                    <span className="d-block font-weight-bold mr-2">
                      Asignado
                    </span>
                    <span
                      className={`text-${
                        activeEvent?.assignee != null ? "primary" : "danger"
                      }`}
                    >
                      {activeEvent?.assignee != null
                        ? activeEvent?.assignee.username
                        : "Sin asignar"}
                    </span>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="notas" title="Notas">
              <textarea
                className="w-100 form-control bg-white"
                style={{
                  height: "200px",
                  maxHeight: "200px",
                  minHeight: "150px",
                }}
                name="notas"
                id="notas"
                disabled
                value={activeEvent?.notes}
              ></textarea>
            </Tab>
            <Tab
              eventKey="actividades"
              title="Actividades"
              style={{ height: "400px" }}
            >
              <div
                className="d-block h-100 justify-content-center"
                style={{ maxHeight: "400px", overflow: "auto" }}
              >
                <ul className="list-group list-group-flush">
                  {activeEvent?.activities?.map((value, index) => (
                    <>
                      <li className="mb-2 list-group-item" key={index}>
                        <div className="d-flex justify-content-between text-primary">
                          {value.name}
                          <div className="">
                            <span
                              className={`badge ${
                                ESTADOS_ACTIVIDAD[value.status].color
                              } text-white`}
                            >
                              {ESTADOS_ACTIVIDAD[value.status].title}
                            </span>
                          </div>
                        </div>
                      </li>
                    </>
                  ))}
                </ul>
              </div>
            </Tab>
            {checkRole( currentRoles, getRolesList().Descarga ) &&
            (
            <Tab
              eventKey="recursos"
              title="Recursos"
              style={{ height: "400px" }}
            >
              <div
                className="d-block h-100 justify-content-center"
                style={{ maxHeight: "400px", overflow: "auto" }}
              >
                {activeEvent?.files?.map((value, index) => (
                  <>
                    <Card className="mb-2" key={index}>
                      <Card.Body>
                        <div className="d-flex justify-content-between text-primary">
                          <div className="d-block">
                            <div>{value.name}</div>
                            <div>{formatBytes(value.size)}</div>
                          </div>
                          <div className="">
                            <span className={`badge`}>
                              <button className="btn text-primary" onClick={ () => onClickDownload( value ) }>
                                <i className="fa fa-download"></i>
                              </button>
                            </span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </>
                ))}
              </div>
            </Tab>
          )}
          </Tabs>

          <div className="row my-2 border-top border-black"></div>
        </div>
      </div>
    </Modal>
  );
};
