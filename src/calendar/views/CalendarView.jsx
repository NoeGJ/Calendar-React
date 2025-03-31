import { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import { useAuthStore, useCalendarStore, useGroupsStore, useUiStore } from "../../hooks";
import { localizer, getMessagesES } from '../../helpers'

import { CalendarModal, FabAddNew, FabDelete, CalendarEventBox, MembersModal } from '..';


export const CalendarView = () => {

  const { user } = useAuthStore();
  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
  const { openDateModal } = useUiStore();
  const { activeGroup, setCurrentPermissions } = useGroupsStore();
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week')

  const eventStyleGetter = ( event, start, end, isSelected ) => {
    const isMyEvent = ( user.uid === event.creator?._uid ) || ( user.uid === event.creator?.uid );

    const style = {
      backgroundColor: isMyEvent ? '#347CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
    }

    return {
      style
    }

  }
  const onDoubleClick = ( event ) => {
    openDateModal();
  }

  const onSelect = ( event ) => {
    setActiveEvent( event );
  }

  const onViewChanged = ( event ) => {
    localStorage.setItem('lastView', event );
    setLastView( event );
  }

  useEffect(() => {
    console.log(activeGroup.id);
    
    startLoadingEvents();
    setCurrentPermissions( activeGroup.id );
  }, [activeGroup])
  


  return (
  <>
    <Calendar
    culture='es'
    localizer={localizer}
    events={events}
    defaultView={ lastView }
    startAccessor="start"
    endAccessor="end"
    style={{ height: 'calc( 100vh - 80px )' }}
    messages={ getMessagesES() }
    eventPropGetter={ eventStyleGetter }
    components={{
      event: CalendarEventBox
    }}
    onDoubleClickEvent={ onDoubleClick }
    onSelectEvent={ onSelect }
    onView={ onViewChanged }
    
  />


  <MembersModal />
  <CalendarModal />
  <FabAddNew />
  <FabDelete />
  </>
  
)
}
