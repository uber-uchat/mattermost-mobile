// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Svg, {
    G,
    Path
} from 'react-native-svg';

export default class AwayStatus extends PureComponent {
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired
    };

    render() {
        return (
            <Svg
                height={this.props.height}
                width={this.props.width}
                viewBox='0 0 120 116'
                fill='none'
                fill-rule='evenodd'
            >
                <G id='Ver-1'>
                    <G
                        id='Loading'
                        transform='translate(-741.000000, -54.000000)'
                        fill='#8ED0BB'
                    >
                        <Path
                            id='Combined-Shape'
                            class='st0'
                            d='M756.300672,54.1197634 L844.934352,54.1197634 C853.384752,54.1197634 860.790192,60.9292255 860.790192,69.3291023 L860.790192,145.716889 L860.790192,166.598318 C860.790192,169.622893 857.111712,171.137562 854.960352,168.998827 L831.537792,145.716889 L756.856032,145.716889 C748.405632,145.716889 740.999952,138.907427 740.999952,130.507312 L740.999952,69.3291023 C740.999952,60.9292255 747.850512,54.1197634 756.300672,54.1197634 Z M816.722083,73.376075 L816.722083,104.800887 C816.722083,115.294587 812.022989,119.652475 801.000482,119.652475 C789.977252,119.652475 785.277917,115.294587 785.277917,104.800887 L785.277917,72 L774.66125,72 C773.733343,72 773.268908,72.4590875 773.268908,73.376075 L773.268908,105.316737 C773.268908,122.864187 784.581746,129 801.000482,129 C817.418254,129 828.731092,122.864187 828.731092,105.316737 L828.731092,72 L818.114425,72 C817.186518,72 816.722083,72.4590875 816.722083,73.376075 Z'
                        />
                    </G>
                </G>
            </Svg>
        );
    }
}
