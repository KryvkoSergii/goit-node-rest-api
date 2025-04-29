import gravatar from "gravatar";
import axios from "axios";
import fs from "fs";
import crypto from "crypto";
import {ensureDirExists} from "../helpers/fileValidator.js";

export const PUBLIC_DIR = "public";
ensureDirExists(PUBLIC_DIR, process.env.AVATARS_DIR);

function retrieveAvatarUrl(email, size = 200) {
    const url = gravatar.url(email, {
        s: size,
        r: "pg",
        d: "identicon",
    });
    return `https:${url}`
}

function buildRelativeFilePath(fileName) {
    return `/${PUBLIC_DIR}/${process.env.AVATARS_DIR}/${fileName}`;
}

export function generateFileName(length = 15) {
    return crypto
        .randomBytes(length)
        .toString("base64")
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, length);
}

export async function retrieveAvatarUrlForNewUser(email) {
    const generatedUrl = retrieveAvatarUrl(email);
    const fileName = `${generateFileName()}.png`;
    const filePath = buildRelativeFilePath(fileName);

    const response = await axios({
        method: "get",
        url: generatedUrl,
        responseType: "stream",
    });
    response.data.pipe(fs.createWriteStream(`.${filePath}`));
    return filePath;
}

export function moveFileToNewDestination(oldPath) {
    const extension = oldPath.split(".").pop();
    const fileName = `${generateFileName()}.${extension}`;
    const filePath = buildRelativeFilePath(fileName);
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
        if (filePath) {
            fs.unlink(`.${filePath}`, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } else {
            resolve();
        }
    });
}