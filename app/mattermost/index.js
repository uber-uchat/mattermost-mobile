// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

// Used to leverage the platform specific components
import Mattermost, {
    app as MattermostApp,
    store as MattermostStore,
    handleManagedConfig as MattermostHandleConfig
} from './mattermost';

export const app = MattermostApp;
export const store = MattermostStore;
export const handleManagedConfig = MattermostHandleConfig;

export default Mattermost;
