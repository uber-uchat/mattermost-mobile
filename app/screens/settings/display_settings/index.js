// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import DisplaySettings from './display_settings';

function mapStateToProps(state) {
    const config = getConfig(state);

    return {
        enableTimezone: config.EnableTimezoneSelection === 'true',
        theme: getTheme(state)
    };
}

export default connect(mapStateToProps)(DisplaySettings);
