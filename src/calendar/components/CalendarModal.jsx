import { addHours, differenceInSeconds } from "date-fns";
import { useMemo, useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import { useCalendarStore, useUiStore } from "../../hooks";
import { useEffect } from "react";
import { getEnvVariables } from "../../helpers";

registerLocale('es', es)

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

if( getEnvVariables().VITE_MODE !== 'test' )
    Modal.setAppElement("#root");

export const CalendarModal = () => {

  const { isDateModalOpen, closeDateModal } = useUiStore();
  const { activeEvent, startSavingEvent, setActiveEvent } = useCalendarStore();

  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formValues, setFormValues ] = useState({
    title: '',
    notes: '',
    start: new Date(),
    end:  addHours( new Date(), 2),
  });

  const [activities, setActivities] = useState([])

  const [activity, setActivity] = useState('')

  const titleClass = useMemo(() => {
    if( !formSubmitted ) return '';

    if ( formValues.title.length == 0) return 'is-invalid'

  }, [formValues.title, formSubmitted])

  useEffect(() => {
    if( activeEvent !== null ){
      setFormValues({ ...activeEvent });
    }
  
  }, [activeEvent])
  

  const onInputChanged = ({ target }) => {
    setFormValues({
      ...formValues,
      [target.name]: target.value
    });
  }

  const onDateChanged = (event, changing) => {
    setFormValues({
      ...formValues,
      [changing]: event
    });
  }

  const onCloseModal = () => {
    closeDateModal();
    setActiveEvent(null);
  };

  const onSubmit = async(event) => {
    event.preventDefault();
    setFormSubmitted(true);

    console.log({...formValues, activities: activities});
    
    const difference = differenceInSeconds( formValues.end, formValues.start );

    if ( isNaN( difference ) || difference <= 0 ){
      Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas','error');
      return;
    }

    if( formValues.title.length <= 0) return;
    
    await startSavingEvent({ ...formValues, activities: activities });

    closeDateModal();
    setFormSubmitted(false);

  }

  // Actividades
  const onClickBtnAdd = () => {
    if (activity.trim() === "") return;
    
    setActivities([...activities, { status: 0, name: activity }]);
    setActivity("");
  }

  const onInputActChanged = ({ target }) => {
    if ( target.value.length > 30 ) return;
    setActivity( target.value );
  }

  const toggleCompleted = ( index ) => {
    const newActivities = activities.map((act, i) =>
      i ===  index ? { ...act, status: + !act.status } : act
    );
    setActivities(newActivities)
  }

  const onClickDeleteActivity = ( index ) => {
    setActivities( 
      activities.filter((act, i) =>  i !== index 
    ));
  }

  return (
    <Modal
      isOpen={ isDateModalOpen }
      onRequestClose={onCloseModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <h1> Nuevo evento </h1>
      <hr />
      <form className="container" onSubmit={ onSubmit }>
        <div className="overflow-auto modal-container">
        <div className="form-group mb-2">
          <label>Fecha y hora inicio</label>

          <DatePicker 
            selected={ formValues.start }
            className="form-control"
            wrapperClassName="w-100"
            onChange={ (event) => onDateChanged(event, 'start') }
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <div className="form-group mb-2">
          <label>Fecha y hora fin</label>
          <DatePicker
            minDate={ formValues.start }
            selected={ formValues.end }
            className="form-control"
            wrapperClassName="w-100"
            onChange={ (event) => onDateChanged(event, 'end') }
            dateFormat="Pp"
            showTimeSelect
            locale="es"
            timeCaption="Hora"
          />
        </div>

        <hr />
        <div className="form-group mb-2">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${ titleClass }`}
            placeholder="Título del evento"
            name="title"
            autoComplete="off"
            value={ formValues.title }
            onChange={ onInputChanged }
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripción corta
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={ formValues.notes }
            onChange={ onInputChanged }
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Información adicional
          </small>
        </div>

        <hr/>
        <div className="form-group mb-2">
          <label>Actividades</label>
          <div className="d-flex">    
              <input               
              type="text"
              className="form-control"
              placeholder="Actividad"
              name="activity"
              value={ activity }
              onChange={ onInputActChanged }
              />          
              <button type="button" className="btn btn-light mb-1 " onClick={ onClickBtnAdd }>
                <i className="fa fa-plus"></i>
              </button>          
          </div>
          <ul className="list-group mt-2">
            { activities.map( (act, index) => (
              <li
                key={ index }
                className={`list-group-item d-flex justify-content-between align-items-center 
                  ${act.status ? "list-group-item-success" : ""}`}

              >
                <span
                  onClick={() => toggleCompleted( index )}
                  style={{cursor:  "pointer", flexGrow: 1 }}
                >
                  { act.name }
                </span>
                <span className={`badge ${act.status ? "bg-success" : "bg-secondary"} mr-2`}>
                  {act.status ? "Completado": "Pendiente"}
                </span>
                <button
                  className="btn btn-sm"
                  type="button"
                  onClick={ () => onClickDeleteActivity( index ) }
                >
                  <i className="fa fa-close"></i>
                </button>
              </li>
            ))
            }
          </ul>
        </div>
        </div>
        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Guardar</span>
        </button>
      </form>
    </Modal>
  );
};
