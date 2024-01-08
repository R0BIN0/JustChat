import { IErrorCode } from "../apis/IErrorCode";

export const getError = (
  errCode: IErrorCode | undefined
): {
  passwordError: boolean;
  emailError: boolean;
  nameError: boolean;
  confirmPasswordError: boolean;
  unexcpectedError: boolean;
} => {
  const values = {
    passwordError: false,
    emailError: false,
    nameError: false,
    confirmPasswordError: false,
    unexcpectedError: false,
  };
  if (!errCode) return values;
  if (errCode === IErrorCode.NAME_ALREADY_USED) values.nameError = true;
  if (errCode === IErrorCode.INVALID_PASSWORD || errCode === IErrorCode.CANNOT_CONFIRM_PASSWORD) values.passwordError = true;
  if (errCode === IErrorCode.USER_NOT_FOUND || errCode === IErrorCode.SAME_EMAIL || errCode === IErrorCode.WRONG_MAIL_FORMAT)
    values.emailError = true;
  if (errCode === IErrorCode.UNEXCPECTED_ERROR || errCode === IErrorCode.CANNOT_CREATE_USER) values.unexcpectedError = true;
  return values;
};
