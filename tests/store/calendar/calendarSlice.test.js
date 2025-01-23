import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";


describe('Pruebas en calendarSlice', () => {
    
    test('debe de regresar el estado por defecto', () => {
        
        const state = calendarSlice.getInitialState();
        expect( state ).toEqual( initialState );
    })

    test('onSetActiveEvent debe de activar el evento', () => {
        
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        expect( state.activeEvent ).toEqual( events[0] );
    })

    test('onAddNewEvent debe de agregar el evento', () => {
      
        const newEvent = {
            id: '3',
            start: new Date('2024-07-17 13:00:00'),
            end: new Date('2024-07-17 15:00:00'),
            title: 'Testing 3',
            notes: 'Nota 3'
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        expect( state.events ).toEqual([ ...events, newEvent ]);
    })

    test('onUpdateEvent debe de actualizar el evento', () => {
      
        const updatedEvent = {
            id: '1',
            start: new Date('2024-07-15 13:00:00'),
            end: new Date('2024-07-15 15:00:00'),
            title: 'updated Testing',
            notes: 'updated Nota'
        }

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        expect( state.events ).toContain( updatedEvent );
    })
    
    test('onDeleteEvent debe de borrar el elemento activo', () => {
      
        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );        
        expect( state ).not.toContain( calendarWithActiveEventState.activeEvent );
        expect( state.activeEvent ).toBe( null );

    })

    test('onLoadEvents debe de establecer los eventos', () => {
        
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );        
        expect( state ).toEqual( calendarWithEventsState );
        
        const newState = calendarSlice.reducer( state, onLoadEvents( events ) );
        expect( state.events.length ).toBe( events.length );
    })
    
    test('onLogoutCalendar debe de limpiar el estado', () => {
        
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );        
        expect( state ).toEqual( initialState );

    })
    
    
    
    
})
