import { useMutation } from "react-query";
import { deleteUser, updateUser } from "../../apis/actions/UserAction";
import { IError } from "../../apis/IError";

export const useUserCache = () => {
  const updateUserMutation = useMutation(updateUser, {
    onError: (err: IError) => {},
  });

  const deleteUserMutation = useMutation(deleteUser);

  return { updateUserMutation, deleteUserMutation };
};
