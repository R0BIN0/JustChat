import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { IAppDispatch } from "../../redux/store";
import { setDialog } from "../../redux/reducers/dialogReducer";

export const useDialogBanner = () => {
  const dispatch = useDispatch<IAppDispatch>();

  /**
   * This function is used to close dialog
   * @returns {void}
   */
  const handleClose = useCallback((): void => {
    dispatch(setDialog({ isOpen: undefined, data: undefined }));
  }, []);

  return { handleClose };
};
