import { execa } from "execa";

export async function setGitUser(name, email, cwd) {
    await execa("git",
        [
            "config",
            "user.name",
            name,
        ],
        { cwd }
    );

    await execa("git",
        [
            "config",
            "user.email",
            email,
        ],
        { cwd }
    );
}

export async function isGitRepo(cwd) {
    try {
        await execa("git",
            [
                "rev-parse",
                "--is-inside-work-tree",
            ],
            { cwd }
        );

        return true;
    } catch {
        return false;
    }
}

export async function getRemoteUrl(cwd) {
    const { stdout } = await execa("git",
        [
            "remote",
            "get-url",
            "origin",
        ],
        { cwd }
    );

    return stdout.trim();
}

export async function setRemoteUrl(cwd, url) {
    await execa("git",
        [
            "remote",
            "set-url",
            "origin",
            url,
        ],
        { cwd }
    );
}