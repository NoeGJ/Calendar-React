import { addHours } from "date-fns";
import { useCalendarStore, useGroupsStore, useUiStore } from "../../hooks";
import { checkRole, getRolesList } from "../../helpers";

export const FabAddNew = () => {
  const { openDateModal } = useUiStore();
  const { setActiveEvent } = useCalendarStore();
  const { activeGroup, currentRoles } = useGroupsStore();

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
    style={{ display: activeGroup && checkRole(currentRoles, getRolesList().CrearEventos)  ? '' : 'none' }}
    >
      <i className="fas fa-plus"></i>
    </button>
  );
};
