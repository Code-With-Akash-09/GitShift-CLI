import { confirm, input, select } from "@inquirer/prompts";
import fs from "fs-extra";
import ora from "ora";
import path from "path";
import { addFolderMapping, getProfile, getProfiles, saveProfile } from "../services/profile.js";
import { generateSSHKey } from "../services/ssh.js";
import { error, success } from "../utils/logger.js";

export async function linkCommand(folder) {

    const fullPath = path.resolve(folder);
    const exists = await fs.pathExists(fullPath);

    if (!exists) {
        error("Folder does not exist");
        return;
    }

    let profiles = getProfiles();
    let selectedProfile;

    if (profiles.length === 0) {
        console.log("\nNo profiles found.\n");
        selectedProfile = await createProfile();
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
                {
                    name: "+ Create New Profile",
                    value: "__create__",
                },
            ],
        });

        if (choice === "__create__") {
            selectedProfile = await createProfile();
        } else {
            selectedProfile = choice;
        }
    }

    try {
        addFolderMapping(selectedProfile, fullPath);
        success(`Linked ${fullPath}`);
        success(`Profile: ${selectedProfile}`);
    } catch (err) {
        error(err.message);
    }
}

async function createProfile() {
    const name = await input({
        message: "Profile Name",
    });

    if (!name.trim()) {
        throw new Error("Profile name is required");
    }

    if (getProfile(name)) {
        error(`Profile "${name}" already exists`);
        process.exitCode = 1;
        return;
    }

    const username =
        await input({
            message: "GitHub Username",
        });

    if (!username.trim()) {
        throw new Error("GitHub username is required");
    }

    const email =
        await input({
            message: "Email",
        });

    if (!email.trim()) {
        throw new Error("Email is required");
    }

    const shouldCreateSSH =
        await confirm({
            message: "Generate SSH Key?",
            default: true,
        });

    let sshKey = null;

    if (shouldCreateSSH) {
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
        source: "manual",
    });

    success(`Profile "${name}" created`);

    return name;
}