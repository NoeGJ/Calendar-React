import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onResetEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import { calendarApi } from "../api";
import { checkRole, convertEventsToDateEvents, getRolesList, roleMessage } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
  
    const dispatch = useDispatch();
    
    const {
        events,
        activeEvent
    } = useSelector( state => state.calendar );
    const { user } = useSelector( state => state.auth );
    const {
        activeGroup,
        currentRoles,
        currentPermissions
    } = useSelector( state => state.groups );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    }

    const startSavingEvent = async( calendarEvent ) => {

        try {
            const { activities, ...event } = calendarEvent

            console.log( event );

            if( calendarEvent.id ){
                //updating

                await calendarApi.put(`/groups/${ activeGroup.id }/events/${ calendarEvent.id }`, event );
    
                if(activities.length){
                    await calendarApi.put(`/activities/create-many-from-event/${ calendarEvent.id }`, activities );
                }

                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
                return;
            } 
            //creating
            
            const { data } = await calendarApi.post(`/groups/${ activeGroup.id }/events`, {...calendarEvent, creatorId: user.uid, groupId: activeGroup.id} ); 
            
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
            await calendarApi.delete(`/groups/${ activeGroup.id }/events/${ activeEvent.id }`);

            dispatch( onDeleteEvent() ); 
            
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data?.msg,'error');
        }
        
    }

    const startLoadingEvents = async() => {
        
        const res = checkRole( currentRoles, getRolesList().VerEventos );

        if(!res){
            roleMessage("Sin acceso a los eventos", "No tienes permisos para visualizar los eventos");
            return;
        }
        try {
            
            const { data } = await calendarApi.get(`/groups/${ activeGroup.id }/events`);
            
            const events = convertEventsToDateEvents( data );
            dispatch( onLoadEvents( events ) );

        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    }
    
    const resetEvents = () => {
        dispatch( onResetEvents() );
    }
  
    return {
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,
        //Methods
        setActiveEvent,
        resetEvents,
        startSavingEvent,
        startDeleteEvent,
        startLoadingEvents,
    }
}
