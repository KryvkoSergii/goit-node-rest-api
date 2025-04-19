import { User } from "../db/models/User.js";
const attributeList = ["id", "email", "subscription", "token", "password"];
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

async function create(email, password) {
  const existingUser = await getByEmailInner(email);
  if (existingUser) {
    throw new EmailAlreadyExistsError("Email in use");
  }
  const hashedPassword = await passwordService.getHashedPassword(password);
  return await User.create({
    email,
    password: hashedPassword,
    subscription: defaultSubscription,
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

async function removeTokenFromUser(id) {
  return await getById(id).then((user) => {
    user.token = null;
    return user.save();
  });
}

export const usersService = {
  getById,
  getByEmail,
  create,
  update,
  removeTokenFromUser,
};
