// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import SelectTimezone from './select_timezone';

function mapStateToProps(state, props) {
    const {selectedTimezone} = props;
    const config = getConfig(state);
    const supportedTimezones = config.SupportedTimezones || [];

    let index = 0;

    const timezoneIndex = supportedTimezones.findIndex((timezone) => timezone === selectedTimezone);
    if (timezoneIndex > 0) {
        index = timezoneIndex;
    }

    return {
        theme: getTheme(state),
        timezones: supportedTimezones,
        initialScrollIndex: index
    };
}

export default connect(mapStateToProps, null)(SelectTimezone);
