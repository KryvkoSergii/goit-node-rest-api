import { DataTypes, Model } from "sequelize";
import sequelize from "../connection.js";
import { generateSecureRandomString } from "./ModelUtils.js";

export class Contact extends Model {
  toJSON() {
    const values = { ...this.get() };
    delete values.createdAt;
    delete values.updatedAt;
    return values;
  }
}

Contact.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => generateSecureRandomString(),
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
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    tableName: "contacts",
    modelName: "Contact",
    sequelize, // We need to pass the connection instance
    timestamps: true, // Enable timestamps
  }
);
