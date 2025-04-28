import Modal from "react-modal";
import { useCalendarStore, useUiStore } from "../../hooks";
import { useEventModalStore } from "../../hooks";
import { getEnvVariables } from "../../helpers";
import { format } from "date-fns";
import { es } from 'date-fns/locale';

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    minWidth: "75%",
    transform: "translate(-50%, -50%)",
  },
};

export const EventDetailsModal = () => {
  const { activeEvent, setActiveEvent, startDeleteEvent } = useCalendarStore();
  const { openDateModal } = useUiStore();
  const { isEventModalOpen, closeEventModal, removeEventWithDeatils } = useEventModalStore();

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
        <div className="container p-5">
          <div className="row">
            <div className="col">
              <div className="row">
                <h2>
                  <span className="text-primary"> {activeEvent?.title}</span>
                </h2>
              </div>
            </div>
            <div className="col">
              <div className="row py-2 justify-content-end gx-1">
                <div className="col-auto">
                  {activeEvent?.userCan?.deleteEvent ? (
                    <button className="btn btn-danger" onClick={handleDelete}> Delete </button>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-auto">
                  {activeEvent?.userCan?.updateEvent ? (
                    <button className="btn btn-primary" onClick={handleEdit}> Update </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col mx-3 gy-1">
              <div className="row my-3 border-top border-black"></div>

              <div className="row mb-2">
                <div className="fw-bold mr-2">Categoría: </div>
                {activeEvent?.category != null ?
                <span className="text-primary"> { activeEvent.category} </span>
                :
                <span className="text-danger"> Sin Categoría </span>
                }
              </div>

              <div className="row mb-2">
                <div className="col">
                  <div className="row">
                    <span className="fw-bold">Duración</span>
                  </div>
                  <div className="ml-1 row">
                    <p className="mr-2">Inicio:</p>
                    <span className="text-primary">
                      { activeEvent?.start &&
                      ( format (new Date(activeEvent?.start), "dd 'de' MMMM 'del' yyyy, HH:mm:ss",{ locale: es }) )
                      }
                    </span>
                  </div>
                  <div className="ml-1 row">
                    <p className="mr-2">Fin:</p>
                    <span className="text-primary">
                      { activeEvent?.end &&
                       ( format (new Date(activeEvent?.end), "dd 'de' MMMM 'del' yyyy, HH:mm:ss",{ locale: es }) )
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="row mb-2">
                <p className="fw-bold mr-2">Prioridad: </p>{" "}
                <span className="text-primary">{activeEvent?.priority}</span>
              </div>

              <div className="row mb-0">
                <p className="fw-bold">Notas: </p>
              </div>
              <div className="row mb-3">
                <textarea
                  name="notas"
                  id="notas"
                  disabled
                  value={activeEvent?.notes}
                ></textarea>
              </div>

              <div className="row mb-2">
                <p className="fw-bold mr-2">Última modificación: </p>
                { activeEvent?.updatedAt != null &&
                ( <span className="text-primary">{ format (new Date(activeEvent?.updatedAt), "dd 'de' MMMM 'del' yyyy, HH:mm:ss",{ locale: es })}</span> )
                }
              </div>
            </div>

            <div className="col mb-2">
              <div className="row mt-3 mb-4 border-top border-black"></div>

              <div className="row">
                <p className="fw-bold mr-2">Creador: </p>
                <span className="text-primary">
                  {activeEvent?.creator?.username}
                </span>
              </div>

              <div className="row my-2 border-top border-black"></div>

              <div className="col mb-1">
                <h5 className="fw-bold">Actividades</h5>
                <div className="col">
                  {activeEvent?.activities?.map((activity, key) => (
                    <div className="row justify-items-center" key={key}>
                      <div className="col">
                        <input
                          className="mr-2"
                          type="checkbox"
                          checked={activity.status !== "Pending"}
                          readOnly
                          disabled
                        />
                      </div>
                      <div className="col">
                        <p>{activity.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
  );
};
