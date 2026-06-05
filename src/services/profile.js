import Conf from "conf";

const config = new Conf({
    projectName: "gitshift",
});

export function getProfiles() {
    return config.get("profiles", []);
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

export function getProfile(name) {
    const profiles = getProfiles();

    return profiles.find(
        (profile) => profile.name === name
    );
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