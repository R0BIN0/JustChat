export enum IErrorCode {
  // Global errors (0 -> 1000)
  UNEXCPECTED_ERROR = 1,
  // Auth (1000 -> 2000)
  USER_NOT_FOUND = 1000,
  INVALID_PASSWORD = 1001,
  CANNOT_GET_JWT_TOKEN = 1002,
  EMPTY_INPUT = 1003,
}
