import req from "supertest";
import app from "../src/app.js";
import { User } from "../src/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IErrorCode } from "../src/types/IErrorCode.js";
import { IStatusCode } from "../src/types/IStatusCode.js";

const mockedUser: { name: string; email: string; password?: string } = {
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

describe("POST /register", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Successful request", async () => {
    User.findOne = jest.fn().mockReturnValue(false);
    User.create = jest.fn().mockImplementation(() => mockedUser);
    bcrypt.compare = jest.fn().mockReturnValue(true);
    bcrypt.hash = jest.fn().mockReturnValue("HashedPassword");
    jwt.sign = jest.fn().mockReturnValue("TOKEN");
    const res = await req(app)
      .post("/api/v1/register")
      .send({ name: "Robin", email: "test@gmail.com", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(IStatusCode.CREATED);
    delete mockedUser["password"];
    expect(res.body).toStrictEqual({ token: "TOKEN", user: mockedUser });
  });

  it("Email not provided", async () => {
    const res = await req(app)
      .post("/api/v1/register")
      .send({ name: "Robin", email: "", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });

  it("Name not provided", async () => {
    const res = await req(app)
      .post("/api/v1/register")
      .send({ name: "", email: "test@gmail.com", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });

  it("Password not provided", async () => {
    const res = await req(app)
      .post("/api/v1/register")
      .send({ name: "Robin", email: "test@gmail.com", password: "", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });

  it("Confirm Password not provided", async () => {
    const res = await req(app)
      .post("/api/v1/register")
      .send({ name: "Robin", email: "test@gmail.com", password: "azerty", confirmPassword: "" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.EMPTY_INPUT, message: "Inputs are empty", status: IStatusCode.BAD_REQUEST },
    });
  });
  0;

  it("A User has already this userName", async () => {
    User.findOne = jest.fn().mockReturnValue(mockedUser);
    const res = await req(app)
      .post("/api/v1/register")
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
      .post("/api/v1/register")
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
      .post("/api/v1/register")
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
      .post("/api/v1/register")
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
      .post("/api/v1/register")
      .send({ name: "Robin", email: "test@gmail.com", password: "azerty", confirmPassword: "azerty" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.CANNOT_GET_JWT_TOKEN, message: "Cannot get User Token", status: IStatusCode.NOT_FOUND },
    });
  });
});

describe("POST /login", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("Successful request", async () => {
    const mockReturnObject = {
      select: jest.fn().mockReturnValue(Promise.resolve(mockedUser)),
    };
    User.findOne = jest.fn().mockReturnValue(mockReturnObject);

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
    User.findOne = jest.fn().mockReturnValue({ select: jest.fn() });
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "hello" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.USER_NOT_FOUND, message: "No User found", status: IStatusCode.NOT_FOUND },
    });
  });
  it("Password is wrong", async () => {
    const mockReturnObject = {
      select: jest.fn().mockReturnValue(Promise.resolve(mockedUser)),
    };
    User.findOne = jest.fn().mockReturnValue(mockReturnObject);
    bcrypt.compare = jest.fn().mockReturnValue(false);
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "hello" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.INVALID_PASSWORD, message: "Password is invalid", status: IStatusCode.BAD_REQUEST },
    });
  });
  it("Cannot generate user token", async () => {
    const mockReturnObject = {
      select: jest.fn().mockReturnValue(Promise.resolve(mockedUser)),
    };
    User.findOne = jest.fn().mockReturnValue(mockReturnObject);
    bcrypt.compare = jest.fn().mockReturnValue(true);
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "hello" });
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.CANNOT_GET_JWT_TOKEN, message: "Cannot get User Token", status: IStatusCode.NOT_FOUND },
    });
  });

  it("handle unexpected errors", async () => {
    const mockReturnObject = {
      select: jest.fn().mockImplementation(() => {
        throw new Error("Unexpected Error");
      }),
    };
    User.findOne = jest.fn().mockReturnValue(mockReturnObject);
    const res = await req(app).post("/api/v1/login").send({ email: "test@gmail.com", password: "hello" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: { code: IErrorCode.UNEXCPECTED_ERROR, message: "Unexpected Error", status: IStatusCode.BAD_REQUEST },
    });
  });
});
