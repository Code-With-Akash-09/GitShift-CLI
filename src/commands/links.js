import chalk from "chalk";
import { getFolderMappings } from "../services/profile.js";

export async function linksCommand() {

    console.log(chalk.cyan("\nLinked Folders\n"));

    const mappings = getFolderMappings();

    if (!mappings.length) {
        console.log("\nNo folder mappings\n");
        return;
    }

    mappings.forEach((mapping) => {
        console.log(`${mapping.profile} → ${mapping.path}`);
    });

    console.log();
}