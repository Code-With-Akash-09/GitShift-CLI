import { execa } from "execa";

export async function setGitUser(name, email) {
    await execa("git", [
        "config",
        "--global",
        "user.name",
        name,
    ]);

    await execa("git", [
        "config",
        "--global",
        "user.email",
        email,
    ]);
}