import { useDispatch, useSelector } from "react-redux"
import { onChangeView } from "../store";
import { useGroupsStore } from "./useGroupsStore";
import { useCalendarStore } from "./useCalendarStore";


export const useViewStore = () => {


    const { resetEvents, setActiveEvent } = useCalendarStore();

    const dispatch = useDispatch();
    
    const {
        type,
        currentView
    } = useSelector( state => state.view );

    const changeView = ( { type, view } ) => {

        resetEvents();
        setActiveEvent( null );

        dispatch( onChangeView({ type, view }))
    }

    return {
        type,
        currentView,
        changeView,
    }
}