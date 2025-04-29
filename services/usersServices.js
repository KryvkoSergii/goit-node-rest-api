import { User } from "../db/models/User.js";
const attributeList = [
  "id",
  "email",
  "subscription",
  "token",
  "password",
  "avatarURL",
  "verify",
  "verificationToken",
];
import { NotFoundError } from "../helpers/NotFoundError.js";
import { EmailAlreadyExistsError } from "../helpers/EmailAlreadyExistsError.js";
import { passwordService } from "./passwordService.js";

const notFoundError = new NotFoundError("Email or password is wrong");
const defaultSubscription = "starter";

async function getById(id) {
  return await User.findOne({
    where: {
      id: id,
    },
    attributes: attributeList,
  });
}

async function getByEmail(email) {
  return await getByEmailInner(email).then((user) => {
    if (!user) {
      throw notFoundError;
    }
    return user;
  });
}

async function getByEmailInner(email) {
  return await User.findOne({
    where: {
      email: email,
    },
    attributes: attributeList,
  });
}

async function create(email, password, avatarUrl, verificationToken) {
  const existingUser = await getByEmailInner(email);
  if (existingUser) {
    throw new EmailAlreadyExistsError("Email in use");
  }
  const hashedPassword = await passwordService.getHashedPassword(password);

  return await User.create({
    email,
    password: hashedPassword,
    subscription: defaultSubscription,
    avatarURL: avatarUrl,
    verify: false,
    verificationToken: verificationToken,
  });
}

async function update(email, subscription, token) {
  return await getByEmail(email).then((user) => {
    if (subscription) {
      user.subscription = subscription;
    }

    if (token) {
      user.token = token;
    }

    return user.save();
  });
}

async function updateVerificationToken(email, verificationToken) {
  return await getByEmail(email).then((user) => {
    user.verificationToken = verificationToken;
    return user.save();
  });
}

async function removeTokenFromUser(id) {
  return await getById(id).then((user) => {
    user.token = null;
    return user.save();
  });
}

async function updateAvatar(id, avatarUrl) {
  return await getById(id).then((user) => {
    user.avatarURL = avatarUrl;
    return user.save();
  });
}

async function verifyUser(verificationToken) {
  return await User.findOne({
    where: {
      verificationToken: verificationToken,
    },
  }).then((user) => {
    if (!user) {
      throw new NotFoundError("User not found");
    }
    user.verify = true;
    user.verificationToken = null;
    return user.save();
  });
}

export const usersService = {
  getById,
  getByEmail,
  create,
  update,
  removeTokenFromUser,
  updateAvatar,
  verifyUser,
  updateVerificationToken,
};
