import { getProfiles } from "../services/profile.js";
import { info } from "../utils/logger.js";

export async function listCommand() {
    const profiles = getProfiles();

    if (!profiles.length) {
        info("No profiles found");
        return;
    }

    console.log();

    profiles.forEach((profile) => {
        console.log(
            `• ${profile.name} (${profile.username})`
        );
    });

    console.log();
}