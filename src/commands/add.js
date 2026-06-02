import {
    confirm,
    input,
} from "@inquirer/prompts";

import ora from "ora";

import {
    getProfile,
    saveProfile,
} from "../services/profile.js";

import {
    generateSSHKey,
} from "../services/ssh.js";

import {
    success,
} from "../utils/logger.js";

export async function addCommand() {
    const name = await input({
        message: "Profile Name",
    });

    if (getProfile(name)) {
        throw new Error(
            `Profile "${name}" already exists`
        );
    }

    const username = await input({
        message: "GitHub Username",
    });

    const email = await input({
        message: "Email",
    });

    const createSSH = await confirm({
        message:
            "Generate SSH key automatically?",
        default: true,
    });

    let sshKey = null;

    if (createSSH) {
        const spinner = ora(
            "Generating SSH key..."
        ).start();

        sshKey = await generateSSHKey(
            name,
            email
        );

        spinner.succeed(
            "SSH key generated"
        );
    }

    saveProfile({
        name,
        username,
        email,
        sshKey,
    });

    success(
        `Profile "${name}" saved locally`
    );
}