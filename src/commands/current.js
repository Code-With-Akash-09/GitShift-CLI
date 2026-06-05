import { getCurrentProfile, getProfile, } from "../services/profile.js";
import { info } from "../utils/logger.js";

export async function currentCommand() {
    const current = getCurrentProfile();

    if (!current) {
        info("No active profile");
        return;
    }

    const profile = getProfile(current);

    if (!profile) {
        info("Profile not found");
        return;
    }

    console.log();
    console.log(`Profile : ${profile.name}`);
    console.log(`Username: ${profile.username}`);
    console.log(`Email   : ${profile.email}`);
    console.log(`SSH Key : ${profile.sshKey || "Not configured"}`);
    console.log();
}