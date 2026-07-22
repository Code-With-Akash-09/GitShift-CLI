import ora from "ora";
import { configureRepositoryAuth } from "../services/auth.js";
import { setGitUser } from "../services/git.js";
import { getProfile, setCurrentProfile } from "../services/profile.js";
import { verifySSHHost } from "../services/ssh.js";
import { error, info, success, warning } from "../utils/logger.js";

export async function useCommand(profileName) {
    const profile = getProfile("name", profileName);

    if (!profile) {
        error(`Profile "${profileName}" not found`);
        return;
    }

    const spinner = ora("Switching profile...").start();

    try {
        await setGitUser(profile.username, profile.email, process.cwd());
        const authResult = await configureRepositoryAuth(profile, process.cwd());

        setCurrentProfile(profile.name);

        spinner.succeed("Profile switched");
        success(`Current profile: ${profile.name} (user: ${profile.username}, email: ${profile.email})`);

        if (authResult.status === "changed") {
            success("Repository authentication updated");
            console.log(authResult.url);
        } else if (authResult.reason === "missing-ssh-key") {
            info("No SSH key saved for this profile, so repository authentication was not changed");
        }

        if (profile.sshHost) {
            const sshOutput = await verifySSHHost(profile.sshHost);
            if (!sshOutput.includes(profile.username) && !sshOutput.toLowerCase().includes("successfully authenticated")) {
                warning(`SSH key verification warning: Could not verify SSH auth for ${profile.username} on ${profile.sshHost}. Run 'gitshift doctor' or add the public key to GitHub.`);
            }
        }

    } catch (err) {
        spinner.fail("Unable to switch profile");
        error(err.message);
    }
}
