import Modal from "react-modal";
import { useCalendarStore, useGroupsStore, useViewModalsStore } from "../../hooks";

export const PanelModal = () => {

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-20%",
            transform: "translate(-50%, -50%)",
            width: '500px',
        },
    };

    const { isOpenPanel, closePanel } = useViewModalsStore();
    const { events } = useCalendarStore();
    const { groups } = useGroupsStore();
    
  return (

    <Modal
    isOpen={ isOpenPanel }
    onRequestClose={ closePanel }
    style={customStyles}
    className="modal"
    overlayClassName="modal-fondo"
    closeTimeoutMS={200}
    >   
          sas


    </Modal>
  )
}


