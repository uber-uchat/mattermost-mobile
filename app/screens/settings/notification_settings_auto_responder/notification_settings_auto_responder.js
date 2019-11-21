// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
    Alert,
    View,
    Platform,
    DatePickerAndroid,
    TimePickerAndroid,
    TouchableOpacity,
    Text,
} from 'react-native';
import {RequestStatus} from 'mattermost-redux/constants';
import {intlShape} from 'react-intl';

import FormattedText from 'app/components/formatted_text';
import StatusBar from 'app/components/status_bar';
import TextInputWithLocalizedPlaceholder from 'app/components/text_input_with_localized_placeholder';
import {getNotificationProps} from 'app/utils/notify_props';
import {changeOpacity, makeStyleSheetFromTheme, setNavigatorStyles} from 'app/utils/theme';
import {t} from 'app/utils/i18n';

import Section from 'app/screens/settings/section';
import SectionItem from 'app/screens/settings/section_item';

export default class NotificationSettingsAutoResponder extends PureComponent {
    static propTypes = {
        currentUser: PropTypes.object.isRequired,
        navigator: PropTypes.object,
        theme: PropTypes.object.isRequired,
        currentUserStatus: PropTypes.string.isRequired,
        updateMeRequest: PropTypes.object.isRequired,
        updateMe: PropTypes.func.isRequired,
        enableOutOfOfficeDatePicker: PropTypes.bool.isRequired,
    };

    saveAutoResponder = (notifyProps) => {
        const {intl} = this.context;

        if (!notifyProps.auto_responder_message || notifyProps.auto_responder_message === '') {
            notifyProps.auto_responder_message = intl.formatMessage({
                id: 'mobile.notification_settings.auto_responder.default_message',
                defaultMessage: 'Hello, I am out of office and unable to respond to messages.',
            });
        }

        this.props.updateMe({notify_props: notifyProps});
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.theme !== nextProps.theme) {
            setNavigatorStyles(this.props.navigator, nextProps.theme);
        }

        const {updateMeRequest} = nextProps;
        const {intl} = this.context;
        if (this.props.updateMeRequest !== updateMeRequest && updateMeRequest.status === RequestStatus.FAILURE) {
            Alert.alert(
                intl.formatMessage({
                    id: 'mobile.notification_settings.save_failed_title',
                    defaultMessage: 'Connection issue',
                }),
                intl.formatMessage({
                    id: 'mobile.notification_settings.save_failed_description',
                    defaultMessage: 'The notification settings failed to save due to a connection issue, please try again.',
                })
            );
        }
    }

    static contextTypes = {
        intl: intlShape,
    };

    constructor(props, context) {
        super(props, context);
        const {currentUser} = props;
        const {intl} = this.context;
        const notifyProps = getNotificationProps(currentUser);

        const autoResponderDefault = intl.formatMessage({
            id: 'mobile.notification_settings.auto_responder.default_message',
            defaultMessage: 'Hello, I am out of office and unable to respond to messages.',
        });

        props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

        const autoResponderActive = notifyProps.auto_responder_active;

        this.state = {
            ...notifyProps,
            auto_responder_active: autoResponderActive,
            auto_responder_message: notifyProps.auto_responder_message || autoResponderDefault,
            oooStartDateTime: '',
            oooEndDateTime: '',
        };

        if (autoResponderActive === 'true') {
            if (notifyProps.fromDate !== '') {
                const fromDate = new Date(notifyProps.fromDate);
                const fromTime = moment(notifyProps.fromTime, 'hh:mm A');
                fromDate.setHours(fromTime.hour(), fromTime.minute());
                this.state.oooStartDateTime = fromDate;
            }

            if (notifyProps.toDate !== '') {
                const toDate = new Date(notifyProps.toDate);
                const toTime = moment(notifyProps.toTime, 'hh:mm A');
                toDate.setHours(toTime.hour(), toTime.minute());
                this.state.oooEndDateTime = toDate;
            }
        }
    }

    onNavigatorEvent = (event) => {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'close-settings') {
                this.props.navigator.dismissModal({
                    animationType: 'slide-down',
                });
            }
        }
    };

    handleOk = () => {
        this.saveUserNotifyProps();
        this.props.navigator.dismissModal({
            animationType: 'slide-down',
        });
    };

    saveUserNotifyProps = () => {
        const onBackProps = {
            ...this.state,
            user_id: this.props.currentUser.id,
            fromDate: '',
            fromTime: '',
            toDate: '',
            toTime: '',
        };

        if (this.props.enableOutOfOfficeDatePicker && this.state.auto_responder_active) {
            onBackProps.fromDate = this.state.oooStartDateTime === '' ? '' : moment(this.state.oooStartDateTime).format('YYYY-MM-DD');
            onBackProps.fromTime = this.state.oooStartDateTime === '' ? '' : moment(this.state.oooStartDateTime).format('hh:mm A');
            onBackProps.toDate = this.state.oooEndDateTime === '' ? '' : moment(this.state.oooEndDateTime).format('YYYY-MM-DD');
            onBackProps.toTime = this.state.oooEndDateTime === '' ? '' : moment(this.state.oooEndDateTime).format('hh:mm A');
        }

        this.saveAutoResponder({
            ...onBackProps,
        });
    };

    onAutoResponseToggle = (active) => {
        if (active) {
            this.setState({auto_responder_active: 'true'});
            return;
        }
        this.setState({auto_responder_active: 'false'}, this.saveUserNotifyProps);
    };

    onAutoResponseChangeText = (message) => {
        this.setState({auto_responder_message: message});
    };

    openDateTimePicker = (onChange, minimumDate) => {
        this.props.navigator.showModal({
            screen: 'DateTimePickerModal',
            title: '',
            animationType: 'none',
            passProps: {
                onChange,
                minimumDate,
            },
            navigatorStyle: {
                navBarHidden: true,
                statusBarHidden: false,
                statusBarHideWithNavBar: false,
                screenBackgroundColor: 'transparent',
                modalPresentationStyle: 'overCurrentContext',
            },
        });
    };

    handleStartDateTimeChange = (date) => {
        this.setState({oooStartDateTime: date});
        if (this.state.oooEndDateTime === '') {
            return;
        }
        if (date > this.state.oooEndDateTime) {
            this.setState({oooEndDateTime: date});
        }
    };

    handleEndDateTimeChange = (date) => {
        this.setState({oooEndDateTime: date});
        if (this.state.oooStartDateTime === '') {
            return;
        }
        if (date < this.state.oooStartDateTime) {
            this.setState({oooStartDateTime: date});
        }
    };

    handleStartDateTimeIos = () => {
        this.openDateTimePicker(this.handleStartDateTimeChange,
            this.state.oooStartDateTime === '' ? new Date() : this.state.oooStartDateTime);
    };

    handleEndDateTimeIos = () => {
        this.openDateTimePicker(this.handleEndDateTimeChange,
            this.state.oooEndDateTime === '' ? new Date() : this.state.oooEndDateTime);
    };

    handleStartTimeAndroid = async (date) => {
        const {action, hour, minute} = await TimePickerAndroid.open({
            hour: date.getHours(),
            minute: date.getMinutes(),
        });
        if (action === TimePickerAndroid.timeSetAction) {
            date.setHours(hour, minute, 0, 0);
            this.handleStartDateTimeChange(date);
        }
    };

    handleStartDateAndroid = async () => {
        const {action, year, month, day} = await DatePickerAndroid.open({
            date: this.state.oooStartDateTime === '' ? new Date() : this.state.oooStartDateTime,
            minDate: new Date(),
        });
        if (action === DatePickerAndroid.dateSetAction) {
            const date = new Date();
            date.setFullYear(year, month, day);
            this.handleStartTimeAndroid(date);
        }
    };

    handleEndTimeAndroid = async (date) => {
        const {action, hour, minute} = await TimePickerAndroid.open({
            hour: date.getHours(),
            minute: date.getMinutes(),
        });
        if (action === TimePickerAndroid.timeSetAction) {
            date.setHours(hour, minute, 0, 0);
            this.handleEndDateTimeChange(date);
        }
    };

    handleEndDateAndroid = async () => {
        const {action, year, month, day} = await DatePickerAndroid.open({
            date: this.state.oooEndDateTime === '' ? new Date() : this.state.oooEndDateTime,
            minDate: new Date(),
        });
        if (action === DatePickerAndroid.dateSetAction) {
            const date = new Date();
            date.setFullYear(year, month, day);
            this.handleEndTimeAndroid(date);
        }
    };

    render() {
        const {theme} = this.props;
        const {
            auto_responder_active: autoResponderActive,
            auto_responder_message: autoResponderMessage,
        } = this.state;

        const isOooDatePickerEnabled = this.props.enableOutOfOfficeDatePicker;
        const style = getStyleSheet(theme);

        const autoResponderActiveLabel = (
            <FormattedText
                id='mobile.notification_settings.auto_responder.enabled'
                defaultMessage='Enabled'
            />
        );

        const autoResponderInactiveLabel = (
            <FormattedText
                id='mobile.notification_settings.auto_responder.disabled'
                defaultMessage='Disabled'
            />
        );

        const fromDateButton = (
            <TouchableOpacity
                style={style.button}
                onPress={Platform.OS === 'ios' ? this.handleStartDateTimeIos : this.handleStartDateAndroid}
            >
                {this.state.oooStartDateTime === '' && (
                    <FormattedText
                        id={'mobile.notification_settings.auto_responder.from_date_text'}
                        defaultMessage={'From: Now'}
                        style={style.disabledText}
                    />
                )}
                {this.state.oooStartDateTime !== '' && (
                    <Text style={style.text}>
                        {'From: ' + moment(this.state.oooStartDateTime).format('YYYY-MM-DD hh:mm A')} </Text>
                )}
            </TouchableOpacity>
        );

        const toDateButton = (
            <TouchableOpacity
                style={style.button}
                onPress={Platform.OS === 'ios' ? this.handleEndDateTimeIos : this.handleEndDateAndroid}
            >
                {this.state.oooEndDateTime === '' && (
                    <FormattedText
                        id={'mobile.notification_settings.auto_responder.to_date_text'}
                        defaultMessage={'To: Until I turn it off'}
                        style={style.disabledText}
                    />
                )}
                {this.state.oooEndDateTime !== '' && (
                    <Text style={style.text}>
                        {'To: ' + moment(this.state.oooEndDateTime).format('YYYY-MM-DD hh:mm A')} </Text>
                )}
            </TouchableOpacity>
        );

        return (
            <View style={style.container}>
                <StatusBar/>
                <View style={style.wrapper}>
                    <Section
                        disableHeader={true}
                        theme={theme}
                    >
                        <SectionItem
                            label={autoResponderActive ? autoResponderActiveLabel : autoResponderInactiveLabel}
                            action={this.onAutoResponseToggle}
                            actionType='toggle'
                            selected={autoResponderActive === 'true'}
                            theme={theme}
                        />
                    </Section>
                    {autoResponderActive === 'true' && (
                        <View>
                            {isOooDatePickerEnabled && (
                                <Section
                                    theme={theme}
                                >
                                    {fromDateButton}
                                </Section>
                            )}
                            {isOooDatePickerEnabled && (
                                <Section
                                    theme={theme}
                                >
                                    {toDateButton}
                                </Section>
                            )}
                            <Section
                                headerId={t('mobile.notification_settings.auto_responder.message_title')}
                                headerDefaultMessage='CUSTOM MESSAGE'
                                theme={theme}
                            >
                                <View style={style.inputContainer}>
                                    <TextInputWithLocalizedPlaceholder
                                        autoFocus={true}
                                        ref={this.keywordsRef}
                                        value={autoResponderMessage}
                                        blurOnSubmit={false}
                                        onChangeText={this.onAutoResponseChangeText}
                                        multiline={true}
                                        style={style.input}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        placeholder={{id: t('mobile.notification_settings.auto_responder.message_placeholder'), defaultMessage: 'Message'}}
                                        placeholderTextColor={changeOpacity(theme.centerChannelColor, 0.4)}
                                        textAlignVertical='top'
                                        underlineColorAndroid='transparent'
                                        returnKeyType='done'
                                    />
                                </View>
                            </Section>
                            <TouchableOpacity
                                style={style.button}
                                onPress={this.handleOk}
                            >
                                <Text style={style.text}>{'OK'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <FormattedText
                        id={'mobile.notification_settings.auto_responder.footer_message'}
                        defaultMessage={'Set a custom message that will be automatically sent in response to Direct Messages. Mentions in Public and Private Channels will not trigger the automated reply. Enabling Automatic Replies sets your status to Out of Office and disables email and push notifications.'}
                        style={style.footer}
                    />
                </View>
            </View>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            flex: 1,
            backgroundColor: theme.centerChannelBg,
        },
        wrapper: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.06),
            flex: 1,
            paddingTop: 35,
        },
        inputContainer: {
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderTopColor: changeOpacity(theme.centerChannelColor, 0.1),
            borderBottomColor: changeOpacity(theme.centerChannelColor, 0.1),
            backgroundColor: theme.centerChannelBg,
        },
        input: {
            color: theme.centerChannelColor,
            fontSize: 15,
            height: 150,
            paddingHorizontal: 15,
            paddingVertical: 10,
        },
        footer: {
            marginHorizontal: 15,
            fontSize: 12,
            color: changeOpacity(theme.centerChannelColor, 0.5),
        },
        separator: {
            marginTop: 35,
        },
        button: {
            alignItems: 'center',
            backgroundColor: theme.centerChannelBg,
            padding: 10,
        },
        text: {
            color: theme.centerChannelColor,
        },
        disabledText: {
            fontSize: 15,
            color: changeOpacity(theme.centerChannelColor, 0.5),
        },
    };
});
