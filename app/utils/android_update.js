// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {
    ToastAndroid,
    PermissionsAndroid
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

const APK_MIME_TYPE = 'application/vnd.android.package-archive';
const EXTERNAL_STORAGE_PERMISSION = 'android.permission.WRITE_EXTERNAL_STORAGE';

class AndroidUpdate {
    checkForExternalStoragePermissions = async () => {
        const canWriteToStorage = await PermissionsAndroid.check(EXTERNAL_STORAGE_PERMISSION);
        if (!canWriteToStorage) {
            const permissionRequest = await PermissionsAndroid.request(EXTERNAL_STORAGE_PERMISSION, 'We need access to the downloads folder to save files.');
            return permissionRequest === 'granted';
        }

        return true;
    };

    parseMeta = (url) => {
        const fileName = url.replace(/^.*[\\/]/, '');
        const tokens = fileName.split('-');

        let title = 'Install uChat';
        if (tokens.length && tokens.length > 3) {
            const buildVersion = `v${tokens[1]}-${tokens[2]}`;
            title += ' ' + buildVersion;
        }

        return {
            title,
            fileName
        };
    };

    start = async (url) => {
        const canWriteToStorage = await this.checkForExternalStoragePermissions();
        if (!canWriteToStorage) {
            // onDownloadCancel();
            return;
        }

        try {
            ToastAndroid.show('Download started', ToastAndroid.SHORT);

            const {title, fileName} = this.parseMeta(url);
            const task = RNFetchBlob.config({
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    path: `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`,
                    title,
                    mime: APK_MIME_TYPE,
                    mediaScannable: true
                }
            }).fetch('GET', url);

            await task;

            ToastAndroid.show('Download complete', ToastAndroid.SHORT);
        } catch (error) {
            ToastAndroid.show('Download failed', ToastAndroid.SHORT);
        }
    };
}

export default new AndroidUpdate();
