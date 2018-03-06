// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {getCurrentUser, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';
import {getMyPreferences, getTheme} from 'mattermost-redux/selectors/entities/preferences';

import {handleUpdateUserNotifyProps} from 'app/actions/views/account_notifications';

import NotificationSettings from './notification_settings';

function mapStateToProps(state) {
    const currentUser = getCurrentUser(state);
    const currentUserStatus = getStatusForUserId(state, currentUser.id);

    return {
        config: state.entities.general.config,
        currentUser,
        currentUserStatus,
        myPreferences: getMyPreferences(state),
        updateMeRequest: state.requests.users.updateMe,
        theme: getTheme(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            handleUpdateUserNotifyProps,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettings);
