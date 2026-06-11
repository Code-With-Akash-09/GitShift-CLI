import ora from "ora";
import { configureRepositoryAuth } from "../services/auth.js";
import { setGitUser } from "../services/git.js";
import { getProfile, setCurrentProfile } from "../services/profile.js";
import { error, info, success } from "../utils/logger.js";

export async function useCommand(profileName) {
    const profile = getProfile("name", profileName);

    if (!profile) {
        error(`Profile "${profileName}" not found`);
        return;
    }

    const spinner = ora("Switching profile...").start();

    try {
        await setGitUser(profile.username, profile.email);
        const authResult = await configureRepositoryAuth(profile);

        setCurrentProfile(profile.name);

        spinner.succeed("Profile switched");
        success(`Current profile: ${profile.name}`);

        if (authResult.status === "changed") {
            success("Repository authentication updated");
            console.log(authResult.url);
        } else if (authResult.reason === "missing-ssh-key") {
            info("No SSH key saved for this profile, so repository authentication was not changed");
        }

    } catch (err) {
        spinner.fail("Unable to switch profile");
        error(err.message);
    }
}
