import { contactsService } from "../services/contactsService.js";
import { NotFoundError } from "../helpers/NotFoundError.js";
import { errorBody } from "./responseModels.js";
import { ForbiddenOperationError } from "../helpers/ForbiddenOperationError.js";

function handleError(res, err) {
  if (err instanceof NotFoundError) {
    return res.status(404).json(errorBody(err.message));
  } else if (err instanceof ForbiddenOperationError) {
    return res.status(403).json(errorBody(err.message));
  } else {
    return res.status(500).json(errorBody(err.message));
  }
}

function handleSuccess(res, data) {
  return res.status(200).json(data);
}

export const getAllContacts = (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 20;
  const favorite = req.query.favorite || null;

  contactsService
    .listContacts(favorite, page, limit)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};

export const getOneContact = (req, res) => {
  const id = req.params.id;

  contactsService
    .getContactById(id)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};

export const deleteContact = (req, res) => {
  const id = req.params.id;
  const usr = req.user;

  contactsService
    .removeContact(id, usr.id)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};

export const createContact = (req, res) => {
  const usr = req.user;

  contactsService
    .addContact(req.body.name, req.body.email, req.body.phone, usr.id)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};

export const updateContact = (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const usr = req.user;

  contactsService
    .updateContact(id, name, email, phone, usr.id)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};

export const updateStatusContact = (req, res) => {
  const id = req.params.id;
  const favorite = req.body.favorite;
  const usr = req.user;

  contactsService
    .updateStatusContact(id, favorite, usr.id)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};
