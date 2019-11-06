// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {
    Animated,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Button,
    DatePickerIOS,
} from 'react-native';

import DateTimePickerModalBase from './date_time_picker_modal_base';
import {injectIntl} from 'react-intl';

const {View: AnimatedView} = Animated;

class DateTimePickerModalIOS extends DateTimePickerModalBase {
    render() {
        const date = this.props.minimumDate;

        return (
            <TouchableWithoutFeedback onPress={this.handleCancel}>
                <View style={style.wrapper}>
                    <AnimatedView style={{height: this.props.deviceHeight, left: 0, top: this.state.top, width: this.props.deviceWidth}}>
                        <DatePickerIOS
                            mode={'date'}
                            date={date}
                            initialDate={date}
                            minimumDate={this.props.minimumDate}
                            onDateChange={(changedDate) => this.props.onChange(changedDate)}
                        />
                        <DatePickerIOS
                            mode={'time'}
                            date={date}
                            initialDate={date}
                            minimumDate={this.props.minimumDate}
                            is24Hour={'true'}
                            minuteInterval={30}
                            onDateChange={(changedDate) => this.props.onChange(changedDate)}
                        />
                        <Button
                            title='Ok'
                            onPress={this.close}
                        />
                    </AnimatedView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const style = StyleSheet.create({
    wrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flex: 1,
    },
});

export default injectIntl(DateTimePickerModalIOS);
