/* eslint-disable @typescript-eslint/no-explicit-any */
export const catchError = (err: any): string => {
  let message: string;
  if (err.response) {
    message = err.response.data.error.message; // SHOULD BE MODFIED
  } else if (err.request) {
    message = err.request;
  } else {
    message = err.message;
  }
  return handleMessageError(message);
};

const handleMessageError = (msg: unknown): string => {
  const defaultMessage = "Une erreur est survenue.";
  if (!msg || typeof msg !== "string") return defaultMessage;
  return msg;
};
