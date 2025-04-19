import { Contact } from "../db/models/Contact.js";
import { NotFoundError } from "../helpers/NotFoundError.js";
import { ForbiddenOperationError } from "../helpers/ForbiddenOperationError.js";

const notFoundError = new NotFoundError("Not found");
const forbiddenOperationError = new ForbiddenOperationError("Not a owner of contact");
const attributeList = ["id", "name", "email", "phone", "favorite", "owner"];

function toResponse(contact) {
  return contact.toJSON();
}

async function listContacts(favorite, page, limit) {
  const whereClause = favorite !== null ? { favorite } : {}; // Add condition if favorite is not null
  const contacts = await Contact.findAll({
    where: whereClause, // Apply the where clause
    offset: (page -1) * limit, 
    limit: limit,
    attributes: attributeList,
  });

  return contacts.map((contact) => toResponse(contact));
}

async function getEntityById(contactId) {
  return await Contact.findOne({
    where: {
      id: contactId,
    },
    attributes: attributeList,
  });
}

async function getContactById(contactId) {
  return await getEntityById(contactId).then((contact) => {
    console.error(`contact = ${contact}`);

    if (!contact) {
      throw notFoundError;
    }
    return toResponse(contact);
  });
}

async function removeContact(contactId, userId) {
  const entry = await getEntityById(contactId);
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

    console.log(`contact.owner = ${contact.owner}`);
    console.log(`userId = ${userId}`);

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
