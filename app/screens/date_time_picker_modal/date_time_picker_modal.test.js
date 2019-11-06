// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';

import {shallowWithIntl} from 'test/intl-test-helper';

import DateTimePickerModalBase from './date_time_picker_modal_base';

describe('DateTimePickerModalBase', () => {
    const navigator = {
        setOnNavigatorEvent: jest.fn(),
        setButtons: jest.fn(),
    };
    const baseProps = {
        deviceHeight: 320,
        deviceWidth: 120,
        navigator,
        onChange: jest.fn(),
        minimumDate: new Date(),
    };

    test('should match snapshot', () => {
        const wrapper = shallowWithIntl(
            <DateTimePickerModalBase {...baseProps}/>,
        );

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
