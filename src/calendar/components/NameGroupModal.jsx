import { useEffect, useMemo, useState } from "react";
import Modal from "react-modal";
import { useGroupsStore, useNameGroupStore } from "../../hooks";

const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-20%",
      transform: "translate(-50%, -50%)",
    },
  };

export const NameGroupModal = () => {

    const { isOpenModalName, closeModalName } = useNameGroupStore();
    const { startCreatingGroup, activeGroup } = useGroupsStore();
    
    const [nameGroup, setNameGroup] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const titleClass = useMemo(() => {
      if (!submitted) return '';

      if(nameGroup.length == 0) return 'is-invalid';
      return '';
    }, [nameGroup, submitted])


    const onInputNameGroup = ({ target }) => {
      if (target.value.length > 50) return;
      setNameGroup( target.value );
    }

    const handleSubmitNameGroup = async( event ) => {
      event.preventDefault();
      setSubmitted(true);

      if (nameGroup.length <= 0) return;
      
      await startCreatingGroup( nameGroup );

      closeModalName();
      setNameGroup("");
      setSubmitted(false);
    }

    useEffect(() => {
        if( activeGroup != null ){
          setNameGroup( activeGroup.name );
        }
    }, [activeGroup])
    

  return (
    <Modal
        isOpen={ isOpenModalName }
        onRequestClose={ closeModalName }
        className="modal-Name"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
        style={ customStyles }
    >
      <h2>Nuevo Grupo</h2>
      <hr />
      <form className="container" onSubmit={ handleSubmitNameGroup }>
        <label>Titulo del grupo</label>
        <input type="text" className={`form-control ${ titleClass }`} onChange={ onInputNameGroup } value={ nameGroup }/>
        <div className="d-flex justify-content-center">
          <button className="btn bg-primary text-white mt-2 w-100" type='submit'>
            Crear
          </button>
        </div>
      </form>
    </Modal>
  )
}
