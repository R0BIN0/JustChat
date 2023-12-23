import { IUser } from "../../apis/IUser";

export type IQueryUser = {
  pages: {
    users: IUser[];
    total: number;
  }[];
  pageParams: (undefined | number)[];
};
