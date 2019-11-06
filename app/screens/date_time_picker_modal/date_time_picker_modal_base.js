// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    Animated, DatePickerIOS, Text, TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native';

import EventEmitter from 'mattermost-redux/utils/event_emitter';

import {NavigationTypes} from 'app/constants';
import {makeStyleSheetFromTheme} from '../../utils/theme';

const DURATION = 200;
const {View: AnimatedView} = Animated;

export default class DateTimePickerModalBase extends PureComponent {
    static propTypes = {
        deviceHeight: PropTypes.number.isRequired,
        deviceWidth: PropTypes.number.isRequired,
        navigator: PropTypes.object,
        onChange: PropTypes.func.isRequired,
        minimumDate: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired,
    };

    static defaultProps = {
        onOkPress: this.onOkPress,
    };

    onDateChange(changedDate) {
        this.changedDate = changedDate;
    }

    onOkPress = () => {
        this.props.onChange(this.changedDate);
        this.close();
    }

    constructor(props) {
        super(props);

        this.state = {
            top: new Animated.Value(props.deviceHeight),
        };

        this.changedDate = this.props.minimumDate;
    }

    componentDidMount() {
        EventEmitter.on(NavigationTypes.NAVIGATION_CLOSE_MODAL, this.close);
        Animated.timing(this.state.top, {
            toValue: 0,
            duration: DURATION,
        }).start();
    }

    componentWillUnmount() {
        EventEmitter.off(NavigationTypes.NAVIGATION_CLOSE_MODAL, this.close);
    }

    close = () => {
        Animated.timing(this.state.top, {
            toValue: this.props.deviceHeight,
            duration: DURATION,
        }).start(() => {
            this.props.navigator.dismissModal({
                animationType: 'none',
            });
        });
    };

    handleCancel = () => {
        this.onOkPress();
    };

    render() {
        const date = this.props.minimumDate;
        const {theme} = this.props;
        const style = getStyleSheet(theme);

        return (
            <TouchableWithoutFeedback onPress={this.handleCancel}>
                <View style={style.wrapper}>
                    <AnimatedView style={{left: 0, top: this.state.top, width: this.props.deviceWidth}}>
                        <DatePickerIOS
                            mode={'datetime'}
                            date={date}
                            initialDate={date}
                            minimumDate={new Date()}
                            is24Hour={'true'}
                            minuteInterval={30}
                            onDateChange={(changedDate) => this.onDateChange(changedDate)}
                        />
                        <TouchableOpacity
                            style={style.button}
                            onPress={this.onOkPress}
                        >
                            <Text style={style.text}>{'OK'}</Text>
                        </TouchableOpacity>
                    </AnimatedView>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            flex: 1,
            position: 'absolute',
            bottom: 0,
        },
        button: {
            alignItems: 'center',
            backgroundColor: theme.centerChannelBg,
        },
        text: {
            color: theme.centerChannelColor,
        },
    };
});

