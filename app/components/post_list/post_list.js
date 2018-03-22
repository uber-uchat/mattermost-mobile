// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    InteractionManager,
    Platform,
    StyleSheet,
    FlatList
} from 'react-native';

import ChannelIntro from 'app/components/channel_intro';
import Post from 'app/components/post';
import {DATE_LINE, START_OF_NEW_MESSAGES} from 'app/selectors/post_list';
import mattermostManaged from 'app/mattermost_managed';
import {makeExtraData} from 'app/utils/list_view';

import DateHeader from './date_header';
import LoadMorePosts from './load_more_posts';
import NewMessagesDivider from './new_messages_divider';
import withLayout from './with_layout';

const DateHeaderWithLayout = withLayout(DateHeader);
const NewMessagesDividerWithLayout = withLayout(NewMessagesDivider);
const PostWithLayout = withLayout(Post);

export default class PostList extends PureComponent {
    static propTypes = {
        actions: PropTypes.shape({
            refreshChannelWithRetry: PropTypes.func.isRequired
        }).isRequired,
        channelId: PropTypes.string,
        currentUserId: PropTypes.string,
        highlightPostId: PropTypes.string,
        indicateNewMessages: PropTypes.bool,
        initialBatchToRender: PropTypes.number.isRequired,
        isSearchResult: PropTypes.bool,
        lastViewedAt: PropTypes.number, // Used by container // eslint-disable-line no-unused-prop-types
        loadMore: PropTypes.func,
        measureCellLayout: PropTypes.bool,
        navigator: PropTypes.object,
        onPostPress: PropTypes.func,
        onRefresh: PropTypes.func,
        postIds: PropTypes.array.isRequired,
        renderReplies: PropTypes.bool,
        showLoadMore: PropTypes.bool,
        shouldRenderReplyButton: PropTypes.bool,
        theme: PropTypes.object.isRequired
    };

    static defaultProps = {
        loadMore: () => true
    };

    newMessagesIndex = -1;
    scrollToMessageTries = 0;
    makeExtraData = makeExtraData();
    itemMeasurements = {};

    state = {
        managedConfig: {},
        scrollToMessage: false
    };

    componentWillMount() {
        this.listenerId = mattermostManaged.addEventListener('change', this.setManagedConfig);
    }

    componentDidMount() {
        this.setManagedConfig();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.postIds !== this.props.postIds) {
            this.newMessagesIndex = -1;
        }
        if (this.props.channelId !== nextProps.channelId) {
            this.itemMeasurements = {};
            this.newMessageScrolledTo = false;
        }
    }

    componentDidUpdate(prevProps) {
        const initialPosts = !prevProps.postIds.length && prevProps.postIds !== this.props.postIds;
        if ((prevProps.channelId !== this.props.channelId || initialPosts) && this.refs.list) {
            this.scrollToBottomOffset();
        } else if ((this.props.measureCellLayout || this.props.isSearchResult) && this.state.scrollToMessage) {
            this.scrollListToMessageOffset();
        }
    }

    componentWillUnmount() {
        mattermostManaged.removeEventListener(this.listenerId);
    }

    scrollToBottomOffset = () => {
        InteractionManager.runAfterInteractions(() => {
            if (this.refs.list) {
                this.refs.list.scrollToOffset({offset: 0, animated: false});
            }
        });
    }

    getMeasurementOffset = (index) => {
        const orderedKeys = Object.keys(this.itemMeasurements).sort().slice(0, index);
        return orderedKeys.map((i) => this.itemMeasurements[i]).reduce((a, b) => a + b, 0);
    }

    scrollListToMessageOffset = () => {
        const index = this.moreNewMessages ? this.props.postIds.length : this.newMessagesIndex;
        if (index !== -1) {
            let offset = this.getMeasurementOffset(index);

            const windowHeight = this.state.postListHeight;
            if (index !== this.props.postIds.length - 1) {
                if (offset < windowHeight) {
                    return; // no need to scroll since item is in view
                } else if (offset > windowHeight) {
                    offset = (offset - (windowHeight / 2)) + this.itemMeasurements[index];
                }
            }

            InteractionManager.runAfterInteractions(() => {
                if (this.refs.list) {
                    if (!this.moreNewMessages) {
                        this.newMessageScrolledTo = true;
                    }

                    this.refs.list.scrollToOffset({offset, animated: true});
                    this.newMessagesIndex = -1;
                    this.moreNewMessages = false;
                    this.setState({
                        scrollToMessage: false
                    });
                }
            });
        }
    }

    setManagedConfig = async (config) => {
        let nextConfig = config;
        if (!nextConfig) {
            nextConfig = await mattermostManaged.getLocalConfig();
        }

        this.setState({
            managedConfig: nextConfig
        });
    };

    keyExtractor = (item) => {
        // All keys are strings (either post IDs or special keys)
        return item;
    };

    onRefresh = () => {
        const {
            actions,
            channelId,
            onRefresh
        } = this.props;

        if (channelId) {
            actions.refreshChannelWithRetry(channelId);
        }

        if (onRefresh) {
            onRefresh();
        }
    };

    measureItem = (index, height) => {
        this.itemMeasurements[index] = height;
        if (this.props.postIds.length === Object.values(this.itemMeasurements).length) {
            if (this.newMessagesIndex !== -1 && !this.newMessageScrolledTo) {
                this.setState({
                    scrollToMessage: true
                });
            }
        }
    }

    renderItem = ({item, index}) => {
        if (item === START_OF_NEW_MESSAGES) {
            this.newMessagesIndex = index;
            this.moreNewMessages = this.props.postIds.length === index + 2;
            return (
                <NewMessagesDividerWithLayout
                    index={index}
                    onLayoutCalled={this.measureItem}
                    theme={this.props.theme}
                    moreMessages={this.moreNewMessages}
                    shouldCallOnLayout={this.props.measureCellLayout && !this.newMessageScrolledTo}
                />
            );
        } else if (item.indexOf(DATE_LINE) === 0) {
            const date = item.substring(DATE_LINE.length);
            return this.renderDateHeader(new Date(date), index);
        }

        const postId = item;

        // Remember that the list is rendered with item 0 at the bottom so the "previous" post
        // comes after this one in the list
        const previousPostId = index < this.props.postIds.length - 1 ? this.props.postIds[index + 1] : null;
        const nextPostId = index > 0 ? this.props.postIds[index - 1] : null;

        return this.renderPost(postId, previousPostId, nextPostId, index);
    };

    renderDateHeader = (date, index) => {
        return (
            <DateHeaderWithLayout
                date={date}
                index={index}
                onLayoutCalled={this.measureItem}
                shouldCallOnLayout={this.props.measureCellLayout && !this.newMessageScrolledTo}
            />
        );
    };

    renderPost = (postId, previousPostId, nextPostId, index) => {
        const {
            highlightPostId,
            isSearchResult,
            navigator,
            onPostPress,
            renderReplies,
            shouldRenderReplyButton
        } = this.props;
        const {managedConfig} = this.state;

        const highlight = highlightPostId === postId;
        if (highlight) {
            this.newMessagesIndex = index;
        }

        return (
            <PostWithLayout
                postId={postId}
                previousPostId={previousPostId}
                nextPostId={nextPostId}
                highlight={highlight}
                index={index}
                renderReplies={renderReplies}
                isSearchResult={isSearchResult}
                shouldRenderReplyButton={shouldRenderReplyButton}
                onPress={onPostPress}
                navigator={navigator}
                managedConfig={managedConfig}
                onLayoutCalled={this.measureItem}
                shouldCallOnLayout={this.props.measureCellLayout && !this.newMessageScrolledTo}
            />
        );
    };

    renderFooter = () => {
        if (!this.props.channelId) {
            return null;
        }

        if (this.props.showLoadMore) {
            return (
                <LoadMorePosts
                    channelId={this.props.channelId}
                    theme={this.props.theme}
                />
            );
        }

        return (
            <ChannelIntro
                channelId={this.props.channelId}
                navigator={this.props.navigator}
            />
        );
    };

    onLayout = (event) => {
        const {height} = event.nativeEvent.layout;
        this.setState({
            postListHeight: height
        });
    }

    render() {
        const {
            channelId,
            highlightPostId,
            initialBatchToRender,
            loadMore,
            postIds
        } = this.props;

        const refreshControl = {
            refreshing: false
        };

        if (channelId) {
            refreshControl.onRefresh = this.onRefresh;
        }

        return (
            <FlatList
                onLayout={this.onLayout}
                ref='list'
                data={postIds}
                extraData={this.makeExtraData(channelId, highlightPostId)}
                initialNumToRender={initialBatchToRender}
                maxToRenderPerBatch={initialBatchToRender + 1}
                inverted={true}
                keyExtractor={this.keyExtractor}
                ListFooterComponent={this.renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
                {...refreshControl}
                renderItem={this.renderItem}
                contentContainerStyle={styles.postListContent}
            />
        );
    }
}

const styles = StyleSheet.create({
    postListContent: {
        paddingTop: 5
    }
});
