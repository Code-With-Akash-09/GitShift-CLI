import { getRemoteUrl, isGitRepo, setRemoteUrl } from "./git.js";
import { buildSSHHost } from "./profile.js";
import { addSSHHost } from "./ssh.js";
import { convertToSSHHost } from "../utils/remote.js";

export async function configureRepositoryAuth(profile, cwd = process.cwd()) {
    const isRepo = await isGitRepo(cwd);

    if (!isRepo) {
        return {
            status: "skipped",
            reason: "not-git-repo",
        };
    }

    if (!profile.sshKey) {
        return {
            status: "skipped",
            reason: "missing-ssh-key",
        };
    }

    const host = profile.sshHost || buildSSHHost(profile.name);

    await addSSHHost(host, profile.sshKey);

    let remote;

    try {
        remote = await getRemoteUrl(cwd);
    } catch {
        return {
            status: "skipped",
            reason: "missing-remote",
        };
    }

    if (remote.startsWith(`git@${host}:`)) {
        return {
            status: "unchanged",
            url: remote,
        };
    }

    const sshRemote = convertToSSHHost(remote, host);

    if (!sshRemote) {
        return {
            status: "skipped",
            reason: "unsupported-remote",
            url: remote,
        };
    }

    await setRemoteUrl(cwd, sshRemote);

    return {
        status: "changed",
        url: sshRemote,
    };
}
