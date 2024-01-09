import { User } from "../src/models/User.js";
import req from "supertest";
import app from "../src/app.js";
import { mockedUsers } from "../src/test/utils/mockedUsers.js";
const ROUTE = "/api/v1";

jest.mock("../src/middleware/authenticateToken.js", () => ({
  authenticateToken: jest.fn().mockImplementation((req, res, next) => next()),
}));

describe("GET /users/all", () => {
  it("Successful request (0 User)", async () => {
    const usersToFetch = 0;
    const userId = "userId";
    const search = "";
    const start = 0;
    const limit = 10;
    User.countDocuments = jest.fn().mockReturnValue(usersToFetch);
    User.find = jest.fn().mockImplementation((q) => ({
      skip: jest.fn().mockImplementation((s) => ({
        limit: jest.fn().mockReturnValue(mockedUsers(usersToFetch)),
      })),
    }));
    const res = await req(app).get(`${ROUTE}/users/all?userId=${userId}&search=${search}&start=${start}&limit=${limit}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({
      users: [],
      total: 0,
    });
  });

  it("Successful request (1 User)", async () => {
    const usersToFetch = 1;
    const userId = "userId";
    const search = "";
    const start = 0;
    const limit = 10;
    User.countDocuments = jest.fn().mockReturnValue(usersToFetch);
    User.find = jest.fn().mockImplementation((q) => ({
      skip: jest.fn().mockImplementation((s) => ({
        limit: jest.fn().mockReturnValue(mockedUsers(usersToFetch)),
      })),
    }));
    const res = await req(app).get(`${ROUTE}/users/all?userId=${userId}&search=${search}&start=${start}&limit=${limit}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toStrictEqual({
      users: [
        {
          name: "User1",
          email: "user1@example.com",
          online: true,
          _id: "1",
          pictureId: 1,
        },
      ],
      total: 1,
    });
  });
});
