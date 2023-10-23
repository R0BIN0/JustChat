import { IMessage } from "./IMessage.js";

export type IChat = {
  createdAt: Date;
  _id: string;
  messages: IMessage[];
};
