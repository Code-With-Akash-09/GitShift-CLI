import Conf from "conf";

const config = new Conf({
    projectName: "gitshift",
});

// Profiles

export function buildSSHHost(name) {
    return `github-${name
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )}`;
}

export function getProfiles() {
    const profiles =
        config.get(
            "profiles",
            []
        );

    return profiles.map(
        (profile) => ({
            ...profile,
            sshHost:
                profile.sshHost ||
                buildSSHHost(
                    profile.name
                ),
        })
    );
}

export function saveProfile(profile) {

    if (
        !profile.name?.trim() ||
        !profile.username?.trim() ||
        !profile.email?.trim()
    ) {
        throw new Error(
            "Invalid profile data"
        );
    }

    const profiles = getProfiles();
    const exists = profiles.find(
        (item) => item.name === profile.name
    );

    if (exists) {
        throw new Error(`Profile "${profile.name}" already exists`);
    }

    profiles.push(profile);
    config.set("profiles", profiles);
}

export function getProfile(field, value) {
    const profiles = getProfiles();

    const profile = profiles.find(
        (profile) => profile[field] === value
    );

    if (!profile) {
        return null;
    }

    return {
        ...profile,
        sshHost:
            profile.sshHost ||
            buildSSHHost(
                profile.name
            ),
    };
}

export function removeProfile(name) {
    const profiles = getProfiles();

    const filtered = profiles.filter(
        (profile) => profile.name !== name
    );

    config.set("profiles", filtered);
}

export function setCurrentProfile(name) {
    if (!name) {
        config.delete("current");
        return;
    }

    config.set("current", name);
}

export function getCurrentProfile() {
    return config.get("current", null);
}

// Folder Mappings

export function getFolderMappings() {
    return config.get("folderMappings", []);
}

export function addFolderMapping(profile, folderPath) {
    const mappings = getFolderMappings();
    const exists = mappings.find((item) => item.path === folderPath);

    if (exists) {
        throw new Error("Folder already mapped");
    }

    mappings.push({ profile, path: folderPath, });
    config.set("folderMappings", mappings);
}

export function removeFolderMapping(folderPath) {
    const mappings = getFolderMappings();
    config.set("folderMappings", mappings.filter((item) => item.path !== folderPath));
}

export function restoreData(data) {

    config.set("profiles", data.profiles || []);
    config.set("folderMappings", data.folderMappings || []);

    if (data.currentProfile) {
        config.set("current", data.currentProfile);
    }
}

// Settings

export function getSettings() {
    return config.get("settings", {
        autoUpdate: false,
        lastUpdateCheck: null,
    });
}

export function updateSettings(settings) {
    const current = getSettings();

    config.set("settings", {
        ...current,
        ...settings,
    });
}