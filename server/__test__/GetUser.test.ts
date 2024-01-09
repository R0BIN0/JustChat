import req from "supertest";
import app from "../src/app.js";
import { User } from "../src/models/User.js";
import { mockedUser } from "../src/test/utils/mockedUser.js";
const ROUTE = "/api/v1";

jest.mock("../src/middleware/authenticateToken.js", () => ({
  authenticateToken: jest.fn().mockImplementation((req, res, next) => next()),
}));

describe("POST /user", () => {
  it("Successful request", async () => {
    User.findById = jest.fn().mockReturnValue(Promise.resolve(mockedUser({ isOnline: true })));
    const res = await req(app).post(`${ROUTE}/user`).send({ _id: "id" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({ user: mockedUser({ isOnline: true }) });
  });

  it("No user found with this id", async () => {
    User.findById = jest.fn().mockReturnValue(Promise.resolve(undefined));
    const res = await req(app).post(`${ROUTE}/user`).send({ _id: "id" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({
      error: {
        code: 2001,
        message: "No user found with this ID",
        status: 400,
      },
    });
  });
});
