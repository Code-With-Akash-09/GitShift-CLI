import { getFolderMappings } from "../services/profile.js";

export async function linksCommand() {
    const mappings = getFolderMappings();

    if (!mappings.length) {
        console.log("\nNo folder mappings\n");
        return;
    }

    console.log();

    mappings.forEach((mapping) => {
        console.log(`${mapping.profile} → ${mapping.path}`);
    });

    console.log();
}