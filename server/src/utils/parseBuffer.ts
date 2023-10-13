import { ISocketEvent } from "../types/ISocketEvent.js";

export const parseBuffer = (buffer: any): { type: ISocketEvent; evt: unknown } => {
  const jsonString = buffer.toString("utf8");
  return JSON.parse(jsonString);
};
