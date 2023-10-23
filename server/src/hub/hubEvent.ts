import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";
import { IMessage } from "../types/IMessage.js";
import { ISocketEvent } from "../types/ISocketEvent.js";
import { IUser } from "../types/IUser.js";
import WebSocket from "ws";

let clients: { userId: string; client: WebSocket }[] = [];

export const userIsConnected = (ws: WebSocket, user: IUser) => {
  const { _id } = user;
  const isHere = clients.find((item) => item.userId === _id);
  if (isHere) return;
  const client = { userId: _id, client: ws };
  clients.push(client);
  const event = { type: ISocketEvent.USER_IS_CONNECTED, data: user };
  sendToClient(event, "ALL");
};
export const userIsDisconnected = async (user: IUser) => {
  const { _id } = user;
  if (!_id) return;
  clients = clients.filter((item) => item.userId !== _id);
  await User.findOneAndUpdate({ _id }, { online: false });
  const event = { type: ISocketEvent.USER_IS_DISCONNECTED, data: user };
  sendToClient(event, "ALL");
};

export const sendMessage = async (message: IMessage) => {
  const chat = await Chat.findOne({ _id: message.conversationId });
  if (!chat) return;
  delete message["conversationId"];
  chat.messages.push(message);
  chat.save();
  const event = { type: ISocketEvent.SEND_MESSAGE, data: message };
  sendToClient(event, [message.receiver]);
};

const sendToClient = (evt: { type: ISocketEvent; data: unknown }, target: string[] | "ALL") => {
  let clientsToSend: WebSocket[] = [];

  if (target === "ALL") {
    clientsToSend = clients.map((item) => item.client);
  } else {
    const getIds = clients.filter((item) => target.includes(item.userId));
    clientsToSend = getIds.map((item) => item.client);
  }

  clientsToSend.forEach((c) => {
    if (c.readyState !== 1) return;
    c.send(JSON.stringify(evt));
  });
};
