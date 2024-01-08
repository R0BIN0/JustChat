import { IUserDTO } from "../apis/IUserDTO";

export const generateMockedUsers = (count: number, isDisconnected?: boolean) => {
  const users: IUserDTO[] = [];
  for (let i = 1; i <= count; i++) {
    users.push(buildUser(i, isDisconnected));
  }
  return users;
};

const buildUser = (idx: number, isDisconnected?: boolean): IUserDTO => {
  return {
    name: `User${idx}`,
    email: `user${idx}@example.com`,
    online: isDisconnected === undefined,
    _id: String(idx),
    pictureId: idx,
  };
};
