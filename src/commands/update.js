import { execa } from "execa";
import ora from "ora";
import { updateSettings } from "../services/profile.js";
import { error, success } from "../utils/logger.js";

export async function updateCommand(options) {
    if (options.enableAuto) {
        updateSettings({ autoUpdate: true, });
        success("Auto update enabled");
        return;
    }

    if (options.disableAuto) {
        updateSettings({ autoUpdate: false });
        success("Auto update disabled");
        return;
    }

    const spinner = ora("Updating GitShift...").start();

    try {
        await execa(
            "npm",
            [
                "install",
                "-g",
                "gitshift@latest",
            ],
            {
                stdio:
                    "inherit",
            }
        );

        spinner.succeed("GitShift updated");
    } catch (err) {
        spinner.fail("Update failed");
        error(err.message);
    }
}