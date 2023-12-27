import { useChatCache } from "../../hooks/useQueryCache/useChatCache";
import { useContactCache } from "../../hooks/useQueryCache/useContactCache";

export const useChat = () => {
  const { queryContact } = useContactCache();
  const { queryChat } = useChatCache();

  return { isLoading: queryContact.isLoading || queryChat.isLoading };
};
