import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const encryptPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
export const passwordIsValid = async (
  password: string,
  userPassword: string
) => {
  return await bcrypt.compare(password, userPassword);
};

export const getAuthenticatedToken = (name: string, email: string) => {
  return jwt.sign({ name, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
