import { useDispatch, useSelector } from "react-redux"
import { onOpenEventModal, onCloseEventModal, onSetActiveEvent } from "../store";
import { calendarApi } from "../api";
import { useCalendarStore } from "./useCalendarStore";


export const useEventModalStore = () => {

    const dispatch = useDispatch();
    
    const { isEventModalOpen } = useSelector( state => state.eventModal );
    const { activeGroup } = useSelector( state => state.groups );
    const { activeEvent } = useCalendarStore();

    const openEventModal = () => {
        dispatch( onOpenEventModal() );
        getEventWithDeatils(activeEvent);
    }

    const closeEventModal = () => {
        dispatch( onCloseEventModal() );
    }

    const getEventWithDeatils = async (calendarEvent) => {
        try{
            const { data } = await calendarApi.get(`/groups/${ activeGroup.id }/events/${ calendarEvent.id }`);
            const eventDetails = data;

            console.log(eventDetails);

            if( eventDetails != null ){
                dispatch( onSetActiveEvent( eventDetails ) );
            }

        } catch (error){
            console.log(error);
        }
    };

    const updateActivity = async (activity) => {
        try{
            await calendarApi.put(`/activites/${ activity.id }`, activity);
        } catch (error) {
            console.log(error);
        }
    };

    const removeEventWithDeatils = () => {
        dispatch( onSetActiveEvent( null ) );
    };


    return {
        isEventModalOpen,
        openEventModal,
        closeEventModal,
        getEventWithDeatils,
        removeEventWithDeatils,
        updateActivity
    }
}