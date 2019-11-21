// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import Preferences from 'mattermost-redux/constants/preferences';
import {General} from 'mattermost-redux/constants';
import {shallowWithIntl} from 'test/intl-test-helper';

import NotificationSettingsAutoResponder from './notification_settings_auto_responder';
import TextInputWithLocalizedPlaceholder from 'app/components/text_input_with_localized_placeholder';
import Section from 'app/screens/settings/section';

describe('NotificationSettingsAutoResponder', () => {
    const navigator = {
        setOnNavigatorEvent: jest.fn(),
        setButtons: jest.fn(),
    };

    const baseProps = {
        currentUser: {},
        theme: Preferences.THEMES.default,
        onBack: jest.fn(),
        currentUserStatus: General.OUT_OF_OFFICE,
        updateMeRequest: {},
        enableOutOfOfficeDatePicker: false,
        navigator,
    };

    test('should match snapshot', () => {
        const wrapper = shallowWithIntl(
            <NotificationSettingsAutoResponder {...baseProps}/>,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
        expect(wrapper.setProps({enableOutOfOfficeDatePicker: false}));
        expect(wrapper.find(TextInputWithLocalizedPlaceholder).length).toBe(0);
        expect(wrapper.find(Section).length).toBe(1);
    });
});
