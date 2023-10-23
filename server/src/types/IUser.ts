import { IUserDTO } from "./IUserDTO.js";

export type IUser = IUserDTO & {
  password: string;
  conversationIds: string[];
};
