import req from "supertest";
import app from "../src/app.js";
import { User } from "../src/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IErrorCode } from "../src/types/IErrorCode.js";
import { IStatusCode } from "../src/types/IStatusCode.js";

const mockedUser = {
  name: "Robin",
  email: "test@gmail.com",
  password: "hello",
};

beforeAll(() => {
  process.env.JWT_SECRET = "azerty";
});

afterAll(() => {
  process.env.JWT_SECRET = undefined;
});

describe("POST /login", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Successful request", async () => {
    User.findOne = jest.fn().mockImplementation(() => Promise.resolve(mockedUser));
    bcrypt.compare = jest.fn().mockReturnValue(true);
    jwt.sign = jest.fn().mockReturnValue("TOKEN");
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "hello" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({ token: "TOKEN" });
  });

  it("Email not provided", async () => {
    const res = await req(app).post("/api/v1/login").send({ email: "", password: "hello" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });
  it("Password not provided", async () => {
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });
  it("Cannot find user", async () => {
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "hello" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.USER_NOT_FOUND, message: "No User found", status: IStatusCode.NOT_FOUND },
    });
  });
  it("Password is wrong", async () => {
    User.findOne = jest.fn().mockImplementation(() => Promise.resolve(mockedUser));
    bcrypt.compare = jest.fn().mockReturnValue(false);
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "hello" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.INVALID_PASSWORD, message: "Password is invalid", status: IStatusCode.BAD_REQUEST },
    });
  });
  it("Cannot generate user token", async () => {
    User.findOne = jest.fn().mockImplementation(() => Promise.resolve(mockedUser));
    bcrypt.compare = jest.fn().mockReturnValue(true);
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "hello" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.CANNOT_GET_JWT_TOKEN, message: "Cannot get User Token", status: IStatusCode.NOT_FOUND },
    });
  });
  it("handle unexpected errors", async () => {
    User.findOne = jest.fn().mockImplementation(() => Promise.reject(new Error("Unexpected Error")));
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "hello" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.UNEXCPECTED_ERROR, message: "Unexpected Error", status: IStatusCode.BAD_REQUEST },
    });
  });
});
