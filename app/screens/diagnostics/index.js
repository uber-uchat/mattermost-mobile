// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {Client4} from 'mattermost-redux/client';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import Diagnostics from './diagnostics';

function mapStateToProps(state) {
    return {
        clientConnected: Client4.online,
        networkConnected: state.device.connection,
        theme: getTheme(state),
        websocketConnected: state.device.websocket.connected,
    };
}

export default connect(mapStateToProps)(Diagnostics);
