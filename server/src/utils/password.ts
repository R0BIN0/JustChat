import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const encryptPassword = async (password: string): Promise<string> => await bcrypt.hash(password, 10);

export const passwordIsConfirmed = (password: string, confirmPassword: string) => password === confirmPassword;

export const passwordIsValid = async (password: string, userPassword: string): Promise<boolean> =>
  await bcrypt.compare(password, userPassword);

export const getAuthenticatedToken = (name: string, email: string): string => {
  try {
    if (!process.env.JWT_SECRET) throw "The environment is not initialized correctly";
    return jwt.sign({ name, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  } catch (err) {
    throw err;
  }
};
