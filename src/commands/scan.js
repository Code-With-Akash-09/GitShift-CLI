import { select } from "@inquirer/prompts";
import chalk from "chalk";
import path from "path";
import { buildSSHHost, getProfiles, saveProfile } from "../services/profile.js";
import { findSSHKeys } from "../services/scan.js";
import { promptUniqueField } from "../utils/helper.js";
import { error, info, success } from "../utils/logger.js";

export async function scanCommand() {
    try {
        console.log(chalk.cyan("\nScan Existing SSH Keys\n"));

        const keys = await findSSHKeys();

        if (!keys.length) {
            info("No SSH keys found");
            return;
        }

        const existing = getProfiles();
        const importedPaths = existing.map(
            (profile) => profile.sshKey
        );
        const available = keys.filter(
            (key) => !importedPaths.includes(key)
        );

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

        const name = await promptUniqueField({
            message: "Profile Name:",
            field: "name",
            requiredMessage: "Profile name is required",
            duplicateMessage: (value) =>
                `Profile "${value}" already exists`,
        });

        const username = await promptUniqueField({
            message: "GitHub Username:",
            field: "username",
            requiredMessage: "GitHub username is required",
            duplicateMessage: (value) =>
                `Username "${value}" already exists`,
        });

        const email = await promptUniqueField({
            message: "Email:",
            field: "email",
            requiredMessage: "Email is required",
            duplicateMessage: (value) =>
                `Email "${value}" already exists`,
        });

        saveProfile({
            name,
            username,
            email,
            sshKey: selected,
            sshHost: buildSSHHost(name),
            source: "imported",
        });

        success(`Existing SSH Key Imported "${name}"`);
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