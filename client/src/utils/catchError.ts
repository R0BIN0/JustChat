import { IError } from "../apis/IError";
import { IErrorCode } from "../apis/IErrorCode";
import { IStatusCode } from "../apis/IStatusCode";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const catchError = (err: any): IError => {
  let error: IError;
  if (err.response) {
    const { message, code, status } = err.response.data.error;
    error = { message, code, status };
  } else if (err.request) {
    error = { message: "Unexpected Error", code: IErrorCode.UNEXCPECTED_ERROR, status: IStatusCode.BAD_REQUEST };
  } else {
    error = { message: "Unexpected Error", code: IErrorCode.UNEXCPECTED_ERROR, status: IStatusCode.BAD_REQUEST };
  }
  error = { ...error, message: getMessageError(error.code) };
  return error;
};

const getMessageError = (err: IErrorCode): string => {
  const defaultMessage = "Une erreur est survenue. Veuillez réessayer ultérieurement.";
  let message = defaultMessage;
  switch (err) {
    case IErrorCode.EMPTY_INPUT:
      message = "Le formulaire que vous avez envoyé est incorrect.";
      break;
    case IErrorCode.USER_NOT_FOUND:
      message = "Adresse mail incorrect.";
      break;
    case IErrorCode.INVALID_PASSWORD:
      message = "Mot de passe incorrect.";
      break;
    case IErrorCode.CANNOT_GET_JWT_TOKEN:
      message = "Impossible de vous authentifier. Réessayer ultérieurement.";
      break;
  }
  return message;
};
