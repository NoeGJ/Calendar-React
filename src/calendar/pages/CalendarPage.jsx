import { Calendar } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'

import { CalendarEventBox, CalendarModal, Drawer, FabAddNew, FabDelete, NavBar, UnselectedGroup, CalendarView, MembersModal, ListRepoView } from ".."

import { useAuthStore, useCalendarStore, useGroupsStore, useUiStore, useViewStore } from '../../hooks'




export const CalendarPage = () => {

  const { activeGroup, startLoadingGroups } = useGroupsStore();

  const { currentView } = useViewStore();

  const views = [
    <UnselectedGroup key={1} />,
    <CalendarView key={2} />,
    <ListRepoView key={3} />
  ]

  useEffect(() => {
    startLoadingGroups();
  }, [])
  

  return (
    <>
      <NavBar />
      <Drawer/>

      
      {views[currentView]}
      
    </>
  )
}
