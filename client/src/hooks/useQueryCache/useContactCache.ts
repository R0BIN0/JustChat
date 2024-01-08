import { queryOptions } from "./queryOptions";
import { useQuery } from "react-query";
import { QUERY_KEY } from "./queryKey";
import { useParams } from "react-router-dom";
import { IUserDTO } from "../../apis/IUserDTO";
import { getUser } from "../../apis/actions/UserAction";

export const useContactCache = () => {
  const params = useParams();
  const queryContact = useQuery<{ user: IUserDTO }>([QUERY_KEY.CONTACT, params.id], getUser, {
    ...queryOptions,
    staleTime: Infinity,
    enabled: !!params.id,
  });

  return { queryContact };
};
