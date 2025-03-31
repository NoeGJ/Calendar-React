import { useDispatch, useSelector } from "react-redux";
import { onOpenisOpenModalName, onCloseisOpenModalName } from "../store";

export const useNameGroupStore = () => {
  const dispatch = useDispatch();

  const { isOpenModalName } = useSelector(state => state.nameGroup );

  const openModalName = () => {
    dispatch(onOpenisOpenModalName());
  };

  const closeModalName = () => {
    dispatch(onCloseisOpenModalName());
  };

  return {
    isOpenModalName,
    openModalName,
    closeModalName,
  };
};