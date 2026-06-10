import chalk from "chalk";
import { getProfiles } from "../services/profile.js";
import { info } from "../utils/logger.js";

export async function listCommand() {

    console.log(chalk.cyan("\nGithub Profiles\n"));

    const profiles = getProfiles();

    if (!profiles.length) {
        info("No profiles found");
        return;
    }

    profiles.forEach((profile) => {
        console.log(
            `• ${profile.name} (${profile.username})`
        );
    });

    console.log();
}