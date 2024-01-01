import { useParams } from "react-router-dom";
import { useQueryCache } from "../../hooks/useQueryCache/useQueryCache";
import { IRootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { ISocketEvent } from "../../apis/ISocketEvent";
import { QUERY_KEY } from "../../hooks/useQueryCache/queryKey";
import { useChatCache } from "../../hooks/useQueryCache/useChatCache";
import { useCallback, useEffect, useReducer, useRef } from "react";
import { reducer, initialState, IAction } from "./InputMessage.reducer";

export const useInputMessage = () => {
  // Services
  const params = useParams();
  const { mutate } = useQueryCache();
  const { emitEvent } = useSelector((s: IRootState) => s.socket);
  const userId = useSelector((s: IRootState) => s.user._id);
  const { queryChat } = useChatCache();
  const scrollToBottom = useSelector((s: IRootState) => s.chat.scroll.scrollToBottom);

  // States
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // Ref
  const messageRef = useRef<string>("");

  useEffect(() => {
    window.addEventListener("keypress", submitWithKeypress);
    messageRef.current = state.message;
    return () => window.removeEventListener("keypress", submitWithKeypress);
  }, [state.message]);

  /**
   * This function is used to submit form by pressing Enter key
   * @param {KeyboardEvent} e - Keyboard event
   * @returns {void}
   */
  const submitWithKeypress = (e: KeyboardEvent): void => {
    if (e.key !== "Enter") return;
    handleSubmit();
  };

  /**
   * This function is used to add emoji to message input and update value with the new emoji added.
   * @param {string} emoji - The emoji string
   * @returns {void}
   */
  const setEmoji = useCallback((emoji: string): void => {
    const updatedInp = `${messageRef.current}${emoji}`;
    const payload = { ...state, message: updatedInp };
    dispatch({ type: IAction.SET_MESSAGE, payload });
  }, []);

  /**
   * This function is used to fill state with input data that user insert.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input event
   * @returns {void}
   */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const payload = { ...state, message: e.target.value };
    dispatch({ type: IAction.SET_MESSAGE, payload });
  };

  /**
   * This function is used to submit form and update chat cache
   * @param {{message: string}} formData - Input values from useForm
   * @returns {void}
   */
  const handleSubmit = (): void => {
    const message = {
      conversationId: queryChat.data._id,
      content: state.message,
      date: new Date(),
      receiver: params.id,
      sender: userId,
    };
    const newCache = { ...queryChat.data, messages: [...queryChat.data.messages, message] };
    mutate({ data: newCache, queryKey: [QUERY_KEY.CHAT, userId, params.id] });
    emitEvent(ISocketEvent.SEND_MESSAGE, message);
    scrollToBottom();
    dispatch({ type: IAction.SET_MESSAGE, payload: { ...state, message: "" } });
  };

  return { ...state, handleSubmit, setEmoji, handleInput };
};
