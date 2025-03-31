import { useDispatch, useSelector } from "react-redux";
import { onCloseModalMembers, onOpenModalMembers } from "../store";

export const useMembersModal = () => {
  const dispatch = useDispatch();

  const { isOpenModalMembers } = useSelector(state => state.membersModal );

  const openModalMembers = () => {
    dispatch( onOpenModalMembers() );
  };

  const closeModalMembers = () => {
    dispatch( onCloseModalMembers() );
  };

  return {
    isOpenModalMembers,
    openModalMembers,
    closeModalMembers,
  };
};

