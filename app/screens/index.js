// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {Navigation} from 'react-native-navigation';

import IntlWrapper from 'app/components/root';

function wrapWithContextProvider(Comp, excludeEvents = true) {
    return (props) => { //eslint-disable-line react/display-name
        const {navigator} = props; //eslint-disable-line react/prop-types
        return (
            <IntlWrapper
                navigator={navigator}
                excludeEvents={excludeEvents}
            >
                <Comp {...props}/>
            </IntlWrapper>
        );
    };
}

export function registerScreens(store, Provider) {
    Navigation.registerComponent('About', () => wrapWithContextProvider(require('app/screens/about').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('AddReaction', () => wrapWithContextProvider(require('app/screens/add_reaction').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('AdvancedSettings', () => wrapWithContextProvider(require('app/screens/settings/advanced_settings').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Channel', () => wrapWithContextProvider(require('app/screens/channel').default, false), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('ChannelAddMembers', () => wrapWithContextProvider(require('app/screens/channel_add_members').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('ChannelInfo', () => wrapWithContextProvider(require('app/screens/channel_info').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('ChannelMembers', () => wrapWithContextProvider(require('app/screens/channel_members').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('ChannelPeek', () => wrapWithContextProvider(require('app/screens/channel_peek').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('ClientUpgrade', () => wrapWithContextProvider(require('app/screens/client_upgrade').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('ClockDisplay', () => wrapWithContextProvider(require('app/screens/clock_display').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Code', () => wrapWithContextProvider(require('app/screens/code').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('CreateChannel', () => wrapWithContextProvider(require('app/screens/create_channel').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('DisplaySettings', () => wrapWithContextProvider(require('app/screens/settings/display_settings').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('EditChannel', () => wrapWithContextProvider(require('app/screens/edit_channel').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('EditPost', () => wrapWithContextProvider(require('app/screens/edit_post').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('EditProfile', () => wrapWithContextProvider(require('app/screens/edit_profile').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Entry', () => wrapWithContextProvider(require('app/screens/entry').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('FlaggedPosts', () => wrapWithContextProvider(require('app/screens/flagged_posts').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('ImagePreview', () => wrapWithContextProvider(require('app/screens/image_preview').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('TextPreview', () => wrapWithContextProvider(require('app/screens/text_preview').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Login', () => wrapWithContextProvider(require('app/screens/login').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('LoginOptions', () => wrapWithContextProvider(require('app/screens/login_options').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('LongPost', () => wrapWithContextProvider(require('app/screens/long_post').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('MFA', () => wrapWithContextProvider(require('app/screens/mfa').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('MoreChannels', () => wrapWithContextProvider(require('app/screens/more_channels').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('MoreDirectMessages', () => wrapWithContextProvider(require('app/screens/more_dms').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Notification', () => wrapWithContextProvider(require('app/screens/notification').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('NotificationSettings', () => wrapWithContextProvider(require('app/screens/settings/notification_settings').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('NotificationSettingsEmail', () => wrapWithContextProvider(require('app/screens/settings/notification_settings_email').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('NotificationSettingsMentions', () => wrapWithContextProvider(require('app/screens/settings/notification_settings_mentions').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('NotificationSettingsMentionsKeywords', () => wrapWithContextProvider(require('app/screens/settings/notification_settings_mentions_keywords').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('NotificationSettingsMobile', () => wrapWithContextProvider(require('app/screens/settings/notification_settings_mobile').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('OptionsModal', () => wrapWithContextProvider(require('app/screens/options_modal').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Permalink', () => wrapWithContextProvider(require('app/screens/permalink').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('RecentMentions', () => wrapWithContextProvider(require('app/screens/recent_mentions').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Root', () => require('app/screens/root').default, store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Search', () => wrapWithContextProvider(require('app/screens/search').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('SelectServer', () => wrapWithContextProvider(require('app/screens/select_server').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('SelectTeam', () => wrapWithContextProvider(require('app/screens/select_team').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Settings', () => wrapWithContextProvider(require('app/screens/settings/general').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('SSO', () => wrapWithContextProvider(require('app/screens/sso').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Table', () => wrapWithContextProvider(require('app/screens/table').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('TableImage', () => wrapWithContextProvider(require('app/screens/table_image').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('Thread', () => wrapWithContextProvider(require('app/screens/thread').default), store, Provider); //eslint-disable-line global-require
    Navigation.registerComponent('UserProfile', () => wrapWithContextProvider(require('app/screens/user_profile').default), store, Provider); //eslint-disable-line global-require
}
