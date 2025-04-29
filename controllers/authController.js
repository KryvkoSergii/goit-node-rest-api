import { usersService } from "../services/usersServices.js";
import { NotFoundError } from "../helpers/NotFoundError.js";
import { EmailAlreadyExistsError } from "../helpers/EmailAlreadyExistsError.js";
import { passwordService } from "../services/passwordService.js";
import jwt from "jsonwebtoken";
import { errorBody, userObject } from "./responseModels.js";
import {
  retrieveAvatarUrlForNewUser,
  moveFileToNewDestination,
  removeFile,
} from "../services/fileService.js";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationLetter } from "../services/emailService.js";

function handleError(res, err) {
  if (err instanceof NotFoundError) {
    return res.status(404).json(errorBody(err.message));
  } else if (err instanceof EmailAlreadyExistsError) {
    return res.status(409).json(errorBody(err.message));
  } else {
    return res.status(500).json(errorBody(err.message));
  }
}

function getBaseUrl(req) {
  return `${req.protocol}://${req.get("host")}`;
}

function buildAvatarUrl(req, relativePath) {
  return relativePath ? `${getBaseUrl(req)}${relativePath}` : null;
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

    if (!usr.verify) {
      res.status(401).json(errorBody("Email not verified"));
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
      user: userObject(
        usr.email,
        usr.subscription,
        buildAvatarUrl(req, usr.avatarURL)
      ),
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

export const registerUser = async (req, res) => {
  const email = req.body.email;
  const plainPassword = req.body.password;

  const relativePath = await retrieveAvatarUrlForNewUser(email);
  const verificationToken = uuidv4();

  usersService
    .create(email, plainPassword, relativePath, verificationToken)
    .then((usr) => {
      emailService.sendVerificationLetter(
        usr.email,
        getBaseUrl(req),
        verificationToken
      );
      res.status(201).json({
        user: userObject(
          usr.email,
          usr.subscription,
          buildAvatarUrl(req, usr.avatarURL)
        ),
      });
    })
    .catch((err) => handleError(res, err));
};

export const currentUser = (req, res) => {
  // getting user from request object context
  const usr = req.user;
  res
    .status(201)
    .json(
      userObject(
        usr.email,
        usr.subscription,
        buildAvatarUrl(req, usr.avatarURL)
      )
    );
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
      res
        .status(200)
        .json(
          userObject(
            usr.email,
            usr.subscription,
            buildAvatarUrl(req, usr.avatarURL)
          )
        )
    )
    .catch((err) => handleError(res, err));
};

export const updateAvatar = async (req, res, next) => {
  const user = req.user;
  const { path: temporaryName } = req.file;

  const newPath = await moveFileToNewDestination(temporaryName)
    .then((fileName) => {
      return fileName;
    })
    .catch((err) => {
      fs.unlink(temporaryName, (err) => {
        if (err) {
          return next(err);
        }
      });
      return next(err);
    });
  usersService
    .updateAvatar(user.id, newPath)
    .then((usr) => {
      removeFile(user.avatarURL).catch((err) => console.log(err));
      res
        .status(200)
        .json(
          userObject(
            usr.email,
            usr.subscription,
            buildAvatarUrl(req, usr.avatarURL)
          )
        );
    })
    .catch((err) => handleError(res, err));
};

export const verifyUser = (req, res) => {
  const { verificationToken } = req.params;
  usersService
    .verifyUser(verificationToken)
    .then(() => res.status(200).json({ message: "Verification successful" }))
    .catch((err) => handleError(res, err));
};

export const resendVerificationEmail = (req, res) => {
  const { email } = req.body;
  usersService
    .getByEmail(email)
    .then(async (usr) => {
      if (usr.verify) {
        return res
          .status(400)
          .json(errorBody("Verification has already been passed"));
      }

      const verificationToken = !usr.verificationToken
        ? uuidv4()
        : usr.verificationToken;

      usersService.updateVerificationToken(email, verificationToken);
      await sendVerificationLetter(
        usr.email,
        getBaseUrl(req),
        verificationToken
      );
      return res.status(200).json({ message: "Verification email sent" });
    })
    .catch((err) => handleError(res, err));
};
