import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import { createContactSchema, updateContactSchema, favoriteContactSchema } from "../schemas/contactsSchemas.js";
import isEmptyBody from "../middleware/bodyValidator.js";
import { passportConfig } from "../middleware/passportConfig.js";

const contactsRouter = express.Router();

contactsRouter.get("/", passportConfig.authenticate, getAllContacts);

contactsRouter.get("/:id", passportConfig.authenticate, getOneContact);

contactsRouter.delete("/:id", passportConfig.authenticate, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), passportConfig.authenticate, createContact);

contactsRouter.put("/:id", isEmptyBody, validateBody(updateContactSchema), passportConfig.authenticate, updateContact);

contactsRouter.patch("/:id/favorite", validateBody(favoriteContactSchema), passportConfig.authenticate, updateStatusContact);

export default contactsRouter;
