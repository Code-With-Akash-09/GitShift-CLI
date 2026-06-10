import ora from "ora";
import { setGitUser } from "../services/git.js";
import { getProfile, setCurrentProfile } from "../services/profile.js";
import { error, success } from "../utils/logger.js";

export async function useCommand(profileName) {
    const profile = getProfile("name", profileName);

    if (!profile) {
        error(`Profile "${profileName}" not found`);
        return;
    }

    const spinner = ora("Switching profile...").start();

    try {
        await setGitUser(profile.username, profile.email);
        setCurrentProfile(profile.name);

        spinner.succeed("Profile switched");
        success(`Current profile: ${profile.name}`);

    } catch (err) {
        spinner.fail("Unable to switch profile");
        error(err.message);
    }
}