// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {getDimensions} from 'app/selectors/device';

import DateTimePickerModalBase from './date_time_picker_modal_base';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

function mapStateToProps(state) {
    return {
        ...getDimensions(state),
        theme: getTheme(state),
    };
}

export default connect(mapStateToProps)(DateTimePickerModalBase);
