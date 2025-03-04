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
    
                if(activities.length){
                    await calendarApi.put(`/activities/create-many-from-event/${ calendarEvent.id }`, activities );
                }

                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                return;
            } 
            //creating
            
            const { data } = await calendarApi.post('/events', {...calendarEvent, creatorId: user.uid, groupId: 1} ); 

            
            if(activities.length){
                await calendarApi.put(`/activities/create-many-from-event/${ data.id }`, activities );
            }

            dispatch( onAddNewEvent({ ...event, id: data.id, creator: user, activities }) );

        } catch (error) {
            //console.log(error);
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
