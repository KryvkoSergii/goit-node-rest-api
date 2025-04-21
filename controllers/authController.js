import { usersService } from "../services/usersServices.js";
import { NotFoundError } from "../helpers/NotFoundError.js";
import { EmailAlreadyExistsError } from "../helpers/EmailAlreadyExistsError.js";
import { passwordService } from "../services/passwordService.js";
import jwt from "jsonwebtoken";
import { errorBody, userObject } from "./responseModels.js";

function handleError(res, err) {
  if (err instanceof NotFoundError) {
    return res.status(404).json(errorBody(err.message));
  } else if (err instanceof EmailAlreadyExistsError) {
    return res.status(409).json(errorBody(err.message));
  } else {
    return res.status(500).json(errorBody(err.message));
  }
}

export const loginUser = async (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;

  try {
    const usr = await usersService.getByEmail(email);
    const match = await passwordService.comparePassword(
      plainPassword,
      usr.password
    );

    if (!match) {
      res.status(401).json(errorBody("Email or password is wrong"));
      return;
    }

    const payload = {
      id: usr.id,
      email: usr.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    await usersService.update(email, null, token);
    return res.status(200).json({
      token: token,
      user: userObject(usr.email, usr.subscription),
    });
  } catch (err) {
    handleError(res, err);
  }
};

export const logoutUser = (req, res) => {
  usersService
    .removeTokenFromUser(req.user.id)
    .then(() => res.status(204).json())
    .catch((err) => handleError(res, err));
};

export const registerUser = (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;

  usersService
    .create(email, plainPassword)
    .then((usr) =>
      res.status(201).json({ user: userObject(usr.email, usr.subscription) })
    )
    .catch((err) => handleError(res, err));
};

export const currentUser = (req, res) => {
  // getting user from request object context
  const usr = req.user;
  res.status(200).json(userObject(usr.email, usr.subscription));
};

export const changeUserSubscription = (req, res) => {
  const usr = req.user;
  if (usr.email !== req.body.email) {
    return res.status(401).json(errorBody("Not authorized"));
  }

  const subscription = req.body.subscription;
  usersService
    .update(usr.email, subscription)
    .then((usr) =>
      res.status(200).json(userObject(usr.email, usr.subscription))
    )
    .catch((err) => handleError(res, err));
};
