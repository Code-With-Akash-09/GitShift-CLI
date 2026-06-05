import fs from "fs-extra";
import path from "path";
import { getCurrentProfile, getFolderMappings, getProfiles } from "../services/profile.js";
import { error, success } from "../utils/logger.js";

export async function backupCommand(fileName = "gitshift-backup.json") {
    try {
        const backup = {
            profiles: getProfiles(),
            folderMappings: getFolderMappings(),
            currentProfile: getCurrentProfile(),
            createdAt: new Date().toISOString(),
        };

        const filePath = path.resolve(fileName);

        await fs.writeJson(
            filePath,
            backup,
            {
                spaces: 2,
            }
        );

        success(`Backup saved to ${filePath}`);
    } catch (err) {
        error(err.message);
    }
}