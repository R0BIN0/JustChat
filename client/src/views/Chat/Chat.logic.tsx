import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IAppDispatch } from "../../redux/store";
import { setContact } from "../../redux/reducers/chatReducer";
import { useUserCache } from "../../hooks/useQueryCache/useUserCache";

export const useChat = () => {
  const { queryUsers } = useUserCache();
  const params = useParams();
  const dispatch = useDispatch<IAppDispatch>();

  useEffect(() => {
    if (!params.id || !queryUsers.data.length) return;
    getContact();
  }, [queryUsers.data, params.id]);

  const getContact = () => {
    const contact = queryUsers.data.find((item) => item._id === params.id);
    if (!contact) return;
    dispatch(setContact(contact));
  };
};
