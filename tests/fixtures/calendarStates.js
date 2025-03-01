
export const events = [
    {
        id: '1',
        start: new Date('2024-07-14 13:00:00'),
        end: new Date('2024-07-14 15:00:00'),
        title: 'Testing',
        notes: 'Nota',
        activities: []
    },
    {
        id: '2',
        start: new Date('2024-07-15 13:00:00'),
        end: new Date('2024-07-15 15:00:00'),
        title: 'Testing 2',
        notes: 'Nota 2',
        activities: []
    },
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [
        ...events
    ],
    activeEvent: null,
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [
        ...events
    ],
    activeEvent: { ...events[0] },
}
