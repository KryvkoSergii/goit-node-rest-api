import fs from "fs";
import path from "path";

export function ensureDirExists(...filePath) {
    const __dirname = path.resolve('./');
    const storeDir = path.join(__dirname, ...filePath);

    if (!fs.existsSync(storeDir)) {
        fs.mkdirSync(storeDir, {recursive: true});
    }

    return storeDir;
}