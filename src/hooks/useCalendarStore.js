import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
  
    const dispatch = useDispatch();
    
    const {
        events,
        activeEvent
    } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    }

    const startSavingEvent = async( calendarEvent ) => {

        try {
            const { activities, ...event } = calendarEvent
            
            if( calendarEvent.id ){
                //updating

                await calendarApi.put(`/events/${ calendarEvent.id }`, event );

                await calendarApi.put(`/activities/${ calendarEvent.id }`, activities );
    
                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                return;
            } 
            //creating
            const { data } = await calendarApi.post('/events', calendarEvent );

            await calendarApi.post('/activities', calendarEvent );

            dispatch( onAddNewEvent({ ...event, id: data.evento.id, user, activities }) );

        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data?.msg, 'error');
        }

    
    }

    const startDeleteEvent = async() => {
        try {
            await calendarApi.delete(`/events/${ activeEvent.id }`);

            await calendarApi.delete(`/activities/${ activeEvent.id }`);

            dispatch( onDeleteEvent() ); 
            
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data?.msg,'error');
        }
        
    }

    const startLoadingEvents = async() => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents( data.events );
            dispatch( onLoadEvents( events ) );
            //console.log(events);

        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    }
  
    return {
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,
        //Methods
        setActiveEvent,
        startSavingEvent,
        startDeleteEvent,
        startLoadingEvents,
    }
}
