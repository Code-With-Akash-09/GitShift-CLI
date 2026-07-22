import { execa } from "execa";

export async function setGitUser(name, email, cwd = process.cwd()) {
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

export async function isGitRepo(cwd = process.cwd()) {
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

export async function getRemoteUrl(cwd = process.cwd()) {
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

export async function setRemoteUrl(cwd = process.cwd(), url) {
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