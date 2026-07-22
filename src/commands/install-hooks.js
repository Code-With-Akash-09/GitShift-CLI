import chalk from "chalk";
import fs from "fs-extra";
import os from "os";
import path from "path";
import { error, success } from "../utils/logger.js";

export async function installHooksCommand() {
    console.log(chalk.cyan("\nInstalling GitShift Shell Hooks for Auto-Switching\n"));

    const home = os.homedir();
    const shell = process.env.SHELL || "";
    let installedAny = false;

    if (shell.includes("zsh")) {
        const zshrcPath = path.join(home, ".zshrc");
        const hookSnippet = `\n# GitShift auto-switcher hook\nchpwd() {\n    command gitshift auto --silent >/dev/null 2>&1\n}\n`;

        await fs.ensureFile(zshrcPath);
        const content = await fs.readFile(zshrcPath, "utf8");

        if (!content.includes("gitshift auto")) {
            await fs.appendFile(zshrcPath, hookSnippet);
            success(`Added Zsh auto-switch hook to ${zshrcPath}`);
            installedAny = true;
        } else {
            console.log(chalk.gray(`Zsh hook already present in ${zshrcPath}`));
            installedAny = true;
        }
    } else if (shell.includes("bash")) {
        const bashrcPath = path.join(home, ".bashrc");
        const hookSnippet = `\n# GitShift auto-switcher hook\nPROMPT_COMMAND='gitshift auto --silent >/dev/null 2>&1'\n`;

        await fs.ensureFile(bashrcPath);
        const content = await fs.readFile(bashrcPath, "utf8");

        if (!content.includes("gitshift auto")) {
            await fs.appendFile(bashrcPath, hookSnippet);
            success(`Added Bash auto-switch hook to ${bashrcPath}`);
            installedAny = true;
        } else {
            console.log(chalk.gray(`Bash hook already present in ${bashrcPath}`));
            installedAny = true;
        }
    } else {
        error("Unsupported shell. Please manually add 'gitshift auto --silent' to your shell profile.");
    }

    if (installedAny) {
        console.log(chalk.green("Auto-switching is now enabled! Reload your shell (e.g. `source ~/.zshrc`).\n"));
    }
}
