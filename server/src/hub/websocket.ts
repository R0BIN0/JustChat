import WebSocket, { WebSocketServer } from "ws";
import { server } from "../app.js";
import { parseBuffer } from "../utils/parseBuffer.js";
import { ISocketEvent } from "../types/ISocketEvent.js";
import { IUser } from "../types/IUser.js";
import { userIsConnected, userIsDisconnected } from "./hubEvent.js";

export const initializeWebSocket = () => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    ws.on("message", async (buffer, isBinary) => {
      const { type, evt } = parseBuffer(buffer);
      onEvent(ws, type, evt);
    });
  });
};

const onEvent = (ws: WebSocket, type: ISocketEvent, evt: unknown) => {
  switch (type) {
    case ISocketEvent.USER_IS_CONNECTED:
      userIsConnected(ws, evt as IUser);
      break;
    case ISocketEvent.USER_IS_DISCONNECTED:
      userIsDisconnected(evt as IUser);
      break;
    default:
      break;
  }
};
