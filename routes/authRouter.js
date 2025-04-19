import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  changeUserSubscription,
} from "../controllers/authController.js";
import validateBody from "../helpers/validateBody.js";
import {
  createUserSchema,
  loginUserSchema,
  subscriptionUserSchema,
} from "../schemas/usersSchemas.js";
import { passportConfig } from "../middleware/passportConfig.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(createUserSchema), registerUser);

authRouter.post("/login", validateBody(loginUserSchema), loginUser);

authRouter.post("/logout", passportConfig.authenticate, logoutUser);

authRouter.post("/current", passportConfig.authenticate, currentUser);

authRouter.patch(
  "/subscription",
  validateBody(subscriptionUserSchema),
  passportConfig.authenticate,
  changeUserSubscription
);

export default authRouter;
