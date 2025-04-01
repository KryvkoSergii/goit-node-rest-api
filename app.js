import express from "express";
import morgan from "morgan";
import cors from "cors";
import validateBody from "./helpers/validateBody.js";
import { createContactSchema, updateContactSchema } from "./schemas/contactsSchemas.js";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  if (req.method === "PUT") {
    const validator = validateBody(createContactSchema);
    validator(req, res, next);
  } else if (req.method === "POST") {
    const validator = validateBody(updateContactSchema);
    validator(req, res, next);
  } else {
    next();
  }
});

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
