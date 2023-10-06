import { IUser } from "../apis/IUser";

export type IConnectedUser = Omit<IUser, "password"> & {
  pictureId: number;
  online: boolean;
};
