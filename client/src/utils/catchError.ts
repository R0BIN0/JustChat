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
  switch (err) {
    case IErrorCode.EMPTY_INPUT:
      return "Le formulaire que vous avez envoyé est incorrect.";
    case IErrorCode.USER_NOT_FOUND:
      return "Adresse mail incorrect.";
    case IErrorCode.INVALID_PASSWORD:
      return "Mot de passe incorrect.";
    case IErrorCode.CANNOT_GET_JWT_TOKEN:
      return "Impossible de vous authentifier. Réessayer ultérieurement.";
    case IErrorCode.CANNOT_CONFIRM_PASSWORD:
      return "La confirmation de vos mots de passe est invalide.";
    case IErrorCode.CANNOT_CREATE_USER:
      return "Impossible de créer l'utilisateur. Veuillez réessayer plus tard.";
    case IErrorCode.NAME_ALREADY_USED:
      return "Ce nom d'utilisateur est déjà utilisé.";
    case IErrorCode.SAME_EMAIL:
      return "Cet email est déjà utilisé.";
    case IErrorCode.WRONG_MAIL_FORMAT:
      return "Votre adresse mail est invalide";
    case IErrorCode.NO_USER:
      return "Aucun utilisateur n'a été trouvé.";
    case IErrorCode.CANNOT_CREATE_CHAT:
      return "Impossible d'établir la communication. Veuillez recharger la page.";
    case IErrorCode.NO_CHAT_FOUND:
      return "Impossible d'établir la communication. Veuillez recharger la page.";
    case IErrorCode.USERS_NOT_FOUND:
      return "Impossible d'établir la communication. Veuillez recharger la page.";
    default:
      return "Une erreur est survenue. Veuillez réessayer ultérieurement.";
  }
};
