import { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import { useCalendarStore, useGroupsStore, useEventModalStore } from "../../hooks";
import { localizer, getMessagesES } from '../../helpers'

import { CalendarModal, FabAddNew, CalendarEventBox } from '..';
import { EventDetailsModal } from "../components/EventDetailsModal";


export const CalendarView = () => {

  const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();
  const { openEventModal } = useEventModalStore();
  const { activeGroup, loadCurrentPermissions, subscribedMembers, currentRoles } = useGroupsStore();
  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week')

  const eventStyleGetter = ( event, start, end, isSelected ) => {
    const style = {      
      backgroundColor:  '#347CF7',
      borderRadius: '6px',
      opacity: 0.8,
      color: 'white',
    }

    return {
      style
    }

  }
  const onDoubleClick = ( event ) => {
    openEventModal();
  }

  const onSelect = ( event ) => {
    setActiveEvent( event );
  }

  const onViewChanged = ( event ) => {
    localStorage.setItem('lastView', event );
    setLastView( event );
  }

  useEffect(() => {
    
    loadCurrentPermissions();

  }, [activeGroup])
  
  useEffect(() => {
      if(currentRoles.length === 0) return;

     startLoadingEvents();
         
  }, [currentRoles])
  
  
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

  {/* <MembersModal /> */}
  <CalendarModal />
  <EventDetailsModal/>
  <FabAddNew />
  </>
)}
