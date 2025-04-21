import multer from "multer";
import {ensureDirExists} from "../helpers/fileValidator.js";

const tempDir = ensureDirExists(process.env.TEMP_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
});