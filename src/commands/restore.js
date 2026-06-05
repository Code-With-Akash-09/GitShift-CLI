import { confirm } from "@inquirer/prompts";
import fs from "fs-extra";
import path from "path";
import { restoreData } from "../services/profile.js";
import { error, success } from "../utils/logger.js";

export async function restoreCommand(file) {
    try {
        const filePath = path.resolve(file);
        const exists = await fs.pathExists(filePath);

        if (!exists) {
            error("Backup file not found");
            return;
        }

        const overwrite = await confirm({
            message: "This will overwrite current data. Continue?",
            default: false,
        });

        if (!overwrite) {
            return;
        }

        const backup = await fs.readJson(filePath);
        restoreData(backup);

        success("Backup restored");
    } catch (err) {
        error(err.message);
    }
}