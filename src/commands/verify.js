import { getRemoteUrl } from "../services/git.js";
import { getCurrentProfile, getProfile } from "../services/profile.js";
import { verifySSHHost } from "../services/ssh.js";
import { error, info, success } from "../utils/logger.js";

export async function verifyCommand() {
    try {
        const current = getCurrentProfile();

        if (!current) {
            error("No active profile");
            return;
        }

        const profile = getProfile("name", current);

        if (!profile) {
            error("Profile not found");
            return;
        }

        const cwd = process.cwd();

        console.log("");

        info(`Profile: ${profile.name}`);
        info(`GitHub: ${profile.username}`);

        const remote = await getRemoteUrl(cwd);

        info(`Remote: ${remote}`);

        const result = await verifySSHHost(
            profile.sshHost
        );

        if (result.includes(profile.username)) {
            success("Authentication looks correct");
        } else {
            error("Authentication mismatch detected");

            console.log("\nExpected:", profile.username);
            console.log("Actual:", result);
        }
    } catch (err) {
        if (err && err.name === "ExitPromptError") {
            // User canceled the prompt (Ctrl+C / SIGINT). Exit gracefully.
            error("Profile creation canceled.");
            process.exitCode = 0;
            return;
        }

        error(String(err));
        process.exitCode = 1;
    }
}