import { useDispatch, useSelector } from "react-redux"
import { onChangeView, onResetView } from "../store";
import { useCalendarStore } from "./useCalendarStore";

export const useViewStore = () => {


    const { resetEvents, setActiveEvent } = useCalendarStore();

    const dispatch = useDispatch();
    
    const {
        type,
        currentView
    } = useSelector( state => state.view );

    const changeView = ( { type, view } ) => {
        if( view == currentView ) return;

        resetEvents();
        setActiveEvent( null );

        dispatch( onChangeView({ type, view }))
    }

    const resetView = () => {
        dispatch( onResetView() );
    }

    return {
        type,
        currentView,
        changeView,
        resetView
    }
}