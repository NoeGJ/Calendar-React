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

            const eventDto = { 
                title: calendarEvent.title, 
                notes: calendarEvent.notes, 
                startDate: calendarEvent.start, 
                endDate: calendarEvent.end
            };
            
            if( calendarEvent.id ){
                //updating
                await calendarApi.put(`/events/${ calendarEvent.id }`, eventDto );

                console.log(calendarEvent);
    
                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                return;
            } 
            //creating
            const { data } = await calendarApi.post('/events', {...eventDto, creatorId: user.uid, groupId: 1} ); 

            dispatch( onAddNewEvent({ ...calendarEvent, id: data.id, user }) );

        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data?.msg, 'error');
        }

    
    }

    const startDeleteEvent = async() => {
        try {
            await calendarApi.delete(`/events/${ activeEvent.id }`);
            dispatch( onDeleteEvent() ); 
            
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data?.msg,'error');
        }
        
    }

    const startLoadingEvents = async() => {
        try {
            const { data } = await calendarApi.get('/events');
            
            const events = convertEventsToDateEvents( data );
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
