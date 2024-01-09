import req from "supertest";
import app from "../src/app.js";
import { User } from "../src/models/User.js";
import { mockedUser } from "../src/test/utils/mockedUser.js";
const ROUTE = "/api/v1";

jest.mock("../src/middleware/authenticateToken.js", () => ({
  authenticateToken: jest.fn().mockImplementation((req, res, next) => next()),
}));

describe("PUT /user/update", () => {
  it("Successful request", async () => {
    User.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
    User.findOneAndUpdate = jest.fn().mockReturnValue(Promise.resolve(mockedUser({ isOnline: true })));
    const res = await req(app)
      .put(`${ROUTE}/user/update`)
      .send({ _id: "id", name: "user", email: "test@gmail.com", pictureId: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({ success: true });
  });

  it("No name provided", async () => {
    User.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
    User.findOneAndUpdate = jest.fn().mockReturnValue(Promise.resolve(mockedUser({ isOnline: true })));
    const res = await req(app).put(`${ROUTE}/user/update`).send({ _id: "id", name: "", email: "test@gmail.com", pictureId: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: {
        code: 1003,
        message: "Inputs are empty",
        status: 400,
      },
    });
  });

  it("No email provided", async () => {
    User.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
    User.findOneAndUpdate = jest.fn().mockReturnValue(Promise.resolve(mockedUser({ isOnline: true })));
    const res = await req(app).put(`${ROUTE}/user/update`).send({ _id: "id", name: "user", email: "", pictureId: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: {
        code: 1003,
        message: "Inputs are empty",
        status: 400,
      },
    });
  });

  it("Find a user with same name/email", async () => {
    User.findOne = jest.fn().mockReturnValue(Promise.resolve(mockedUser({ isOnline: true })));
    User.findOneAndUpdate = jest.fn().mockReturnValue(Promise.resolve(mockedUser({ isOnline: true })));
    const res = await req(app)
      .put(`${ROUTE}/user/update`)
      .send({ _id: "id", name: "user", email: "test@gmail.com", pictureId: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: {
        code: 1006,
        message: "This name is already used",
        status: 400,
      },
    });
  });

  it("User to update not found", async () => {
    User.findOne = jest.fn().mockReturnValue(Promise.resolve(undefined));
    User.findOneAndUpdate = jest.fn().mockReturnValue(Promise.resolve(undefined));
    const res = await req(app)
      .put(`${ROUTE}/user/update`)
      .send({ _id: "id", name: "user", email: "test@gmail.com", pictureId: 1 });
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({
      error: {
        code: 1000,
        message: "No User found",
        status: 404,
      },
    });
  });
});
