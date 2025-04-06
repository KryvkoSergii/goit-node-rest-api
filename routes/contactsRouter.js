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

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", isEmptyBody, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", validateBody(favoriteContactSchema), updateStatusContact);

export default contactsRouter;
