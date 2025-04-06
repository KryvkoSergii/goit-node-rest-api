import { DataTypes, Model } from "sequelize";
import sequelize from "../connection.js";
import crypto from "crypto";

function generateSecureRandomString(length = 20) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "") // remove non-standard characters
    .slice(0, length);
}

function syncModels() {
  return sequelize.sync({ alter: true });
}

class User extends Model {
  toJSON() {
    const values = { ...this.get() };
    delete values.password;
    delete values.createdAt;
    delete values.updatedAt;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: generateSecureRandomString(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "contacts",
    modelName: "Contact",
    sequelize, // We need to pass the connection instance
    timestamps: true, // Enable timestamps
  }
);

export default { User, syncModels };
