// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

const modulePaths = require('./modulePaths');
const resolve = require('path').resolve;
const fs = require('fs');

const platformRegex = /\.(android\.js|ios\.js)/g;
const modulesRegex = /\/(node_modules)/;

const config = {
    getTransformOptions: (entryFile, {platform}) => {
        console.log('Building modules for', platform);
        const moduleMap = {};
        modulePaths.forEach(path => {
            if (platform && platformRegex.test(path)) {
                path = path.replace(platformRegex, `.${platform}.js`);
            }

            let fsFile = path;
            if (path.match(modulesRegex).length > 1) {
                fsFile = path.replace(modulesRegex, '');
            }

            if (fs.existsSync(fsFile)) {
                moduleMap[resolve(path)] = true;
            }
        });
        return {
            preloadedModules: moduleMap,
            transform: { inlineRequires: { blacklist: moduleMap } },
        };
    },
};

module.exports = config;
