import { execa } from "execa";
import fs from "fs-extra";
import os from "os";
import path from "path";

function toSafeKeyName(profileName) {
    const normalized = profileName
        .trim()
        .replace(/[^a-zA-Z0-9._-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return normalized || "profile";
}

export async function generateSSHKey(
    profileName,
    email
) {
    const safeProfileName = toSafeKeyName(
        profileName
    );

    const keyPath = path.join(
        os.homedir(),
        ".ssh",
        `ghswitch-${safeProfileName}`
    );

    const exists = await fs.pathExists(
        keyPath
    );

    if (exists) {
        return keyPath;
    }

    await fs.ensureDir(
        path.dirname(keyPath)
    );

    await execa("ssh-keygen", [
        "-t",
        "ed25519",
        "-C",
        email,
        "-f",
        keyPath,
        "-N",
        "",
    ]);

    return keyPath;
}