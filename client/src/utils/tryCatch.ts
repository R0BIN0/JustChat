import { catchError } from "./catchError";

// eslint-disable-next-line @typescript-eslint/ban-types
export const tryCatch = (callback: Function) => async (data: unknown) => {
  try {
    return await callback(data);
  } catch (err) {
    throw catchError(err);
  }
};
