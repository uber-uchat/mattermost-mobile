// Copyright (c) 2016 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

var path = require('path');

var config = {
    getProjectRoots() {
        return [
            path.resolve(__dirname, '.')
        ];
    }
};

module.exports = config;
