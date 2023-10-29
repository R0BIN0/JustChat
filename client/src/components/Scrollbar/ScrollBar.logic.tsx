import { useEffect, useReducer, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAppDispatch, IRootState } from "../../redux/store";
import { setScrollToBottom } from "../../redux/reducers/chatReducer";
import { getScrollPercentage } from "../../utils/getScrollPercentage";
import { reducer, initialState, IAction, componentIsUnmounting } from "./Scrollbar.reducer";
import { scrollToBottom } from "../../utils/scrollToBottom";
import { useChatCache } from "../../hooks/useQueryCache/useChatCache";

export const useScrollbar = () => {
  // Services
  const { contact, scroll } = useSelector((s: IRootState) => s.chat);
  const { queryChat } = useChatCache(contact._id);

  const dispatchCtx = useDispatch<IAppDispatch>();

  // State
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  // Ref
  const canScrollRef = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      componentIsUnmounting();
      canScrollRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (!queryChat.isLoading) {
      console.log("on passel à ?");
      onScroll(true);
    }
  }, [queryChat.isLoading, scroll.chatContainerRef]);

  useEffect(() => {
    dispatchCtx(setScrollToBottom(onScroll));
    scroll.chatContainerRef?.addEventListener("scroll", getScroll);
    return () => {
      scroll.chatContainerRef?.removeEventListener("scroll", getScroll);
    };
  }, [scroll.chatContainerRef]);

  const getScroll = () => {
    const percentage = getScrollPercentage(scroll.chatContainerRef!);
    setCanScroll(percentage);
    const payload = { ...state, scroll: { ...state.scroll, percentage } };
    dispatch({ type: IAction.SET_SCROLL_PERCENTAGE, payload });
  };
  const setCanScroll = (percentage: number) => {
    if (canScrollRef.current && percentage !== 100) {
      canScrollRef.current = false;
    } else if (!canScrollRef.current && percentage === 100) {
      canScrollRef.current = true;
    }
  };
  const onScroll = (immediate?: boolean) => {
    if (!canScrollRef.current) return;
    const timeout = setTimeout(() => {
      scrollToBottom(scroll.chatContainerRef!, immediate);
      clearTimeout(timeout);
    }, 10);
  };
  return {
    ...state,
  };
};
