jest.mock("../services/usersServices.js");
jest.mock("../services/passwordService.js");
jest.mock("jsonwebtoken");
jest.mock("../services/fileService.js");
jest.mock("../db/models/User.js", () => ({
  User: {
    init: jest.fn(),
  },
}));
jest.mock("../helpers/fileValidator.js", () => ({
  ensureDirExists : jest.fn().mockReturnValue("./temp"),
}))

import { loginUser } from "./authController.js";
import { usersService } from "../services/usersServices.js";
import { passwordService } from "../services/passwordService.js";
import jwt from "jsonwebtoken";
import {ensureDirExists} from "../helpers/fileValidator.js";

describe("loginUser", () => {

  test("should return 200 and user data on successful login", async () => {
    //given
    const email = "some_email@example.com";
    const password = "some_password";
    const token = "mocked_token";

    const req = {
      body: {
        email,
        password,
      },
      protocol: "http",
      get(something) {
        return "localhost:3000";
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(), // Mock `res.status()` to return `res` for chaining
      json: jest.fn(), // Mock `res.json()`
    };

    //when
    usersService.getByEmail = jest.fn().mockResolvedValue({
      id: 1,
      email: email,
      password: "hashed_password",
      subscription: "starter",
      avatarURL: "/path/to/avatar.jpg",
    });
    passwordService.comparePassword = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue(token);

    // then
    await loginUser(req, res);

    // Assertions
    expect(usersService.getByEmail).toHaveBeenCalledWith(
      "some_email@example.com"
    );
    expect(passwordService.comparePassword).toHaveBeenCalledWith(
      "some_password",
      "hashed_password"
    );
    expect(usersService.update).toHaveBeenCalledWith(
      "some_email@example.com",
      null,
      "mocked_token"
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: "mocked_token",
      user: {
        email: "some_email@example.com",
        subscription: "starter",
        avatarURL: "http://localhost:3000/path/to/avatar.jpg",
      },
    });
  });
});
