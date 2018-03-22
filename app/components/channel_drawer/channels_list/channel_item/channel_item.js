// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    Platform,
    TouchableHighlight,
    Text,
    View
} from 'react-native';
import {intlShape} from 'react-intl';

import Badge from 'app/components/badge';
import ChannelIcon from 'app/components/channel_icon';
import {wrapWithPreventDoubleTap} from 'app/utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';

const {View: AnimatedView} = Animated;

export default class ChannelItem extends PureComponent {
    static propTypes = {
        channelId: PropTypes.string.isRequired,
        currentChannelId: PropTypes.string.isRequired,
        displayName: PropTypes.string.isRequired,
        fake: PropTypes.bool,
        isUnread: PropTypes.bool,
        mentions: PropTypes.number.isRequired,
        navigator: PropTypes.object,
        onSelectChannel: PropTypes.func.isRequired,
        status: PropTypes.string,
        type: PropTypes.string.isRequired,
        theme: PropTypes.object.isRequired
    };

    static contextTypes = {
        intl: intlShape
    };

    onPress = wrapWithPreventDoubleTap(() => {
        const {channelId, currentChannelId, displayName, fake, onSelectChannel, type} = this.props;
        requestAnimationFrame(() => {
            onSelectChannel({id: channelId, display_name: displayName, fake, type}, currentChannelId);
        });
    });

    onPreview = () => {
        const {channelId, navigator} = this.props;
        if (Platform.OS === 'ios' && navigator && this.previewRef) {
            const {intl} = this.context;

            navigator.push({
                screen: 'ChannelPeek',
                previewCommit: false,
                previewView: this.previewRef,
                previewActions: [{
                    id: 'action-mark-as-read',
                    title: intl.formatMessage({id: 'mobile.channel.markAsRead', defaultMessage: 'Mark As Read'})
                }],
                passProps: {
                    channelId
                }
            });
        }
    };

    setPreviewRef = (ref) => {
        this.previewRef = ref;
    };

    render() {
        const {
            channelId,
            currentChannelId,
            displayName,
            isUnread,
            mentions,
            status,
            theme,
            type
        } = this.props;

        const style = getStyleSheet(theme);
        const isActive = channelId === currentChannelId;

        let extraItemStyle;
        let extraTextStyle;
        let extraBorder;

        if (isActive) {
            extraItemStyle = style.itemActive;
            extraTextStyle = style.textActive;

            extraBorder = (
                <View style={style.borderActive}/>
            );
        } else if (isUnread) {
            extraTextStyle = style.textUnread;
        }

        let badge;
        if (mentions) {
            badge = (
                <Badge
                    style={style.badge}
                    countStyle={style.mention}
                    count={mentions}
                    minHeight={20}
                    minWidth={20}
                    onPress={this.onPress}
                />
            );
        }

        const icon = (
            <ChannelIcon
                isActive={isActive}
                channelId={channelId}
                isUnread={isUnread}
                membersCount={displayName.split(',').length}
                size={16}
                status={status}
                theme={theme}
                type={type}
            />
        );

        return (
            <AnimatedView ref={this.setPreviewRef}>
                <TouchableHighlight
                    underlayColor={changeOpacity(theme.sidebarTextHoverBg, 0.5)}
                    onPress={this.onPress}
                    onLongPress={this.onPreview}
                >
                    <View style={style.container}>
                        {extraBorder}
                        <View style={[style.item, extraItemStyle]}>
                            {icon}
                            <Text
                                style={[style.text, extraTextStyle]}
                                ellipsizeMode='tail'
                                numberOfLines={1}
                            >
                                {displayName}
                            </Text>
                            {badge}
                        </View>
                    </View>
                </TouchableHighlight>
            </AnimatedView>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            flex: 1,
            flexDirection: 'row',
            height: 44
        },
        borderActive: {
            backgroundColor: theme.sidebarTextActiveBorder,
            width: 5
        },
        item: {
            alignItems: 'center',
            height: 44,
            flex: 1,
            flexDirection: 'row',
            paddingLeft: 16
        },
        itemActive: {
            backgroundColor: changeOpacity(theme.sidebarTextActiveColor, 0.1),
            paddingLeft: 11
        },
        text: {
            color: changeOpacity(theme.sidebarText, 0.4),
            flex: 1,
            fontSize: 14,
            fontWeight: '600',
            lineHeight: 16,
            paddingRight: 40
        },
        textActive: {
            color: theme.sidebarTextActiveColor
        },
        textUnread: {
            color: theme.sidebarUnreadText
        },
        badge: {
            backgroundColor: theme.mentionBj,
            borderColor: theme.sidebarHeaderBg,
            borderRadius: 10,
            borderWidth: 1,
            padding: 3,
            position: 'relative',
            right: 16
        },
        mention: {
            color: theme.mentionColor,
            fontSize: 10
        }
    };
});
