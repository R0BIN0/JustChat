import { Chat } from "../models/Chat.js";
import { User } from "../models/User.js";
import { IMessage } from "../types/IMessage.js";
import { ISocketEvent } from "../types/ISocketEvent.js";
import { IUser } from "../types/IUser.js";
import WebSocket from "ws";

let clients: { userId: string; client: WebSocket }[] = [];

/**
 * This function is used to handle user connection
 * @param {WebSocket} ws - Websocket event
 * @param {IUser} user - Concerned user
 * @returns {void}
 */
export const userIsConnected = (ws: WebSocket, user: IUser): void => {
  const { _id } = user;
  const isHere = clients.find((item) => item.userId === _id);
  if (isHere) return;
  const client = { userId: _id, client: ws };
  clients.push(client);
  const event = { type: ISocketEvent.USER_IS_CONNECTED, data: user };
  sendToClient(event, "ALL");
};

/**
 * This function is used to handle user diconnection
 * @param {IUser} user - Concerned user
 * @returns {Promise<void>}
 */
export const userIsDisconnected = async (user: IUser): Promise<void> => {
  const { _id } = user;
  if (!_id) return;
  clients = clients.filter((item) => item.userId !== _id);
  await User.findOneAndUpdate({ _id }, { online: false });
  const event = { type: ISocketEvent.USER_IS_DISCONNECTED, data: user };
  sendToClient(event, "ALL");
};

/**
 * This function is used to handle user update
 * @param {IUser} user - Concerned user
 * @returns {void}
 */
export const userUpdate = (user: IUser): void => {
  const { _id } = user;
  if (!_id) return;
  const filterCaller = clients.filter((item) => item.userId !== _id);
  const userIds = filterCaller.map((item) => item.userId);
  const event = { type: ISocketEvent.USER_UDPATE, data: user };
  sendToClient(event, userIds);
};

/**
 * This function is used to handle user delete account
 * @param {IUser} user - Concerned user
 * @returns {void}
 */
export const userDelete = (user: IUser): void => {
  const { _id } = user;
  if (!_id) return;
  const filterCaller = clients.filter((item) => item.userId !== _id);
  const userIds = filterCaller.map((item) => item.userId);
  const event = { type: ISocketEvent.USER_DELETE, data: user };
  sendToClient(event, userIds);
};

/**
 * This function is used to handle send message between 2 users
 * @param {IMessage} message - Message informations
 * @returns {Promise<void>}
 */
export const sendMessage = async (message: IMessage): Promise<void> => {
  const chat = await Chat.findOne({ _id: message.conversationId });
  if (!chat) return;
  delete message["conversationId"];
  chat.messages.push(message);
  chat.save();
  const event = { type: ISocketEvent.SEND_MESSAGE, data: message };
  sendToClient(event, [message.receiver]);
};

/**
 * This function is used to send events to concerned users
 * @param {{ type: ISocketEvent; data: unknown }} evt - Event type and associated datas
 * @param {string[] | "ALL"} target - To know who we should notify
 * @returns {void}
 */
const sendToClient = (evt: { type: ISocketEvent; data: unknown }, target: string[] | "ALL"): void => {
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
