var fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

const contactsPath = path.join(__dirname, "..", "db", "contacts.json");
const encoding = "utf8";

async function load(filePath) {
  return await fs.readFile(filePath, encoding, (err) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }
  });
}

async function rewrite(filePath, objectToStore) {
  const converted = JSON.stringify(objectToStore, null, 2);
  return await fs.writeFile(filePath, converted, encoding, (err) => {
    if (err) {
      console.error("Error writing file:", err);
    }
  });
}

function generateSecureRandomString(length = 20) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "") // remove non-standard characters
    .slice(0, length);
}

async function listContacts() {
  return await JSON.parse(await load(contactsPath));
}

async function getContactById(contactId) {
  const list = JSON.parse(await load(contactsPath));
  const found = list.filter((contact) => contact.id === contactId);
  return found && found.length > 0 ? found[0] : null;
}

async function removeContact(contactId) {
  const all = await listContacts();
  const idx = all.findIndex((record) => record.id === contactId);
  if (idx !== -1) {
    const toRemove = all[idx];
    all.splice(idx, 1);
    await rewrite(contactsPath, all);
    return toRemove;
  } else {
    return null;
  }
}

async function addContact(name, email, phone) {
  const record = {
    id: generateSecureRandomString(),
    name: name,
    email: email,
    phone: phone,
  };

  var all = await listContacts();
  if (!all) {
    all = JSON.parse("[]");
  }
  all.push(record);
  await rewrite(contactsPath, all);
  return record;
}

async function updateContact(id, name, email, phone) {
  const list = JSON.parse(await load(contactsPath));
  var found = list.filter((contact) => contact.id === id);

  if (found.length == 0) {
    return null;
  }

  found = found[0];

  if (name) {
    found.name = name;
  }

  if (email) {
    found.email = email;
  }

  if (phone) {
    found.phone = phone;
  }

  await rewrite(contactsPath, list);
  return found;
}

const contactsService = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
};

// Use CommonJS export
module.exports = contactsService;