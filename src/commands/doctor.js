import { execa } from "execa";
import { error, success } from "../utils/logger.js";

async function check(name, command, args = []) {
    try {
        await execa(command, args);
        success(`${name} installed`);
        return true;
    } catch {
        error(`${name} missing`);
        return false;
    }
}

export async function doctorCommand() {
    console.log();

    await check("Git", "git", ["--version",]);
    await check("SSH", "ssh", ["-V",]);

    const ghInstalled = await check("GitHub CLI", "gh", ["--version"]);

    if (!ghInstalled) {
        console.log();
        console.log("Hint: Install GitHub CLI (macOS): `brew install gh`");
        console.log("Then authenticate with: `gh auth login`");
    }

    console.log();
}