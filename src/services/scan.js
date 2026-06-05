import fg from "fast-glob";
import fs from "fs-extra";
import os from "os";
import path from "path";

export async function findSSHKeys() {
    const sshDir = path.join(os.homedir(), ".ssh");

    const exists =
        await fs.pathExists(sshDir);

    if (!exists) {
        return [];
    }

    const files = await fg("*", {
        cwd: sshDir,
        absolute: true,
        onlyFiles: true,
    });

    return files.filter((file) => {
        const name = path.basename(file);

        if (
            name.endsWith(".pub") ||
            name === "config" ||
            name === "known_hosts" ||
            name === "authorized_keys"
        ) {
            return false;
        }

        return true;
    });
}