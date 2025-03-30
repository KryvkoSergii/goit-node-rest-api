import contactsService from "../services/contactsServices.cjs";

const notFoundResponse = { "message": "Not found" };

export const getAllContacts = (req, res) => {
    contactsService.listContacts().then(data =>
        res.status(200).json(data)
    );
};

export const getOneContact = (req, res) => {
    const id = req.params.id;
    contactsService.getContactById(id).then(data => {
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json(notFoundResponse);
        }
    });
};

export const deleteContact = (req, res) => {
    const id = req.params.id;
    contactsService.removeContact(id).then(data => {
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json(notFoundResponse);
        }
    });
};

export const createContact = (req, res) => {
    contactsService.addContact(req.body.name, req.body.email, req.body.phone).then(data => {
        res.status(201).json(data);
    });
};

export const updateContact = (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;

    if (!id) {
        return res.status(400).json({ error: "Missing 'id'" });
    }

    if (!name && !email && !phone) {
        return res.status(400).json({ error: "Body must have at least one field" });
    }

    contactsService.updateContact(id, name, email, phone).then(data => {
        if (!data) {
            res.status(404).json(notFoundResponse);
        } else {
            res.status(200).json(data);
        }
    });
};
