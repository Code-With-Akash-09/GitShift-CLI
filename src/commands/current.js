import chalk from "chalk";
import { getCurrentProfile, getProfile, } from "../services/profile.js";
import { info } from "../utils/logger.js";

export async function currentCommand() {

    console.log(chalk.cyan("\nViewing current profile\n"));

    const current = getCurrentProfile();

    if (!current) {
        info("No active profile");
        return;
    }

    const profile = getProfile("name", current);

    if (!profile) {
        info("Profile not found");
        return;
    }

    console.log();
    console.log(`Profile  : ${profile.name}`);
    console.log(`Username : ${profile.username}`);
    console.log(`Email    : ${profile.email}`);
    console.log(`SSH Key  : ${profile.sshKey || "Not configured"}`);
    console.log(`SSH Host : ${profile.sshHost || "Not configured"}`);
    console.log();
}