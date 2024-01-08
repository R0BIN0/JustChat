/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from "react-query";
import { deleteUser, login, register, updateUser } from "../../apis/actions/UserAction";
import { IError } from "../../apis/IError";

export const useUserCache = () => {
  const registerMutation = useMutation(register, {
    onError: (_err: IError) => {},
  });

  const loginMutation = useMutation(login, {
    onError: (_err: IError) => {},
  });

  const updateUserMutation = useMutation(updateUser, {
    onError: (_err: IError) => {},
  });

  const deleteUserMutation = useMutation(deleteUser);

  return { updateUserMutation, deleteUserMutation, loginMutation, registerMutation };
};
