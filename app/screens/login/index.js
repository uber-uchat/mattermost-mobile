// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import LoginActions from 'app/actions/views/login';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {checkMfa, login} from 'mattermost-redux/actions/users';

import Login from './login.js';

function mapStateToProps(state) {
    const {checkMfa: checkMfaRequest, login: loginRequest} = state.requests.users;
    const {config, license} = state.entities.general;
    const currentUser = getCurrentUser(state);
    return {
        ...state.views.login,
        checkMfaRequest,
        loginRequest,
        config,
        license,
        currentUser,
        enableTimezone: config.EnableTimezoneSelection === 'true',
        theme: getTheme(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            ...LoginActions,
            checkMfa,
            login
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
