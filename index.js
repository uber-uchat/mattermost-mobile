// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import telemetry from 'app/utils/telemetry';
telemetry.captureSinceLaunch('index.js');

/* eslint-disable no-unused-vars */
import {AppRegistry, Platform} from 'react-native';

import Mattermost from './app/mattermost';
import ShareExtension from 'share_extension/android';

if (Platform.OS === 'android') {
    AppRegistry.registerComponent('MattermostShare', () => ShareExtension);
}

if (Platform.OS === 'ios') {
    const app = new Mattermost();
}
