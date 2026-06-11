import { getRemoteUrl, setRemoteUrl } from "../services/git.js";
import { buildSSHHost, getCurrentProfile, getProfile, getProfiles } from "../services/profile.js";
import { addSSHHost } from "../services/ssh.js";
import { error, success } from "../utils/logger.js";
import { convertToSSHHost } from "../utils/remote.js";

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

        const cwd = process.cwd();
        const host =
            profile.sshHost ||
            buildSSHHost(
                profile.name
            );

        await addSSHHost(host, profile.sshKey);

        const remote = await getRemoteUrl(cwd);

        if (remote.startsWith(`git@${host}:`)) {
            success("Repository already configured");
            console.log(`\n${remote}\n`);
            return;
        }

        const sshRemote = convertToSSHHost(remote, host);

        if (!sshRemote) {
            error("Unsupported remote");
            return;
        }

        await setRemoteUrl(cwd, sshRemote);

        success("Remote repaired");
        console.log(`\n${sshRemote}\n`);
    } catch (err) {
        error(err.message);
    }
}