import { queryOptions } from "./queryOptions";
import { useQuery } from "react-query";
import { QUERY_KEY } from "./queryKey";
import { getContact } from "../../apis/actions/ChatAction";
import { useParams } from "react-router-dom";
import { IUserDTO } from "../../apis/IUserDTO";

export const useContactCache = () => {
  const params = useParams();
  const queryContact = useQuery<{ user: IUserDTO }>([QUERY_KEY.CONTACT, params.id], getContact, {
    ...queryOptions,
    staleTime: Infinity,
    enabled: !!params.id,
    onError: (err) => {
      console.error(err);
    },
  });

  return { queryContact };
};
