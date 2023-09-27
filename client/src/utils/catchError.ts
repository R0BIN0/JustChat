/* eslint-disable @typescript-eslint/no-explicit-any */
export const catchError = (err: any): string => {
  let message: string;
  if (err.response) {
    message = err.response.data.error;
  } else if (err.request) {
    message = err.request;
  } else {
    message = err.message;
  }
  return message || "Une erreur est survenue.";
};
