import axios from "axios";
import { execa } from "execa";
import { getPublicKey } from "./ssh.js";

/**
 * Upload SSH key to GitHub using a Personal Access Token (PAT)
 * @param {string} token - GitHub PAT with admin:public_key or write:public_key scope
 * @param {string} title - Title for the key in GitHub
 * @param {string} privateKeyPath - Path to private key
 */
export async function uploadSSHKeyToGitHub(token, title, privateKeyPath) {
    const publicKey = await getPublicKey(privateKeyPath);

    if (!publicKey) {
        throw new Error(`Public key file not found for ${privateKeyPath}`);
    }

    const response = await axios.post(
        "https://api.github.com/user/keys",
        {
            title,
            key: publicKey.trim(),
        },
        {
            headers: {
                Authorization: `token ${token.trim()}`,
                Accept: "application/vnd.github+json",
                "User-Agent": "GitShift-CLI",
            },
        }
    );

    return response.data;
}

/**
 * Check if GitHub CLI (`gh`) is installed and available
 */
export async function isGHCLIAvailable() {
    try {
        await execa("gh", ["--version"]);
        return true;
    } catch {
        return false;
    }
}

/**
 * Upload SSH key to GitHub using GitHub CLI (`gh`)
 * @param {string} title - Title for the key in GitHub
 * @param {string} privateKeyPath - Path to private key
 */
export async function uploadSSHKeyViaGHCLI(title, privateKeyPath) {
    const publicKeyPath = `${privateKeyPath}.pub`;

    const { stdout } = await execa("gh", [
        "ssh-key",
        "add",
        publicKeyPath,
        "--title",
        title,
    ]);

    return stdout.trim();
}
