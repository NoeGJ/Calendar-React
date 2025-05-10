import { useDispatch, useSelector } from "react-redux"
import { onCloseDateModal, onOpenDateModal, onLoadEventFormResources, onCloseEventFormResources, onSetActiveEvent } from "../store";
import { calendarApi } from "../api";

export const useUiStore = () => {

    const dispatch = useDispatch();
    
    const {
        isDateModalOpen
    } = useSelector( state => state.ui );

    const { activeGroup } = useSelector( state => state.groups );
    const { eventFormResources } = useSelector( state => state.calendar );

    const openDateModal = async () => {
        try {
            const { data } = await calendarApi.get(`/groups/${ activeGroup.id }/events/create`);

            dispatch( onLoadEventFormResources(data.resources) )
            dispatch( onOpenDateModal() )
            
        } catch (exception) {
            console.log(exception)
        }
    }

    const closeDateModal = () => {
        dispatch( onSetActiveEvent(null) );
        dispatch( onCloseDateModal() );
        dispatch( onCloseEventFormResources() );
    }

    return {
        eventFormResources,
        isDateModalOpen,
        openDateModal,
        closeDateModal,
    }
}