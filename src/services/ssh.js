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

export async function generateSSHKey(profileName, email) {
    const safeProfileName = toSafeKeyName(profileName);
    const keyPath = path.join(
        os.homedir(),
        ".ssh",
        `gitshift-${safeProfileName}`
    );

    const exists = await fs.pathExists(keyPath);

    if (exists) {
        return keyPath;
    }

    await fs.ensureDir(path.dirname(keyPath));
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

export async function getPublicKey(privateKeyPath) {
    const publicKey = `${privateKeyPath}.pub`;
    const exists = await fs.pathExists(publicKey);

    if (!exists) {
        return null;
    }

    return fs.readFile(
        publicKey,
        "utf8"
    );
}

export async function addSSHHost(host, keyPath) {
    const sshConfigPath = path.join(
        os.homedir(),
        ".ssh",
        "config"
    );

    await fs.ensureFile(sshConfigPath);

    let config = await fs.readFile(sshConfigPath, "utf8");

    if (config.includes(`Host ${host}`)) {
        return;
    }

    config += `
Host ${host}
    HostName github.com
    User git
    IdentityFile ${keyPath}
    IdentitiesOnly yes
`;

    await fs.writeFile(sshConfigPath, config);
}

export async function verifySSHHost(host) {
    try {
        const { stderr } = await execa("ssh",
            [
                "-T",
                host,
            ],
            {
                reject: false,
            }
        );

        return stderr || "";
    } catch {
        return "";
    }
}