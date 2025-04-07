import sequelize from "../connection.js";
import crypto from "crypto";

export function syncModels() {
  return sequelize.sync({ alter: true });
}

export function generateSecureRandomString(length = 20) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "") // remove non-standard characters
    .slice(0, length);
}
