// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUserId, getStatusForUserId} from 'mattermost-redux/selectors/entities/users';
import {getConfig} from 'mattermost-redux/selectors/entities/general';

import NotificationSettingsAutoResponder from './notification_settings_auto_responder';
import {bindActionCreators} from 'redux';
import {updateMe} from 'mattermost-redux/actions/users';

function mapStateToProps(state) {
    const currentUserId = getCurrentUserId(state);
    const currentUserStatus = getStatusForUserId(state, currentUserId);

    const config = getConfig(state);
    const enableAutoResponder = config.ExperimentalEnableAutomaticReplies === 'true';
    const showOooInStatusDropdown = config.ShowOutOfOfficeInStatusDropdown === 'true' && enableAutoResponder;
    const enableOutOfOfficeDatePicker = config.EnableOutOfOfficeDatePicker === 'true' && showOooInStatusDropdown;

    return {
        theme: getTheme(state),
        currentUserStatus,
        updateMeRequest: state.requests.users.updateMe,
        enableOutOfOfficeDatePicker,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            updateMe,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationSettingsAutoResponder);
