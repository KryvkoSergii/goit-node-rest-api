import { User } from "../db/models/user.js";
import { NotFoundError } from "../helpers/NotFoundError.js";
import { syncModels } from "../db/models/ModelUtils.js";

const notFoundError = new NotFoundError("Not found");
const attributeList = ["id", "name", "email", "phone", "favorite"];

syncModels();

function toResponse(contact) {
  return contact.toJSON();
}

async function listContacts() {
  const contacts = await User.findAll({
    attributes: attributeList,
  });

  return contacts.map((contact) => toResponse(contact));
}

async function getEntityById(contactId) {
  return await User.findOne({
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

async function removeContact(contactId) {
  const entry = await getEntityById(contactId);
  if (!entry) {
    throw notFoundError;
  }
  await entry.destroy();
  return toResponse(entry);
}

async function addContact(name, email, phone) {
  const contact = await User.create({
    name,
    email,
    phone,
  });
  return toResponse(contact);
}

async function updateContact(id, name, email, phone) {
  return await getEntityById(id).then((contact) => {
    if (!contact) {
      throw notFoundError;
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

async function updateStatusContact(id, favorite) {
  return await getEntityById(id).then((contact) => {
    if (!contact) {
      throw notFoundError;
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
