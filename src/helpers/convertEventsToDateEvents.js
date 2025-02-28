import { parseISO } from "date-fns";


export const convertEventsToDateEvents = ( events = []) => {

    return events.map( event => {
        event.start = parseISO( event.startDate );
        event.end = parseISO( event.endDate );

        return event;
    });
}