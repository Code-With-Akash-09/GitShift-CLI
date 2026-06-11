import { configureRepositoryAuth } from "../services/auth.js";
import { buildSSHHost, getCurrentProfile, getProfile, getProfiles } from "../services/profile.js";
import { addSSHHost } from "../services/ssh.js";
import { error, success } from "../utils/logger.js";

export async function repairCommand() {
    try {
        const current = getCurrentProfile();

        if (!current) {
            error("No active profile");
            return;
        }

        const profile = getProfile("name", current);
        const profiles = getProfiles();

        for (const item of profiles) {
            if (!item.sshKey) {
                continue;
            }

            const sshHost = item.sshHost || buildSSHHost(item.name);

            await addSSHHost(
                sshHost,
                item.sshKey
            );
        }

        const authResult = await configureRepositoryAuth(profile);

        if (authResult.status === "unchanged") {
            success("Repository already configured");
            console.log(`\n${authResult.url}\n`);
            return;
        }

        if (authResult.reason === "missing-ssh-key") {
            error("No SSH key saved for the active profile");
            return;
        }

        if (authResult.reason === "not-git-repo") {
            error("Current directory is not a Git repository");
            return;
        }

        if (authResult.reason === "missing-remote") {
            error("Repository has no origin remote");
            return;
        }

        if (authResult.status === "skipped") {
            error("Unsupported remote");
            return;
        }

        success("Remote repaired");
        console.log(`\n${authResult.url}\n`);
    } catch (err) {
        error(err.message);
    }
}
