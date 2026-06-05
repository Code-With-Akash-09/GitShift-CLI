import path from "path";
import { removeFolderMapping } from "../services/profile.js";
import { success } from "../utils/logger.js";

export async function unlinkCommand(folder) {
    const fullPath = path.resolve(folder);
    removeFolderMapping(fullPath);
    success(`Removed ${fullPath}`);
}