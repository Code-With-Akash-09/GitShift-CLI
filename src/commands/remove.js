import {
    getCurrentProfile,
    getProfile,
    removeProfile,
    setCurrentProfile,
} from "../services/profile.js";

import {
    error,
    success,
} from "../utils/logger.js";

export async function removeCommand(
    profileName
) {
    const profile =
        getProfile(profileName);

    if (!profile) {
        error("Profile not found");

        return;
    }

    removeProfile(profileName);

    if (
        getCurrentProfile() ===
        profileName
    ) {
        setCurrentProfile(null);
    }

    success(
        `Profile "${profileName}" removed`
    );
}