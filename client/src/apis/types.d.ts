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
    export * from "IStatusCode";
    export * from "IUser";
}
