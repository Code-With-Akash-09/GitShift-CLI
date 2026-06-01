import { execa } from "execa";

import {
    error,
    success,
} from "../utils/logger.js";

async function check(
    name,
    command,
    args = []
) {
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

    await check("Git", "git", [
        "--version",
    ]);

    await check("SSH", "ssh", [
        "-V",
    ]);

    await check(
        "GitHub CLI",
        "gh",
        ["--version"]
    );

    console.log();
}