// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {Linking as RNLinking} from 'react-native';

import AndroidUpdate from 'app/utils/android_update';

const linkPolicies = [
    {
        id: 'android-update',
        url: 'https://uchatapp.awscorp.uberinternal.com/.*/.*.apk',
        invoke: AndroidUpdate.start
    }
];

class Linking {
    constructor() {
        this.linkBlockingPolicies = linkPolicies;
    }

    isLinkBlocked = (url) => {
        let linkBlocked = false;

        if (this.linkBlockingPolicies.length) {
            this.linkBlockingPolicies.forEach((policy) => {
                if (url.match(policy.url) && policy.invoke) {
                    policy.invoke(url);
                    linkBlocked = true;
                }
            });
        }

        return linkBlocked;
    };

    canOpenURL = (url) => {
        return RNLinking.canOpenURL(url);
    };

    openURL = (url) => {
        const blocked = this.isLinkBlocked(url);

        if (blocked) {
            return;
        }

        RNLinking.canOpenURL(url).then((supported) => {
            if (supported) {
                RNLinking.openURL(url);
            }
        });
    };
}

export default new Linking();
