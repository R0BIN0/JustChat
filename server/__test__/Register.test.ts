import req from "supertest";
import app from "../src/app.js";
import { User } from "../src/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IErrorCode } from "../src/types/IErrorCode.js";
import { IStatusCode } from "../src/types/IStatusCode.js";
import { mockedUsers } from "../src/test/utils/mockedUsers.js";
import { IError } from "../src/types/IError.js";
import { mockedUser } from "../src/test/utils/mockedUser.js";
const ROUTE = "/api/v1";

beforeAll(() => {
  process.env.JWT_SECRET = "azerty";
});

afterAll(() => {
  process.env.JWT_SECRET = undefined;
});

describe("POST /register", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Successful request", async () => {
    User.findOne = jest.fn().mockReturnValue(false);
    User.create = jest.fn().mockImplementation(() => mockedUser({ isOnline: true }));
    bcrypt.compare = jest.fn().mockReturnValue(true);
    bcrypt.hash = jest.fn().mockReturnValue("HashedPassword");
    jwt.sign = jest.fn().mockReturnValue("TOKEN");
    const res = await req(app).post(`${ROUTE}/register`).send({
      name: "Robin",
      email: "test@gmail.com",
      password: "azerty",
      confirmPassword: "azerty",
      pictureId: 1,
      online: true,
    });
    expect(res.statusCode).toBe(IStatusCode.CREATED);
    expect(res.body).toStrictEqual({ token: "TOKEN", user: mockedUser({ isOnline: true }) });
  });

  it("Email not provided", async () => {
    const res = await req(app)
      .post(`${ROUTE}/register`)
      .send({ name: "Robin", email: "", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });

  it("Name not provided", async () => {
    const res = await req(app)
      .post(`${ROUTE}/register`)
      .send({ name: "", email: "test@gmail.com", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });

  it("Password not provided", async () => {
    const res = await req(app)
      .post(`${ROUTE}/register`)
      .send({ name: "Robin", email: "test@gmail.com", password: "", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });

  it("Confirm Password not provided", async () => {
    const res = await req(app)
      .post(`${ROUTE}/register`)
      .send({ name: "Robin", email: "test@gmail.com", password: "azerty", confirmPassword: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });

  it("A User has already this userName", async () => {
    User.findOne = jest.fn().mockReturnValue(mockedUser);
    const res = await req(app)
      .post(`${ROUTE}/register`)
      .send({ name: "Robin", email: "test@gmail.com", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: {
        code: IErrorCode.NAME_ALREADY_USED,
        message: "This name is already used",
        status: IStatusCode.BAD_REQUEST,
      },
    });
  });

  it("Password and Confirm password are not the same", async () => {
    User.findOne = jest.fn().mockReturnValue(false);
    const res = await req(app)
      .post(`${ROUTE}/register`)
      .send({ name: "Robin", email: "test@gmail.com", password: "anotherOne", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: {
        code: IErrorCode.CANNOT_CONFIRM_PASSWORD,
        message: "Passwords are not the same",
        status: IStatusCode.BAD_REQUEST,
      },
    });
  });

  it("Cannot Hash correctly the User password", async () => {
    User.findOne = jest.fn().mockReturnValue(false);
    bcrypt.hash = jest.fn().mockReturnValue(false);
    const res = await req(app)
      .post(`${ROUTE}/register`)
      .send({ name: "Robin", email: "test@gmail.com", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: {
        code: IErrorCode.UNEXCPECTED_ERROR,
        message: "Unexpected Error",
        status: IStatusCode.BAD_REQUEST,
      },
    });
  });

  it("Cannot create User in the DB", async () => {
    User.findOne = jest.fn().mockReturnValue(false);
    bcrypt.hash = jest.fn().mockReturnValue("HashedPassword");
    User.create = jest.fn().mockReturnValue(false);
    const res = await req(app)
      .post(`${ROUTE}/register`)
      .send({ name: "Robin", email: "test@gmail.com", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: {
        code: IErrorCode.CANNOT_CREATE_USER,
        message: "Not able to create User",
        status: IStatusCode.BAD_REQUEST,
      },
    });
  });

  it("Cannot generate user token", async () => {
    User.findOne = jest.fn().mockReturnValue(false);
    bcrypt.hash = jest.fn().mockReturnValue("HashedPassword");
    bcrypt.compare = jest.fn().mockReturnValue(true);
    User.create = jest.fn().mockReturnValue(mockedUser);
    const res = await req(app)
      .post(`${ROUTE}/register`)
      .send({ name: "Robin", email: "test@gmail.com", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.CANNOT_GET_JWT_TOKEN, message: "Cannot get User Token", status: IStatusCode.NOT_FOUND },
    });
  });
});
