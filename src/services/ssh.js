import { execa } from "execa";
import fs from "fs-extra";
import os from "os";
import path from "path";

export async function generateSSHKey(
    profileName,
    email
) {
    const keyPath = path.join(
        os.homedir(),
        ".ssh",
        `ghswitch-${profileName}`
    );

    const exists = await fs.pathExists(
        keyPath
    );

    if (exists) {
        return keyPath;
    }

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