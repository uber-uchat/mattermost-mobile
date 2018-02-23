// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import DeviceInfo from 'react-native-device-info';
import {updateUser} from 'app/actions/views/edit_profile';
import {mattermostStore} from 'app/mattermost';

export function getSupportedTimezones(supportedTimezones) {
    if (supportedTimezones) {
        return supportedTimezones.split(',');
    }
    return [];
}

export function getDeviceTimezone() {
    return DeviceInfo.getTimezone();
}

function updateUserTimezone(user) {
    const {dispatch, getState} = mattermostStore;
    updateUser(user)(dispatch, getState);
}

export function autoUpdateTimezone(currentUser) {
    const {timezone: uTimezone} = currentUser;
    const userTimezone = normalizeTimezone(uTimezone);
    const browserTimezone = getDeviceTimezone();
    const newTimezoneExists = userTimezone.automaticTimezone !== browserTimezone;

    if (userTimezone.useAutomaticTimezone && newTimezoneExists) {
        const timezone = {
            useAutomaticTimezone: 'true',
            automaticTimezone: browserTimezone,
            manualTimezone: userTimezone.manualTimezone
        };

        const updatedUser = {
            ...currentUser,
            timezone
        };

        updateUserTimezone(updatedUser);
    }
}

export function getCurrentTimezone(userTimezone) {
    if (userTimezone.useAutomaticTimezone) {
        return userTimezone.automaticTimezone;
    }
    return userTimezone.manualTimezone;
}

export function getTimezoneRegion(timezone) {
    if (timezone) {
        const split = timezone.split('/');
        if (split.length > 1) {
            const region = split.pop();
            if (region.indexOf('_') >= 0) {
                return region.replace('_', ' ');
            }
            return region;
        }
    }

    return timezone;
}

export function normalizeTimezone({
    useAutomaticTimezone,
    automaticTimezone,
    manualTimezone
}) {
    let useAutomatic = useAutomaticTimezone;
    if (typeof useAutomaticTimezone === 'string') {
        useAutomatic = useAutomaticTimezone === 'true';
    }

    return {
        useAutomaticTimezone: useAutomatic,
        automaticTimezone,
        manualTimezone
    };
}
