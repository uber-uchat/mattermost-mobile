// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {logout, setStatus} from 'mattermost-redux/actions/users';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import SettingsDrawer from './settings_drawer';
import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';

function mapStateToProps(state) {
    const currentUser = getCurrentUser(state);
    const status = getStatusForUserId(state, currentUser.id);

    return {
        currentUser,
        status,
        theme: getTheme(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            logout,
            setStatus,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(SettingsDrawer);
