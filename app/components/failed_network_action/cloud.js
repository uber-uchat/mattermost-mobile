// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

export default class CloudSvg extends PureComponent {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
    };

    render() {
        const {color, height, width} = this.props;
        return (
            <View style={{height, width, alignItems: 'flex-start'}}>
                <Svg
                    width={width}
                    height={height}
                    viewBox='0 0 72 47'
                >
                    <Path
                        d='M58.464,19.072c0,-5.181 -1.773,-9.599 -5.316,-13.249c-3.545,-3.649 -7.854,-5.474 -12.932,-5.474c-3.597,0 -6.902,0.979 -9.917,2.935c-3.014,1.959 -5.263,4.523 -6.743,7.696c-1.483,-0.739 -2.856,-1.111 -4.126,-1.111c-2.328,0 -4.363,0.769 -6.109,2.301c-1.745,1.535 -2.831,3.466 -3.252,5.792c-2.856,0.952 -5.185,2.672 -6.982,5.156c-1.8,2.487 -2.697,5.316 -2.697,8.489c0,3.915 1.4,7.299 4.204,10.155c2.802,2.857 6.161,4.285 10.076,4.285l43.794,0c3.595,0 6.664,-1.295 9.203,-3.888c2.538,-2.591 3.808,-5.685 3.808,-9.282c0,-3.702 -1.27,-6.848 -3.808,-9.441c-2.539,-2.591 -5.608,-3.888 -9.203,-3.888l0,-0.476Zm-31.294,16.424l17.17,0c-0.842,-1.62 -2.02,-2.92 -3.535,-3.898c-1.515,-0.977 -3.198,-1.467 -5.05,-1.467c-1.852,0 -3.535,0.49 -5.05,1.467c-1.515,0.978 -2.693,2.278 -3.535,3.898l0,0Zm17.338,-12.407c0,-0.782 -0.252,-1.411 -0.757,-1.886c-0.505,-0.474 -1.124,-0.713 -1.852,-0.713c-0.73,0 -1.347,0.239 -1.852,0.713c-0.505,0.475 -0.757,1.104 -0.757,1.886c0,0.783 0.252,1.412 0.757,1.886c0.505,0.476 1.122,0.713 1.852,0.713c0.728,0 1.347,-0.237 1.852,-0.713c0.505,-0.474 0.757,-1.103 0.757,-1.886Zm-12.288,0c0,-0.782 -0.253,-1.411 -0.758,-1.886c-0.505,-0.474 -1.123,-0.713 -1.851,-0.713c-0.73,0 -1.347,0.239 -1.852,0.713c-0.505,0.475 -0.757,1.104 -0.757,1.886c0,0.783 0.252,1.412 0.757,1.886c0.505,0.476 1.122,0.713 1.852,0.713c0.728,0 1.346,-0.237 1.851,-0.713c0.505,-0.474 0.758,-1.103 0.758,-1.886Z'
                        fillRule='evenodd'
                        strokeLinejoin='round'
                        fill={color}
                    />
                </Svg>
            </View>
        );
    }
}
