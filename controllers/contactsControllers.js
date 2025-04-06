import { contactsService } from "../services/contactsServices.js";
import { NotFoundError } from "../helpers/errors.js";

const errorBody = (msg) => ({ message: msg });

function handleError(res, err) {
  if (err instanceof NotFoundError) {
    return res.status(404).json(errorBody(err.message));
  } else {
    return res.status(500).json(errorBody(err.message));
  }
}

function handleSuccess(res, data) {
  return res.status(200).json(data);
}

export const getAllContacts = (req, res) => {
  contactsService
    .listContacts()
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
  contactsService
    .removeContact(id)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};

export const createContact = (req, res) => {
  contactsService
    .addContact(req.body.name, req.body.email, req.body.phone)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};

export const updateContact = (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;

  contactsService
    .updateContact(id, name, email, phone)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};

export const updateStatusContact = (req, res) => {
  const id = req.params.id;
  const favorite = req.body.favorite;

  contactsService
    .updateStatusContact(id, favorite)
    .then((data) => handleSuccess(res, data))
    .catch((err) => handleError(res, err));
};
