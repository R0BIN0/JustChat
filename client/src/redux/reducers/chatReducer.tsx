/* eslint-disable @typescript-eslint/ban-types */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  scroll: {
    scrollToBottom: (immediate?: boolean) => void;
    chatContainerRef: HTMLDivElement | null;
  };
} = {
  scroll: {
    scrollToBottom: () => {},
    chatContainerRef: null,
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setScrollToBottom(state, action: PayloadAction<() => void>) {
      state.scroll.scrollToBottom = action.payload;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setChatContainerRef(state, action: PayloadAction<any>) {
      state.scroll.chatContainerRef = action.payload;
    },
  },
});

export const { setScrollToBottom, setChatContainerRef } = chatSlice.actions;
export default chatSlice.reducer;
