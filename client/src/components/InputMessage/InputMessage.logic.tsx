import { useParams } from "react-router-dom";
import { useQueryCache } from "../../hooks/useQueryCache/useQueryCache";
import { IRootState } from "../../redux/store";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { ISocketEvent } from "../../apis/ISocketEvent";
import { QUERY_KEY } from "../../hooks/useQueryCache/queryKey";
import { useChatCache } from "../../hooks/useQueryCache/useChatCache";
import { useEffect } from "react";

export const useInputMessage = () => {
  // Services
  const params = useParams();
  const { mutate } = useQueryCache();
  const { emitEvent } = useSelector((s: IRootState) => s.socket);
  const userId = useSelector((s: IRootState) => s.user._id);
  const { queryChat } = useChatCache();
  const scrollToBottom = useSelector((s: IRootState) => s.chat.scroll.scrollToBottom);
  const { register, handleSubmit, reset } = useForm<{ message: string }>();

  useEffect(() => {
    window.addEventListener("keypress", submitWithKeypress);
    return () => {
      window.removeEventListener("keypress", submitWithKeypress);
    };
  }, [queryChat.data.messages]);

  /**
   * This function is used to submit form by pressing Enter key
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {void}
   */
  const submitWithKeypress = (e: KeyboardEvent): void => {
    if (e.key !== "Enter") return;
    handleSubmit(onSubmit)();
  };

  /**
   * This function is used to submit form and update chat cache
   * @param {{message: string}} formData - Input values from useForm
   * @returns {void}
   */
  const onSubmit: SubmitHandler<{ message: string }> = (formData: { message: string }): void => {
    const message = {
      conversationId: queryChat.data._id,
      content: formData.message,
      date: new Date(),
      receiver: params.id,
      sender: userId,
    };
    const newCache = { ...queryChat.data, messages: [...queryChat.data.messages, message] };
    mutate({ data: newCache, queryKey: [QUERY_KEY.CHAT, userId, params.id] });
    emitEvent(ISocketEvent.SEND_MESSAGE, message);
    scrollToBottom();
    reset({ message: "" });
  };

  return { register, handleSubmit, onSubmit };
};
