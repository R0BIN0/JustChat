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
  const map = {
    [IErrorCode.EMPTY_INPUT]: "Le formulaire que vous avez envoyé est incorrect.",
    [IErrorCode.USER_NOT_FOUND]: "Adresse mail incorrect.",
    [IErrorCode.INVALID_PASSWORD]: "Mot de passe incorrect.",
    [IErrorCode.CANNOT_GET_JWT_TOKEN]: "Impossible de vous authentifier. Réessayer ultérieurement.",
    [IErrorCode.CANNOT_CONFIRM_PASSWORD]: "La confirmation de vos mots de passe est invalide.",
    [IErrorCode.CANNOT_CREATE_USER]: "Impossible de créer l'utilisateur. Veuillez réessayer plus tard.",
    [IErrorCode.NAME_ALREADY_USED]: "Ce nom d'utilisateur est déjà utilisé.",
    [IErrorCode.SAME_EMAIL]: "Cet email est déjà utilisé.",
    [IErrorCode.WRONG_MAIL_FORMAT]: "Votre adresse mail est invalide.",
    [IErrorCode.NO_USER]: "Aucun utilisateur n'a été trouvé.",
    [IErrorCode.CANNOT_CREATE_CHAT]: "Impossible d'établir la communication. Veuillez recharger la page.",
    [IErrorCode.NO_CHAT_FOUND]: "Impossible d'établir la communication. Veuillez recharger la page.",
    [IErrorCode.USERS_NOT_FOUND]: "Impossible d'établir la communication. Veuillez recharger la page.",
    [IErrorCode.UNAUTHORIZED]: "Vous n'êtes pas autoriser à vous rendre ici.",
    [IErrorCode.UNEXCPECTED_ERROR]: "Une erreur est survenue. Veuillez réessayer ultérieurement.",
  };
  return map[err] ?? "Une erreur est survenue. Veuillez réessayer ultérieurement.";
};
