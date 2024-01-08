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
  const { scroll } = useSelector((s: IRootState) => s.chat);
  const { queryChat } = useChatCache();

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
    if (!queryChat.isLoading) onScroll(true);
  }, [queryChat.isLoading, scroll.chatContainerRef]);

  useEffect(() => {
    dispatchCtx(setScrollToBottom(onScroll));
    scroll.chatContainerRef?.addEventListener("scroll", getScroll);
    return () => {
      scroll.chatContainerRef?.removeEventListener("scroll", getScroll);
    };
  }, [scroll.chatContainerRef]);

  /**
   * This function is used to set current scroll percentage
   * @returns {void}
   */
  const getScroll = (): void => {
    const percentage = getScrollPercentage(scroll.chatContainerRef!);
    setCanScroll(percentage);
    const payload = { ...state, scroll: { ...state.scroll, percentage } };
    dispatch({ type: IAction.SET_SCROLL_PERCENTAGE, payload });
  };

  /**
   * This function is used to set if we can scroll
   * @param {number} percentage - Current scroll percentage
   * @returns {void}
   */
  const setCanScroll = (percentage: number): void => {
    if (canScrollRef.current && percentage !== 100) {
      canScrollRef.current = false;
    } else if (!canScrollRef.current && percentage === 100) {
      canScrollRef.current = true;
    }
  };

  /**
   * This function is used to invoke scroll to bottom
   * @param {boolean} immediate - To scroll to bottom immediatly or not
   * @returns {void}
   */
  const onScroll = (immediate?: boolean): void => {
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
