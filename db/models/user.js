import sequelize from "../connection.js";
import { generateSecureRandomString } from "./ModelUtils.js";
import { DataTypes, Model } from "sequelize";

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateSecureRandomString(),
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: "users_email_key", // Custom name for the unique constraint
        msg: "Email in use", // Custom error message
      },
      collate: "utf8_general_ci", // Case-insensitive collation
    },
    subscription: {
      type: DataTypes.ENUM,
      values: ["starter", "pro", "business"],
      defaultValue: "starter",
    },
    token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    avatarURL: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    modelName: "User",
    sequelize, // We need to pass the connection instance
    timestamps: true, // Enable timestamps
  }
);
