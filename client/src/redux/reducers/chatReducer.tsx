/* eslint-disable @typescript-eslint/ban-types */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserDTO } from "../../apis/IUserDTO";

const initialState: {
  contact: IUserDTO;
  scroll: {
    scrollToBottom: (immediate?: boolean) => void;
    chatContainerRef: HTMLDivElement | null;
  };
} = {
  scroll: {
    scrollToBottom: () => {},
    chatContainerRef: null,
  },
  contact: {
    name: "",
    email: "",
    pictureId: 1,
    online: false,
    _id: "",
  },
};

const chatSlice = createSlice({
  name: "chat",
  initialState: initialState,
  reducers: {
    setContact(state, action: PayloadAction<IUserDTO>) {
      for (const [key, value] of Object.entries(action.payload)) {
        state.contact[key as keyof IUserDTO] = value as never;
      }
    },
    setScrollToBottom(state, action: PayloadAction<() => void>) {
      state.scroll.scrollToBottom = action.payload;
    },
    setChatContainerRef(state, action: PayloadAction<any>) {
      state.scroll.chatContainerRef = action.payload;
    },
  },
});

export const { setContact, setScrollToBottom, setChatContainerRef } = chatSlice.actions;
export default chatSlice.reducer;
