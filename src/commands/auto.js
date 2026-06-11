
import chalk from "chalk";
import { configureRepositoryAuth } from "../services/auth.js";
import { setGitUser } from "../services/git.js";
import { getFolderMappings, getProfile, setCurrentProfile } from "../services/profile.js";
import { success } from "../utils/logger.js";

export async function autoCommand() {

    console.log(chalk.cyan("\nAuto-switching Git user\n"));

    const cwd = process.cwd();
    const mappings = getFolderMappings();

    const matched = mappings
        .sort(
            (a, b) =>
                b.path.length -
                a.path.length
        )
        .find((mapping) =>
            cwd.startsWith(
                mapping.path
            )
        );

    if (!matched) {
        console.log("\nNo matching profile\n");
        return;
    }

    const profile = getProfile("name", matched.profile);

    if (!profile) {
        return;
    }

    await setGitUser(profile.username, profile.email);
    const authResult = await configureRepositoryAuth(profile, cwd);

    setCurrentProfile(profile.name);
    success(`Switched to ${profile.name}`);

    if (authResult.status === "changed") {
        success("Repository authentication updated");
        console.log(authResult.url);
    }
}
