// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    FlatList,
    Text,
    View,
} from 'react-native';
import Diagnostics from 'uchat-mobile-diagnostics';

import {makeStyleSheetFromTheme} from 'app/utils/theme';

class DiagnosticsScreen extends PureComponent {
  static propTypes = {
      clientConnected: PropTypes.bool,
      networkConnected: PropTypes.bool,
      theme: PropTypes.object.isRequired,
      websocketConnected: PropTypes.bool,
  };

  state = {
      averageStartTime: 0,
      startTimeItems: [],
  };

  componentDidMount() {
      this.gatherStartTimes();
  }

  clearStartTimes = async () => {
      await Diagnostics.clearStartUpTimes();
  }

  convertToStatus = (connected) => connected ? 'Online' : 'Offline';

  gatherStartTimes = async () => {
      const startTimes = await Diagnostics.getStartUpTimes();
      const items = Object.values(startTimes);
      const averageTime = items.reduce((acc, i) => {
          return acc + i;
      }, 0) / items.length;

      this.setState({
          averageStartTime: averageTime / 1000,
          startTimeItems: items,
      });
  }

  keyExtractor = ({item}) => item;

  renderItem = ({item}) => {
      const {theme} = this.props;
      const style = getStyleSheet(theme);

      return (
          <View style={style.listRow}>
              <Text style={style.listRowText}>
                  {item / 1000}
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
          startTimeItems,
      } = this.state;

      const style = getStyleSheet(theme);

      return (
          <View style={style.wrapper}>
              <View style={style.row}>
                  <View style={style.rowItem}>
                      <Text style={style.rowItemTitle}>
                          {'Client:'}
                      </Text>
                      <Text style={style.rowItemText}>
                          {this.convertToStatus(clientConnected)}
                      </Text>
                  </View>
                  <View style={style.rowItem}>
                      <Text style={style.rowItemTitle}>
                          {'Network:'}
                      </Text>
                      <Text style={style.rowItemText}>
                          {this.convertToStatus(networkConnected)}
                      </Text>
                  </View>
                  <View style={style.rowItem}>
                      <Text style={style.rowItemTitle}>
                          {'Websocket:'}
                      </Text>
                      <Text style={style.rowItemText}>
                          {this.convertToStatus(websocketConnected)}
                      </Text>
                  </View>
              </View>
              <View style={style.row}>
                  <View>
                      <Text style={style.rowItemTitle}>
                          {'Startups:'}
                      </Text>
                      <Text style={style.rowItemText}>
                          {startTimeItems.length}
                      </Text>
                  </View>
                  <View>
                      <Text style={style.rowItemTitle}>
                          {'Average Time:'}
                      </Text>
                      <Text style={style.rowItemText}>
                          {`${averageStartTime.toFixed(2)}s`}
                      </Text>
                  </View>
              </View>
              <View style={style.row}>
                  <Button
                      title='Clear Start Times'
                      onPress={this.clearStartTimes}
                  />
              </View>
              <View style={style.bottom}>
                  <FlatList
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
    bottom: {
        flex: 1,
    },
    listRow: {
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: theme.centerChannelColor,
        height: 50,
        justifyContent: 'center',
    },
    listRowText: {
        fontSize: 16,
        marginLeft: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 25,
    },
    rowItem: {
        alignItems: 'center',
    },
    wrapper: {
        flex: 1,
        backgroundColor: theme.centerChannelBg,
    },
}));

export default DiagnosticsScreen;