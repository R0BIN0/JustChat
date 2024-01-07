import { useMutation } from "react-query";
import { updateUser } from "../../apis/actions/UserAction";
import { IError } from "../../apis/IError";

export const useUserCache = () => {
  const updateUserMutation = useMutation(updateUser, {
    onError: (err: IError) => {},
  });

  return { updateUserMutation };
};
