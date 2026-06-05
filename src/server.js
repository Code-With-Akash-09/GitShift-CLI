#!/usr/bin/env node

import axios from "axios";
import chalk from "chalk";
import { Command } from "commander";
import { createRequire } from "node:module";
import { addCommand } from "./commands/add.js";
import { autoCommand } from "./commands/auto.js";
import { backupCommand } from "./commands/backup.js";
import { currentCommand } from "./commands/current.js";
import { doctorCommand } from "./commands/doctor.js";
import { linkCommand } from "./commands/link.js";
import { linksCommand } from "./commands/links.js";
import { listCommand } from "./commands/list.js";
import { removeCommand } from "./commands/remove.js";
import { restoreCommand } from "./commands/restore.js";
import { scanCommand } from "./commands/scan.js";
import { unlinkCommand } from "./commands/unlink.js";
import { useCommand } from "./commands/use.js";

const require = createRequire(import.meta.url);
const { name, version } = require("../package.json");

function printBanner() {
    const logo = String.raw`
  ██████╗ ██╗████████╗███████╗██╗  ██╗██╗███████╗████████╗
 ██╔════╝ ██║╚══██╔══╝██╔════╝██║  ██║██║██╔════╝╚══██╔══╝
 ██║  ███╗██║   ██║   ███████╗███████║██║█████╗     ██║
 ██║   ██║██║   ██║   ╚════██║██╔══██║██║██╔══╝     ██║
 ╚██████╔╝██║   ██║   ███████║██║  ██║██║██║        ██║
  ╚═════╝ ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝╚═╝        ╚═╝
`;
    console.log(chalk.cyanBright(logo));
    console.log(chalk.bold("GitShift CLI"));
    console.log(
        chalk.dim("Manage and switch GitHub accounts effortlessly\n")
    );
}

function compareVersions(currentVersion, latestVersion) {
    const currentParts = currentVersion.split(".").map(Number);
    const latestParts = latestVersion.split(".").map(Number);

    for (let index = 0; index < 3; index += 1) {
        const currentPart = currentParts[index] || 0;
        const latestPart = latestParts[index] || 0;

        if (currentPart > latestPart) return 1;
        if (currentPart < latestPart) return -1;
    }

    return 0;
}

async function checkForUpdates() {
    try {
        const response = await axios.get(
            `https://registry.npmjs.org/${name}/latest`,
            {
                timeout: 3000,
            },
        );

        const latestVersion = response.data.version;

        if (latestVersion && compareVersions(version, latestVersion) < 0) {
            console.log(`A new version of ${name} is available: ${version} -> ${latestVersion}`);
            console.log(`Run: npm install -g ${name}`);
        }
    } catch (error) {
        // Ignore version check failures so the CLI still starts offline.
        // intentionally ignore errors (network may be offline)
    }
}

async function main() {
    printBanner();
    await checkForUpdates();

    const program = new Command();

    program
        .name("gitshift")
        .description(
            "GitHub Account Switcher"
        )
        .version(version);

    program
        .command("add")
        .description(
            "Create local profile"
        )
        .action(addCommand);

    program
        .command("list")
        .description(
            "List profiles"
        )
        .action(listCommand);

    program
        .command("current")
        .description(
            "Show active profile"
        )
        .action(currentCommand);

    program
        .command("use <profile>")
        .description(
            "Switch profile and update git config"
        )
        .action(useCommand);

    program
        .command("remove <profile>")
        .description(
            "Remove profile"
        )
        .action(removeCommand);

    program
        .command("scan")
        .description(
            "Import existing SSH keys"
        )
        .action(scanCommand);

    program
        .command(
            "link <folder>"
        )
        .description(
            "Link folder to profile"
        )
        .action(linkCommand);

    program
        .command("unlink <folder>")
        .description(
            "Remove folder mapping"
        )
        .action(unlinkCommand);

    program
        .command("links")
        .description(
            "List folder mappings"
        )
        .action(linksCommand);

    program
        .command("auto")
        .description(
            "Auto switch profile"
        )
        .action(autoCommand);

    program
        .command("doctor")
        .description(
            "System health check"
        )
        .action(doctorCommand);

    program
        .command("backup")
        .description(
            "Backup profiles and mappings"
        )
        .argument("[file]")
        .action(backupCommand);

    program
        .command("restore")
        .description(
            "Restore backup"
        )
        .argument("<file>")
        .action(restoreCommand);

    program.exitOverride();

    try {
        await program.parseAsync(process.argv);
        process.exitCode = 0;
    } catch (err) {
        if (err && (err.name === "CommanderError" || err.code === "outputHelp")) {
            process.exitCode = 0;
        } else {
            throw err;
        }
    }
}

main().catch((error) => {
    if (error) {
        if (error.stack) {
            console.error(error.stack);
        } else {
            console.error(error);
        }

        process.exit(1);
    }
});