import { useDispatch, useSelector } from "react-redux"
import { onOpenList, onOpenPanel, onCloseList, onClosePanel } from "../store";


export const useViewModalsStore = () => {

    const dispatch = useDispatch();
    
    const {
        isOpenList,
        isOpenPanel

    } = useSelector( state => state.calendarView );

    const openList = () => {
        dispatch( onOpenList() )
    }

    const closeList = () => {
        dispatch( onCloseList() );
    }

    const openPanel = () => {
        dispatch( onOpenPanel() )
    }

    const closePanel = () => {
        dispatch( onClosePanel() );
    }
    
    return {
        isOpenList,
        isOpenPanel,

        openList,
        closeList,
        openPanel,
        closePanel
    }
}