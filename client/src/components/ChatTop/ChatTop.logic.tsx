import { useContactCache } from "../../hooks/useQueryCache/useContactCache";

export const useChatTop = () => {
  const { queryContact } = useContactCache();
  return { contact: queryContact.data?.user };
};
