import chalk from "chalk";
import path from "path";
import { configureRepositoryAuth } from "../services/auth.js";
import { setGitUser } from "../services/git.js";
import { getFolderMappings, getProfile, setCurrentProfile } from "../services/profile.js";
import { success } from "../utils/logger.js";

export async function autoCommand(options = {}) {
    const isSilent = Boolean(options.silent);

    if (!isSilent) {
        console.log(chalk.cyan("\nAuto-switching Git user\n"));
    }

    const cwd = path.resolve(process.cwd());
    const mappings = getFolderMappings();

    const matched = mappings
        .sort((a, b) => b.path.length - a.path.length)
        .find((mapping) => {
            const targetPath = path.resolve(mapping.path);
            return cwd === targetPath || cwd.startsWith(targetPath + path.sep);
        });

    if (!matched) {
        if (!isSilent) {
            console.log("\nNo matching profile for current folder\n");
        }
        return;
    }

    const profile = getProfile("name", matched.profile);

    if (!profile) {
        return;
    }

    try {
        await setGitUser(profile.username, profile.email, cwd);
        const authResult = await configureRepositoryAuth(profile, cwd);

        setCurrentProfile(profile.name);

        if (!isSilent) {
            success(`Switched to ${profile.name} (user: ${profile.username})`);

            if (authResult.status === "changed") {
                success("Repository authentication updated");
                console.log(authResult.url);
            }
        }
    } catch (err) {
        if (!isSilent) {
            console.error(chalk.red(`Failed auto switch: ${err.message}`));
        }
    }
}
