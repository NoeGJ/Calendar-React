import { addHours, differenceInSeconds } from "date-fns";
import { useMemo, useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import { useCalendarStore, useUiStore } from "../../hooks";
import { useEffect } from "react";
import { getEnvVariables, getPrioList } from "../../helpers";

import { Dropdown, Accordion, Tabs, Tab } from "react-bootstrap";
import { FileIdsPanel } from "./FileIdsPanel";

registerLocale("es", es);

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const initialValues =     {
    title: "",
    notes: "",
    start: new Date(),
    end: addHours(new Date(), 2),
    category: "",
    priority: 0,
    activities: [],
    assigneeId: null,
    fileIds: [],
}


if (getEnvVariables().VITE_MODE !== "test") Modal.setAppElement("#root");

export const CalendarModal = () => {
  const { isDateModalOpen, eventFormResources, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent, setActiveEvent } = useCalendarStore();

  const [formSubmitted, setFormSubmitted] = useState(false);

  const ESTADOS_ACTIVIDAD = {
    NO_INICIADA: {title:"No iniciada", color: 'bg-secondary'}, 
    EN_DESARROLLO: {title: "En desarrollo", color: 'bg-warning'}, 
    TERMINADA: {title:"Terminada", color: 'bg-success'}
  }

  const [formValues, setFormValues] = useState(
    initialValues
  );

  //const [activities, setActivities] = useState([]);

  const [activity, setActivity] = useState("");
  const [assigneeSel, setAssigneeSel] = useState(0);

  const titleClass = useMemo(() => {
    if (!formSubmitted) return "";

    if (formValues.title.length == 0) return "is-invalid";
  }, [formValues.title, formSubmitted]);

  useEffect(() => {
    if (!activeEvent) {
      setFormValues( initialValues );
      return;
    }
      const { start, end, priority, assignee, files, ...event } =
        activeEvent;

      const prio = Object.entries(getPrioList()).find(
        ([key, value]) => value[0] == priority
      );

      if (!prio) return;

      let fileIds = [];
      if (files) {
        fileIds = files.map((file) => file.id);
      }

      setFormValues({
        ...event,
        end: new Date(end),
        start: new Date(start),
        priority: prio[0],
        assigneeId: assignee?.uid,
        fileIds: fileIds,
        
      });

      if (assignee) {
        setAssigneeSel(assignee.uid);
      }
    
  }, [activeEvent]);

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  const onDateChanged = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event,
    });
  };

  const onCloseModal = () => {
    //Reset manual del listado de ids de referencias de archivos
    setFormValues( initialValues );
    setActiveEvent(null);
    setActivity("");
    
    closeDateModal();
    
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    const difference = differenceInSeconds(formValues.end, formValues.start);

    if (isNaN(difference) || difference <= 0) {
      Swal.fire("Fechas incorrectas", "Revisar las fechas ingresadas", "error");
      return;
    }

    if (formValues.title.length <= 0) return;

    if (formValues?.category == undefined) delete formValues.category;

    if( formValues.activities == undefined ) formValues.activities = []
        
    await startSavingEvent({ ...formValues });

    closeDateModal();
    setFormSubmitted(false);
    
  };

  // Actividades
  const onClickBtnAdd = () => {
    if (activity.trim() === "") return;

    setFormValues({...formValues, activities: [ ...(formValues.activities || []), { status: Object.keys(ESTADOS_ACTIVIDAD)[0], name: activity }]});
    
    setActivity("");
  };

  const onInputActChanged = ({ target }) => {
    if (target.value.length > 30) return;
    setActivity(target.value);
  };

  const toggleCompleted = (index) => {    
    setFormValues( prev =>{
    const updatedAct = prev.activities.map((act, i) =>{
      if(i === index){
        const currentIndex = Object.keys(ESTADOS_ACTIVIDAD).indexOf(act.status);
        const nextIndex = (currentIndex + 1) % Object.entries(ESTADOS_ACTIVIDAD).length;    
        return {
          ...act,
          status: Object.keys(ESTADOS_ACTIVIDAD)[ nextIndex ]
        };        
      }
      return act;
    });
    return {
      ...prev,
      activities: updatedAct
    }});
  };

  const onClickDeleteActivity = (index) => {
    setFormValues( values => ({      
      ...values,
       activities: values.activities.filter((act, i) => i !== index)
      }))
  };

  const onAssigneeChanged = ({ target }) => {
    setAssigneeSel(target.value);

    setFormValues({
      ...formValues,
      [target.name]: target.value,
    });
  };

  return (
    <Modal
      isOpen={isDateModalOpen}
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal px-1"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <div className="justify-content-between align-content-center ">
        <div className="p-3   bg-white rounded">
          <h3>
            {" "}
            {formValues.title != "" ? formValues.title : "Nuevo evento"}{" "}
          </h3>
        </div>
      </div>
      <hr />
      <form className="container" onSubmit={onSubmit}>
        <div className="">
          <Tabs className="mb-3" full="true">
            <Tab eventKey="detalles" title="Detalles">
              <div className="form-group mb-1">
                <label className="text-secondary">Titulo</label>
                <input
                  type="text"
                  className={`form-control ${titleClass}`}
                  placeholder="Título del evento"
                  name="title"
                  autoComplete="off"
                  value={formValues.title}
                  onChange={onInputChanged}
                />
              </div>
              <div className="form-group mb-1">
                <label className="text-secondary">Categoría</label>
                <input
                  type="text"
                  className="form-control  mr-2"
                  placeholder="Categoría"
                  name="category"
                  autoComplete="off"
                  value={formValues.category || ""}
                  onChange={onInputChanged}
                  list="categoryOptions"
                />
                <datalist id="categoryOptions">
                  {eventFormResources?.categories.map((category) => (
                    <option value={category.name} key={category.id}></option>
                  ))}
                </datalist>
              </div>
              <Accordion>
                <Accordion.Item>
                  <Accordion.Header className="d-flex align-items-center justify-content-between">
                    <div className="d-flex justify-content-between">
                      <small className="d-flex">Horarios</small>

                      <small className="d-flex align-items-center ">
                        <i
                          className="toggle-icon fa fa-plus position-absolute ms-auto"
                          style={{ right: 15 }}
                        ></i>
                      </small>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-group mb-2">
                      <label>Fecha y hora inicio</label>

                      <DatePicker
                        selected={formValues.start}
                        className="form-control"
                        wrapperClassName="w-100"
                        onChange={(event) => onDateChanged(event, "start")}
                        dateFormat="Pp"
                        showTimeSelect
                        locale="es"
                        timeCaption="Hora"
                      />
                    </div>

                    <div className="form-group mb-2">
                      <label>Fecha y hora fin</label>
                      <DatePicker
                        minDate={formValues.start}
                        selected={formValues.end}
                        className="form-control"
                        wrapperClassName="w-100"
                        onChange={(event) => onDateChanged(event, "end")}
                        dateFormat="Pp"
                        showTimeSelect
                        locale="es"
                        timeCaption="Hora"
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="d-flex align-items-center justify-content-between">
                    <div className="d-flex justify-content-between">
                      <small className="d-flex">Notas</small>

                      <small className="d-flex align-items-center ">
                        <i
                          className="toggle-icon fa fa-plus position-absolute ms-auto"
                          style={{ right: 15 }}
                        ></i>
                      </small>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="form-group mb-2">
                      <textarea
                        style={{
                          height: "150px",
                          maxHeight: "150px",
                          minHeight: "150px",
                        }}
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChanged}
                      ></textarea>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Tab>
            <Tab eventKey="actividades" title="Actividades">
              <div className="form-group mb-2">
                <label>Actividades</label>
                <div className="d-flex">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Actividad"
                    name="activity"
                    value={activity}
                    onChange={onInputActChanged}
                  />
                  <button
                    type="button"
                    className="btn btn-light mb-1 "
                    onClick={onClickBtnAdd}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </div>
                <ul className="list-group mt-2">
                  {formValues.activities?.map((act, index) => (
                    <li
                      key={index}
                      className={`list-group-item d-flex justify-content-between align-items-center`}
                      >
                      <span
                        onClick={() => toggleCompleted(index)}
                        style={{ cursor: "pointer", flexGrow: 1 }}
                      >
                        {act.name}
                      </span>
                      <span
                        className={`badge ${
                          ESTADOS_ACTIVIDAD[act.status].color
                        } mr-2`}
                      >
                        { ESTADOS_ACTIVIDAD[act.status].title }
                      </span>
                      <button
                        className="btn btn-sm"
                        type="button"
                        onClick={() => onClickDeleteActivity(index)}
                      >
                        <i className="fa fa-close"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Tab>
            <Tab eventKey="asignacion" title="Asignación">
              <label>Prioridad</label>
              <select
                name="priority"
                className="form-control"
                onChange={onInputChanged}
                value={formValues.priority}
              >
                {Object.entries(getPrioList()).map(([key, value]) => (
                  <option value={key} key={key}>
                    {value[1]}
                  </option>
                ))}
              </select>

              <div className="form-group mb-2">
                <label>Asignación</label>
                <br />
                <select
                  id="assigneeId"
                  name="assigneeId"
                  value={assigneeSel || 0}
                  className="form-control"
                  onChange={onAssigneeChanged}
                >
                  <option key={0} value={"null"}>
                    Elija un miembro...
                  </option>
                  {eventFormResources?.members.map((member) => {
                    return (
                      <option key={member.uid} value={member.uid}>
                        {member.username}
                      </option>
                    );
                  })}
                </select>
                <small id="emailHelp" className="form-text text-muted">
                  Miembro encargado de llevar a cabo el evento y sus
                  actividades.
                </small>
              </div>
            </Tab>
            <Tab eventKey="recursos" title="Recursos">
              {isDateModalOpen ? (
                <FileIdsPanel
                  files={eventFormResources?.files ?? []}
                  onFileIdsChange={onInputChanged}
                  selectedFileIds={formValues.fileIds ?? []}
                />
              ) : (
                ""
              )}
            </Tab>
          </Tabs>
        </div>

        <div className="fixed-footer-btn">
          <button type="submit" className="btn btn-outline-primary w-100">
            <i className="far fa-save"></i>
            <span> Guardar</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
