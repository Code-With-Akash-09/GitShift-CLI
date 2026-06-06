import { execa } from "execa";
import { getSettings, updateSettings } from "./profile.js";

const DAY =
    24 *
    60 *
    60 *
    1000;

export async function checkForUpdates() {
    const settings = getSettings();

    if (!settings.autoUpdate) {
        return;
    }

    const lastCheck = settings.lastUpdateCheck;

    if (lastCheck && Date.now() - new Date(lastCheck).getTime() < DAY) {
        return;
    }

    try {
        const { stdout, } = await execa(
            "npm",
            [
                "view",
                "gitshift",
                "version",
            ]
        );

        updateSettings({ lastUpdateCheck: new Date().toISOString() });

        return stdout.trim();
    } catch {
        return null;
    }
}