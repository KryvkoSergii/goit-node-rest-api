import gravatar from "gravatar";
import axios from "axios";
import fs from "fs";
import crypto from "crypto";

export const PUBLIC_DIR = "public";

function retrieveAvatarUrl(email, size = 200) {
  const url = gravatar.url(email, {
    s: size,
    r: "pg",
    d: "identicon",
  });
  return `https:${url}`
}

function buildRelativePath(fileName){
  return `/${PUBLIC_DIR}/${process.env.AVATARS_DIR}/${fileName}`;
}

export function generateFileName(length = 15) {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length);
}

export async function retriveAvatarUrlForNewUser(email) {
  const generatedUrl = retrieveAvatarUrl(email);
  const fileName = `${generateFileName()}.png`;
  const filePath = buildRelativePath(fileName);
  
  const respose = await axios({
    method: "get",
    url: generatedUrl,
    responseType: "stream",
  });
  respose.data.pipe(fs.createWriteStream(`.${filePath}`));
  return filePath;
}

export function moveFileToNewDestination(oldPath) {
  const extention = oldPath.split(".").pop();
  const fileName = `${generateFileName()}.${extention}`;
  const filePath = buildRelativePath(fileName);
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, `.${filePath}`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(filePath);
      }
    });
  });
}

export function removeFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.unlink(`.${filePath}`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}