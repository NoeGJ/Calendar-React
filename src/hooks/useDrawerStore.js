import { useDispatch, useSelector } from "react-redux";
import { onCloseDrawer, onOpenDrawer } from "../store";

export const useDrawerStore = () => {
  const dispatch = useDispatch();

  const { isOpenDrawer } = useSelector(state => state.drawer );

  const openDrawer = () => {
    dispatch(onOpenDrawer());
  };

  const closeDrawer = () => {
    dispatch(onCloseDrawer());
  };

  return {
    isOpenDrawer,
    openDrawer,
    closeDrawer,
  };
};