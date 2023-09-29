declare module "IErrroCode" {
    export enum IErrorCode {
        USER_NOT_FOUND = 1000,
        INVALID_PASSWORD = 1001,
        CANNOT_GET_JWT_TOKEN = 1002
    }
}
declare module "IStatusCode" {
    export enum IStatusCode {
        OK = 200,
        CREATED = 201,
        BAD_REQUEST = 400,
        UNAUTHORIZED = 401,
        NOT_FOUND = 404
    }
}
declare module "IUser" {
    export type IUser = {
        name: string;
        email: string;
        password: string;
    };
}
declare module "index" {
    export * from "IErrroCode";
    export * from "IStatusCode";
    export * from "IUser";
}
