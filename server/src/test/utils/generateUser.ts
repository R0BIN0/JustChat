import { IUser } from "../../types/IUser.js";

export const generateUser = (count: number, isDisconnected?: boolean): Omit<IUser, "password">[] => {
  const users: Omit<IUser, "password">[] = [];
  for (let i = 1; i <= count; i++) {
    const user = {
      name: `User${i}`,
      email: `user${i}@example.com`,
      online: isDisconnected === undefined,
      _id: String(i),
      pictureId: i,
    };
    users.push(user);
  }
  return users;
};
