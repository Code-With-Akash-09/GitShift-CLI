import { select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import { addFolderMapping, getFolderMappings, getProfiles } from "../services/profile.js";
import { error, success } from "../utils/logger.js";

export async function linkCommand(folder) {
    try {

        console.log(chalk.cyan("\nLinked Profile with Folder Path\n"));

        const fullPath = path.resolve(folder);
        const exists = await fs.pathExists(fullPath);

        if (!exists) {
            error("Folder does not exist");
            return;
        }

        const folders = getFolderMappings();
        const isFolderAllreadyLinked = folders.find(
            (mapping) => mapping.path === fullPath
        );

        if (isFolderAllreadyLinked) {
            error("Folder is already linked to a profile");
            return;
        }

        let profiles = getProfiles();
        let selectedProfile;

        if (profiles.length === 0) {
            console.log("\nNo profiles found.\n");
        } else {
            const choice = await select({
                message: "Select Profile",
                choices: [
                    ...profiles.map(
                        (profile) => ({
                            name: `${profile.name} (${profile.username})`,
                            value:
                                profile.name,
                        })
                    ),
                ],
            });

            selectedProfile = choice;
        }
        addFolderMapping(selectedProfile, fullPath);
        success(`Profile: ${selectedProfile} is Linked to ${fullPath}`);
    } catch (err) {
        if (err && err.name === "ExitPromptError") {
            // User canceled the prompt (Ctrl+C / SIGINT). Exit gracefully.
            error("Operation canceled.");
            process.exitCode = 0;
            return;
        }

        error(String(err));
        process.exitCode = 1;
    }
}