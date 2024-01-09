import req from "supertest";
import app from "../src/app.js";
import { User } from "../src/models/User.js";
import { mockedUser } from "../src/test/utils/mockedUser.js";
const ROUTE = "/api/v1";

jest.mock("../src/middleware/authenticateToken.js", () => ({
  authenticateToken: jest.fn().mockImplementation((req, res, next) => next()),
}));

describe("PUT /user/delete", () => {
  it("Successful request", async () => {
    User.findOneAndDelete = jest.fn().mockReturnValue(Promise.resolve(true));
    const res = await req(app).put(`${ROUTE}/user/delete`).send({ _id: "id" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({ success: true });
  });
});
