import { input } from "@inquirer/prompts";
import ora from "ora";
import { getProfile } from "../services/profile.js";
import { generateSSHKey } from "../services/ssh.js";
import { error } from "./logger.js";

export const promptUniqueField = async ({
    message,
    field,
    requiredMessage,
    duplicateMessage,
}) => {
    const value = (await input({ message })).trim();

    if (!value) {
        throw new Error(requiredMessage);
    }

    if (getProfile(field, value)) {
        throw new Error(duplicateMessage(value));
    }

    return value;
}

export const createSSHKey = async (name, email) => {
    const spinner = ora("Generating SSH key...").start();

    try {
        const sshKey = await generateSSHKey(name, email);
        spinner.succeed("SSH key generated");
        return sshKey;
    } catch (err) {
        spinner.fail("Unable to generate SSH key");

        error(
            "Could not create SSH key. Ensure OpenSSH is installed and available."
        );

        if (err?.shortMessage) error(err.shortMessage)
        throw err;
    }
}