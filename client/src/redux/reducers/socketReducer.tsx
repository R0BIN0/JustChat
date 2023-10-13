/* eslint-disable @typescript-eslint/ban-types */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISocketEvent } from "../../apis/ISocketEvent";

const initialState: {
  webSocket: WebSocket | undefined;
  emitEvent: (type: ISocketEvent, payload: unknown) => void;
} = {
  webSocket: undefined,
  emitEvent: () => {},
};

const socketSlice = createSlice({
  name: "socket",
  initialState: initialState,
  reducers: {
    setSocket(state, action: PayloadAction<WebSocket>) {
      state.webSocket = action.payload;
    },
    setEmitEvent(state, action: PayloadAction<(type: ISocketEvent, payload: unknown) => void>) {
      state.emitEvent = action.payload;
    },
  },
});

export const { setSocket, setEmitEvent } = socketSlice.actions;
export default socketSlice.reducer;
