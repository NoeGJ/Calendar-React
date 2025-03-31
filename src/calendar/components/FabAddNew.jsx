import { addHours } from "date-fns";
import { useCalendarStore, useGroupsStore, useUiStore } from "../../hooks";

export const FabAddNew = () => {
  const { openDateModal } = useUiStore();
  const { setActiveEvent } = useCalendarStore();
  const { activeGroup } = useGroupsStore();

  const handleClickNew = () => {
    setActiveEvent({      
      title: "",
      notes: "",
      start: new Date(),
      end: addHours(new Date(), 2),
      bgColor: "#fafafa",

    });
    openDateModal();
  };

  return (
    <button className="btn btn-primary fab" onClick={handleClickNew}
    style={{ display: activeGroup ? '' : 'none' }}
    >
      <i className="fas fa-plus"></i>
    </button>
  );
};
