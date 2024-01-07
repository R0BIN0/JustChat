import { useDispatch, useSelector } from "react-redux";
import { IAppDispatch, IRootState } from "../../redux/store";

import { useCallback } from "react";
import { setDialog } from "../../redux/reducers/dialogReducer";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/reducers/userReducer";
import { setAuth } from "../../redux/reducers/authReducer";
import { useUserCache } from "../../hooks/useQueryCache/useUserCache";
import { ISocketEvent } from "../../apis/ISocketEvent";

export const useDeleteDialog = () => {
  // Services
  const dispatchCtx = useDispatch<IAppDispatch>();
  const user = useSelector((s: IRootState) => s.user);
  const { emitEvent } = useSelector((s: IRootState) => s.socket);
  const navigate = useNavigate();
  const { deleteUserMutation } = useUserCache();

  const handleSubmit = () => {
    deleteUserMutation.mutate({ _id: user._id }, { onSuccess: handleDeleteSuccess });
  };

  const handleDeleteSuccess = () => {
    emitEvent(ISocketEvent.USER_DELETE, user);
    sessionStorage.clear();
    dispatchCtx(
      setUser({
        name: "",
        email: "",
        pictureId: 1,
        online: false,
        _id: "",
      })
    );
    dispatchCtx(
      setAuth({
        isAuthenticated: false,
        token: "",
      })
    );
    dispatchCtx(setDialog({ isOpen: undefined, data: undefined }));
    navigate("/");
  };

  const handleClose = useCallback(() => {
    dispatchCtx(setDialog({ isOpen: undefined, data: undefined }));
  }, []);

  return { handleSubmit, handleClose };
};
