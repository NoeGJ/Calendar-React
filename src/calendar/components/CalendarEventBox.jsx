

export const CalendarEventBox = ({ event }) => {
  
    const { title, creator } = event;
  
    return (
    <>
      <strong>{ title }</strong>
      <span> - { creator?.username }</span>
    </>
  )
}

