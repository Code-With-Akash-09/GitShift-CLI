import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { buildSSHHost, saveProfile } from "../services/profile.js";
import { addSSHHost } from "../services/ssh.js";
import { createSSHKey, promptUniqueField } from "../utils/helper.js";
import { error, success } from "../utils/logger.js";

export async function addCommand() {
    try {
        console.log(chalk.cyan("\nCreate a new GitHub profile\n"));

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

        const createSSH = await confirm({
            message: "Generate SSH key automatically?",
            default: true,
        });

        let sshKey = null;

        if (createSSH) {
            sshKey = await createSSHKey(name, email);
            await addSSHHost(
                buildSSHHost(name),
                sshKey
            );
        }

        saveProfile({
            name,
            username,
            email,
            sshKey,
            sshHost: buildSSHHost(name),
            source: "local",
        });

        success(`Profile "${name}" saved locally`);
    } catch (err) {
        if (err && err.name === "ExitPromptError") {
            // User canceled the prompt (Ctrl+C / SIGINT). Exit gracefully.
            error("Profile creation canceled.");
            process.exitCode = 0;
            return;
        }

        error(String(err));
        process.exitCode = 1;
    }
}