import { confirm, input } from "@inquirer/prompts";
import ora from "ora";
import { getProfile, saveProfile } from "../services/profile.js";
import { generateSSHKey } from "../services/ssh.js";
import { error, success } from "../utils/logger.js";

export async function addCommand() {
    try {
        const name = await input({
            message: "Profile Name",
        });

        if (!name.trim()) {
            throw new Error(
                "Profile name is required"
            );
        }

        if (getProfile(name)) {
            error(`Profile "${name}" already exists`);

            process.exitCode = 1;
            return;
        }

        const username = await input({
            message: "GitHub Username",
        });

        if (!username.trim()) {
            throw new Error(
                "GitHub username is required"
            );
        }

        const email = await input({
            message: "Email",
        });

        if (!email.trim()) {
            throw new Error(
                "Email is required"
            );
        }

        const createSSH = await confirm({
            message: "Generate SSH key automatically?",
            default: true,
        });

        let sshKey = null;

        if (createSSH) {
            const spinner = ora("Generating SSH key...").start();

            try {
                sshKey = await generateSSHKey(name, email);

                spinner.succeed("SSH key generated");
            } catch (err) {
                spinner.fail("Unable to generate SSH key");

                error("Could not create SSH key. Ensure OpenSSH is installed and available.");

                if (
                    err &&
                    typeof err === "object" &&
                    "shortMessage" in err &&
                    err.shortMessage
                ) {
                    error(String(err.shortMessage));
                }

                process.exitCode = 1;
                return;
            }
        }

        saveProfile({
            name,
            username,
            email,
            sshKey,
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