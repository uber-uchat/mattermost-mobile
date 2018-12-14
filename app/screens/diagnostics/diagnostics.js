// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Diagnostics from 'uchat-mobile-diagnostics';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';

class DiagnosticsScreen extends PureComponent {
  static propTypes = {
      clientConnected: PropTypes.bool,
      networkConnected: PropTypes.bool,
      theme: PropTypes.object.isRequired,
      websocketConnected: PropTypes.bool,
  };

  initialState = {
      averageStartTime: 0,
      fastestStartTime: 0,
      slowestStartTime: 0,
      startTimeItems: [],
  };

  state = this.initialState;

  componentDidMount() {
      this.gatherStartTimes();
  }

  clearStartTimes = async () => {
      await Diagnostics.clearStartUpTimes();
      this.setState(this.initialState);
  }

  convertToStatus = (connected) => {
      const {theme} = this.props;
      const style = getStyleSheet(theme);

      const name = connected ? 'thumbs-o-up' : 'thumbs-o-down';
      const color = connected ? theme.onlineIndicator : 'red';

      return (
          <FontAwesomeIcon
              name={name}
              color={color}
              style={style.statusIcon}
              size={40}
          />
      );
  };

  gatherStartTimes = async () => {
      const startTimes = await Diagnostics.getStartUpTimes();

      if (!startTimes) {
          return;
      }

      const items = Object.keys(startTimes).map((k) => ({
          date: k,
          time: startTimes[k],
      }));

      let fastest = items[0].time;
      let slowest = 0;

      const averageTime = items.reduce((acc, i) => {
          if (i.time < fastest) {
              fastest = i.time;
          } else if (i.time > slowest) {
              slowest = i.time;
          }

          return acc + i.time;
      }, 0) / items.length;

      this.setState({
          averageStartTime: averageTime / 1000,
          fastestStartTime: fastest / 1000,
          slowestStartTime: slowest / 1000,
          startTimeItems: items,
      });
  }

  keyExtractor = (item) => item.date;

  renderItem = ({item}) => {
      const {theme} = this.props;
      const style = getStyleSheet(theme);

      return (
          <View style={style.listRow}>
              <Text style={style.listRowText}>
                  {new Date(Number(item.date)).toLocaleString()}
              </Text>
              <Text style={style.listRowText}>
                  {`${item.time / 1000}s`}
              </Text>
          </View>
      );
  }

  render() {
      const {
          clientConnected,
          networkConnected,
          theme,
          websocketConnected,
      } = this.props;
      const {
          averageStartTime,
          fastestStartTime,
          slowestStartTime,
          startTimeItems,
      } = this.state;

      const style = getStyleSheet(theme);

      return (
          <View style={style.wrapper}>
              <View style={style.section}>
                  <View style={style.sectionTitleContainer}>
                      <Text style={style.sectionTitle}>{'Connectivity'}</Text>
                      <View style={style.sectionLine}/>
                  </View>
                  <View style={style.connectivity}>
                      <View style={style.connectivityItem}>
                          <Text style={style.connectivityItemTitle}>
                              {'Device'}
                          </Text>
                          {this.convertToStatus(networkConnected)}
                      </View>
                      <View style={style.connectivityItem}>
                          <Text style={style.connectivityItemTitle}>
                              {'Websocket'}
                          </Text>
                          {this.convertToStatus(websocketConnected)}
                      </View>
                      <View style={style.connectivityItem}>
                          <Text style={style.connectivityItemTitle}>
                              {'Client'}
                          </Text>
                          {this.convertToStatus(clientConnected)}
                      </View>
                  </View>
              </View>
              <View style={style.section}>
                  <View style={style.sectionTitleContainer}>
                      <Text style={style.sectionTitle}>{'Startup'}</Text>
                      <View style={style.sectionLine}/>
                  </View>
                  <View style={style.sectionContent}>
                      <View style={style.totalCountContainer}>
                          <Text style={style.totalCount}>{startTimeItems.length}</Text>
                          <Text style={style.totalCountLabel}>{'Startups'}</Text>
                      </View>
                      <View style={style.startupInfoContainer}>
                          <Text style={style.startupInfoItem}>
                              {`Average startup time is ${averageStartTime.toFixed(2)}s`}
                          </Text>
                          <Text style={style.startupInfoItem}>
                              {`Fastest startup time was ${fastestStartTime.toFixed(2)}s`}
                          </Text>
                          <Text style={style.startupInfoItem}>
                              {`Slowest startup time was ${slowestStartTime.toFixed(2)}s`}
                          </Text>
                          <TouchableOpacity
                              style={style.startupInfoItemButton}
                              onPress={this.clearStartTimes}
                          >
                              <Text style={style.startupInfoItemButtonText}>
                                  {'Clear startup metrics'}
                              </Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </View>
              <View style={[style.section, style.sectionBottom]}>
                  <View style={style.sectionTitleContainer}>
                      <Text style={style.sectionTitle}>{'Times'}</Text>
                      <View style={style.sectionLine}/>
                  </View>
                  <FlatList
                      style={style.list}
                      data={startTimeItems}
                      keyExtractor={this.keyExtractor}
                      renderItem={this.renderItem}
                  />
              </View>
          </View>
      );
  }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => ({
    center: {
        alignItems: 'center',
    },
    connectivity: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    connectivityItem: {
        alignItems: 'center',
    },
    connectivityItemTitle: {
        color: theme.centerChannelColor,
        fontSize: 18,
        fontWeight: '600',
    },
    list: {
        flexGrow: 1,
    },
    listRow: {
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: changeOpacity(theme.centerChannelColor, 0.10),
        height: 50,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listRowText: {
        fontSize: 16,
        marginLeft: 10,
        color: theme.centerChannelColor,
    },
    section: {
        marginBottom: 15,
    },
    sectionBottom: {
        flex: 1,
    },
    sectionContent: {
        flexDirection: 'row',
    },
    sectionTitle: {
        color: theme.centerChannelColor,
        marginRight: 10,
        fontSize: 24,
        fontWeight: '600',
    },
    sectionTitleContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    sectionLine: {
        backgroundColor: theme.centerChannelColor,
        height: 2,
        flex: 1,
    },
    startupInfoContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    startupInfoItem: {
        color: theme.centerChannelColor,
        fontSize: 14,
        marginBottom: 5,
        fontWeight: '600',
    },
    startupInfoItemButton: {
        flexGrow: 1,
        borderWidth: 2,
        borderColor: theme.linkColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginTop: 5,
    },
    startupInfoItemButtonText: {
        color: theme.linkColor,
        marginBottom: 0,
        fontSize: 14,
        fontWeight: '700',
    },
    statusIcon: {
        marginTop: 15,
    },
    totalCount: {
        fontSize: 65,
        color: theme.centerChannelColor,
    },
    totalCountLabel: {
        fontSize: 18,
        color: theme.centerChannelColor,
    },
    totalCountContainer: {
        marginRight: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    wrapper: {
        flex: 1,
        backgroundColor: theme.centerChannelBg,
        margin: 25,
    },
}));

export default DiagnosticsScreen;