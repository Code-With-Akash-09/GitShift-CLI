import { confirm, password, select } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { isGHCLIAvailable, uploadSSHKeyToGitHub, uploadSSHKeyViaGHCLI } from "../services/github.js";
import { buildSSHHost, saveProfile } from "../services/profile.js";
import { addSSHHost, getPublicKey, verifySSHHost } from "../services/ssh.js";
import { createSSHKey, promptUniqueField } from "../utils/helper.js";
import { error, info, success } from "../utils/logger.js";

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
            const sshHost = buildSSHHost(name);
            await addSSHHost(sshHost, sshKey);

            const uploadMethod = await select({
                message: "How would you like to upload the SSH key to GitHub?",
                choices: [
                    {
                        name: "Personal Access Token (PAT)",
                        value: "pat",
                        description: "Use a GitHub token with write:public_key scope",
                    },
                    {
                        name: "GitHub CLI (gh)",
                        value: "gh",
                        description: "Use logged-in gh command line tool",
                    },
                    {
                        name: "Skip for now (Manual upload)",
                        value: "skip",
                    },
                ],
            });

            if (uploadMethod === "pat") {
                console.log(
                    chalk.yellow(
                        "\nCreate a token at https://github.com/settings/tokens with 'admin:public_key' or 'write:public_key' scope\n"
                    )
                );
                const token = await password({
                    message: "Enter GitHub Personal Access Token:",
                    mask: "*",
                });

                if (token?.trim()) {
                    const spinner = ora("Uploading SSH key to GitHub via API...").start();
                    try {
                        await uploadSSHKeyToGitHub(token, `GitShift (${name})`, sshKey);
                        spinner.succeed("SSH key successfully uploaded to GitHub!");
                    } catch (uploadErr) {
                        spinner.fail("Failed to upload SSH key to GitHub API");
                        error(uploadErr.response?.data?.message || uploadErr.message);
                    }
                }
            } else if (uploadMethod === "gh") {
                const hasGH = await isGHCLIAvailable();
                if (!hasGH) {
                    error("GitHub CLI (gh) is not installed on your system.");
                } else {
                    const spinner = ora("Uploading SSH key to GitHub via gh CLI...").start();
                    try {
                        await uploadSSHKeyViaGHCLI(`GitShift (${name})`, sshKey);
                        spinner.succeed("SSH key successfully uploaded to GitHub via gh CLI!");
                    } catch (uploadErr) {
                        spinner.fail("Failed to upload SSH key via gh CLI");
                        error(uploadErr.message);
                    }
                }
            }

            // Verify SSH host connection status
            const verifySpinner = ora("Verifying SSH connection to GitHub...").start();
            const result = await verifySSHHost(sshHost);
            if (result.includes(username) || result.toLowerCase().includes("successfully authenticated")) {
                verifySpinner.succeed(`SSH connection verified for user ${username}!`);
            } else {
                verifySpinner.warn("SSH key is created locally, but GitHub authentication is pending.");
                const pubKey = await getPublicKey(sshKey);
                if (pubKey) {
                    info(`\nIf key upload was skipped, add this public key to GitHub (${username}):`);
                    console.log(chalk.gray("----------------------------------------"));
                    console.log(pubKey.trim());
                    console.log(chalk.gray("----------------------------------------\n"));
                }
            }
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