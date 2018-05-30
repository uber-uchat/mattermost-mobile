// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

/* eslint-disable global-require*/
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    View,
    AppState,
    Platform,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {Navigation, NativeEventsReceiver} from 'react-native-navigation';

import {Client4} from 'mattermost-redux/client';
import EventEmitter from 'mattermost-redux/utils/event_emitter';

import {
    app,
    store,
} from 'app/mattermost';
import {loadFromPushNotification} from 'app/actions/views/root';
import {ViewTypes} from 'app/constants';
import PushNotifications from 'app/push_notifications';
import {stripTrailingSlashes} from 'app/utils/url';
import {makeStyleSheetFromTheme} from 'app/utils/theme';

import EmptyToolbar from 'app/components/start/empty_toolbar';
import Loading from 'app/components/loading';

const lazyLoadSelectServer = () => {
    return require('app/screens/select_server').default;
};

const lazyLoadChannel = () => {
    return require('app/screens/channel').default;
};

const lazyLoadPushNotifications = () => {
    return require('app/utils/push_notifications').configurePushNotifications;
};

const lazyLoadReplyPushNotifications = () => {
    return require('app/utils/push_notifications').onPushNotificationReply;
};

/**
 * Entry Component:
 * With very little overhead navigate to
 *  - Login or
 *  - Channel Component
 *
 * The idea is to render something to the user as soon as possible
 */
export default class Entry extends PureComponent {
    static propTypes = {
        config: PropTypes.object,
        theme: PropTypes.object,
        navigator: PropTypes.object,
        isLandscape: PropTypes.bool,
        hydrationComplete: PropTypes.bool,
        initializeModules: PropTypes.func.isRequired,
        actions: PropTypes.shape({
            setDeviceToken: PropTypes.func.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            launchLogin: false,
            launchChannel: false,
        };
    }

    componentDidMount() {
        Client4.setUserAgent(DeviceInfo.getUserAgent());
        this.unsubscribeFromStore = store.subscribe(this.listenForHydration);

        EventEmitter.on(ViewTypes.LAUNCH_LOGIN, this.handleLaunchLogin);
        EventEmitter.on(ViewTypes.LAUNCH_CHANNEL, this.handleLaunchChannel);
    }

    componentWillUnmount() {
        EventEmitter.off(ViewTypes.LAUNCH_LOGIN, this.handleLaunchLogin);
        EventEmitter.off(ViewTypes.LAUNCH_CHANNEL, this.handleLaunchChannel);
    }

    handleLaunchLogin = (initializeModules) => {
        this.setState({launchLogin: true});

        if (initializeModules) {
            this.props.initializeModules();
        }
    };

    handleLaunchChannel = (initializeModules) => {
        this.setState({launchChannel: true});

        if (initializeModules) {
            this.props.initializeModules();
        }
    };

    listenForHydration = () => {
        const {getState} = store;
        const state = getState();

        if (!app.isNotificationsConfigured) {
            this.configurePushNotifications();
        }

        if (state.views.root.hydrationComplete) {
            this.unsubscribeFromStore();

            this.setAppCredentials();
            this.setStartupThemes();
            this.setReplyNotifications();

            if (Platform.OS === 'android') {
                this.launchForAndroid();
                return;
            }

            this.launchForiOS();
        }
    };

    configurePushNotifications = () => {
        const configureNotifications = lazyLoadPushNotifications();
        configureNotifications();
    };

    setAppCredentials = () => {
        const {
            actions: {
                setDeviceToken,
            },
        } = this.props;
        const {getState} = store;
        const state = getState();

        const {credentials} = state.entities.general;
        const {currentUserId} = state.entities.users;

        if (app.deviceToken) {
            setDeviceToken(app.deviceToken);
        }

        if (credentials.token && credentials.url) {
            Client4.setToken(credentials.token);
            Client4.setUrl(stripTrailingSlashes(credentials.url));
        }

        if (currentUserId) {
            Client4.setUserId(currentUserId);
        }

        app.setAppCredentials(app.deviceToken, currentUserId, credentials.token, credentials.url);
    };

    setStartupThemes = () => {
        const {theme} = this.props;
        if (app.toolbarBackground === theme.sidebarHeaderBg) {
            return;
        }

        app.setStartupThemes(
            theme.sidebarHeaderBg,
            theme.sidebarHeaderTextColor,
            theme.centerChannelBg
        );
    };

    setReplyNotifications = async () => {
        const notification = PushNotifications.getNotification();

        // If notification exists, it means that the app was started through a reply
        // and the app was not sitting in the background nor opened
        if (notification || app.replyNotificationData) {
            const onPushNotificationReply = lazyLoadReplyPushNotifications();
            const notificationData = notification || app.replyNotificationData;
            const {data, text, badge, completed} = notificationData;

            if (completed) {
                onPushNotificationReply(data, text, badge, completed);
            } else {
                await store.dispatch(loadFromPushNotification(notification));
            }
            PushNotifications.resetNotification();
        }
    };

    launchForAndroid = () => {
        app.launchApp();
    };

    launchForiOS = () => {
        const appNotActive = AppState.currentState !== 'active';

        if (appNotActive) {
            // for iOS replying from push notification starts the app in the background
            app.setShouldRelaunchWhenActive(true);
        } else {
            app.launchApp();
        }
    };

    renderLogin = () => {
        const SelectServer = lazyLoadSelectServer();
        return (
            <SelectServer
                navigator={this.props.navigator}
                allowOtherServers={app.allowOtherServers}
            />
        );
    };

    renderChannel = () => {
        const ChannelScreen = lazyLoadChannel();

        return (
            <ChannelScreen
                navigator={this.props.navigator}
            />
        );
    };

    render() {
        const {
            theme,
            isLandscape,
        } = this.props;
        const styles = getStyleFromTheme(theme);

        if (this.state.launchLogin) {
            return this.renderLogin();
        }

        if (this.state.launchChannel) {
            return this.renderChannel();
        }

        let toolbar = null;
        const backgroundColor = app.appBackground ? app.appBackground : '#ffff';
        if (app.token && app.toolbarBackground) {
            const toolbarTheme = {
                sidebarHeaderBg: app.toolbarBackground,
                sidebarHeaderTextColor: app.toolbarTextColor,
            };

            toolbar = (
                <EmptyToolbar
                    theme={toolbarTheme}
                    isLandscape={isLandscape}
                />
            );
        }

        return (
            <View style={[styles.container, {backgroundColor}]}>
                {toolbar}
                <Loading/>
            </View>
        );
    }
}

const getStyleFromTheme = makeStyleSheetFromTheme(() => {
    return {
        container: {
            flex: 1,
        },
    };
});
