import { ISocketEvent } from "../apis/ISocketEvent";

export const parseSocketEvent = (event: any): { type: ISocketEvent; data: unknown } => JSON.parse(event.data);
