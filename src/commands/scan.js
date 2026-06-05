import path from "path";

import {
    input,
    select,
} from "@inquirer/prompts";

import {
    findSSHKeys,
} from "../services/scan.js";

import {
    getProfiles,
    saveProfile,
} from "../services/profile.js";

import {
    error,
    info,
    success,
} from "../utils/logger.js";

export async function scanCommand() {
    try {
        const keys = await findSSHKeys();

        if (!keys.length) {
            info("No SSH keys found");
            return;
        }

        const existing = getProfiles();

        const importedPaths = existing.map((profile) => profile.sshKey);

        const available = keys.filter((key) => !importedPaths.includes(key));

        if (!available.length) {
            info("All keys already imported");
            return;
        }

        const selected = await select({
            message: "Select SSH Key",
            choices: available.map((key) => ({
                name: path.basename(key),
                value: key,
            })),
        });

        const profileName = await input({
            message: "Profile Name",
            default: path.basename(selected),
        });

        const username = await input({
            message: "GitHub Username",
        });

        const email = await input({
            message: "Email",
        });

        try {
            saveProfile({
                name: profileName,
                username,
                email,
                sshKey: selected,
                source:
                    "imported",
            });

            success(`Existing SSH Key Imported "${profileName}"`);
        } catch (err) {
            error(err.message);
        }
    } catch (err) {
        if (err && err.name === "ExitPromptError") {
            // User canceled the prompt (Ctrl+C / SIGINT). Exit gracefully.
            error("Existing SSH Key Import canceled by user.");
            process.exitCode = 0;
            return;
        }

        error(String(err));
        process.exitCode = 1;
    }
}