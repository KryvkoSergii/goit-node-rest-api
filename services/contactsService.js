import { Contact } from "../db/models/Contact.js";
import { NotFoundError } from "../helpers/NotFoundError.js";
import { ForbiddenOperationError } from "../helpers/ForbiddenOperationError.js";

const notFoundError = new NotFoundError("Not found");
const forbiddenOperationError = new ForbiddenOperationError("Not a owner of contact");
const attributeList = ["id", "name", "email", "phone", "favorite", "owner"];

function toResponse(contact) {
  return contact.toJSON();
}

async function listContacts(favorite, userId, page, limit) {
  const whereClause = {
    owner: userId,
    ...(favorite !== null && { favorite }),
  };
  const contacts = await Contact.findAll({
    where: whereClause, // Apply the where clause
    offset: (page -1) * limit, 
    limit: limit,
    attributes: attributeList,
  });

  return contacts.map((contact) => toResponse(contact));
}

async function getEntityById(contactId, userId) {
  return await Contact.findOne({
    where: {
      id: contactId,
      owner: userId,
    },
    attributes: attributeList,
  });
}

async function getContactById(contactId, userId) {
  return await getEntityById(contactId, userId).then((contact) => {

    if (!contact) {
      throw notFoundError;
    }
    return toResponse(contact);
  });
}

async function removeContact(contactId, userId) {
  const entry = await getEntityById(contactId, userId);
  if (!entry) {
    throw notFoundError;
  }

  if (entry.owner !== userId) {
    throw forbiddenOperationError;
  }

  await entry.destroy();
  return toResponse(entry);
}

async function addContact(name, email, phone, userId) {
  const contact = await Contact.create({
    name,
    email,
    phone,
    owner: userId,
  });
  return toResponse(contact);
}

async function updateContact(id, name, email, phone, userId) {
  return await getEntityById(id).then((contact) => {
    if (!contact) {
      throw notFoundError;
    }

    if (contact.owner !== userId) {
      throw forbiddenOperationError;
    }

    if (name) {
      contact.name = name;
    }

    if (email) {
      contact.email = email;
    }

    if (phone) {
      contact.phone = phone;
    }

    return contact.save().then(() => {
      return toResponse(contact);
    });
  });
}

async function updateStatusContact(id, favorite, userId) {
  return await getEntityById(id).then((contact) => {
    if (!contact) {
      throw notFoundError;
    }

    if (contact.owner !== userId) {
      throw forbiddenOperationError;
    }

    contact.favorite = favorite;

    return contact.save().then(() => {
      return toResponse(contact);
    });
  });
}

export const contactsService = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
