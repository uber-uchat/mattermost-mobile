

import {NativeModules, Platform, ToastAndroid} from 'react-native';
const {StartTime} = NativeModules;

import logger from 'app/utils/logger';

import avoidNativeBridge from "./avoid_bridge";

const TOAST_LIMIT = 10000;

class Telemetry {
    constructor() {
        /**
         * metric: {
         *   name:
         *   startTime:
         *   endTime:
         *   elapsedTime:
         * }
         */
        this.appStartTime = 0;
        this.reactInitializedStartTime = 0;
        this.reactInitializedEndTime = 0;
        this.metrics = [];
        this.currentMetrics = {};
        this.pendingSinceLaunchMetrics = [];

        this.initializeNativeMetrics();
    }

    initializeNativeMetrics = async () => {
        const nativeTimes = await avoidNativeBridge(
            () => {
                return true;
            },
            () => {
                return {
                    appStartTime: StartTime.appStartTime
                };
            },
            () => {
                return StartTime.getNativeTimes();
            }
        );
        this.appStartTime = nativeTimes.appStartTime;

        // this.reactInitializedStartTime = nativeTimes.reactInitializedStartTime;
        // this.reactInitializedEndTime = nativeTimes.reactInitializedEndTime;
        //
        // this.metrics.push({
        //     name: 'reactInitialized',
        //     startTime: nativeTimes.reactInitializedStartTime,
        //     endTime: nativeTimes.reactInitializedEndTime
        // });

        if (this.pendingSinceLaunchMetrics.length > 0) {
            for (i in this.pendingSinceLaunchMetrics) {
                const pending = this.pendingSinceLaunchMetrics[i];
                this.metrics.push({
                    ...pending,
                    startTime: nativeTimes.appStartTime
                });
            }
            this.pendingSinceLaunchMetrics = [];
        }
    };

    captureStart(name) {
        const d = new Date();
        // initiateMetrics
        this.currentMetrics[name] = {
            name,
            startTime: d.getTime(),
        }
    }

    captureEnd(name) {
        const d = new Date();
        const finalMetric = this.currentMetrics[name];

        this.metrics.push({
            ...finalMetric,
            endTime: d.getTime(),
        });

        delete this.currentMetrics[name]
    }

    capture(name, startTime, endTime) {
        this.metrics.push({
            name,
            startTime,
            endTime
        });
    }

    captureSinceLaunch(name) {
        const d = new Date();

        if (!this.appStartTime) {
            this.pendingSinceLaunchMetrics.push({
                name: `sinceLaunch:${name}`,
                endTime: d.getTime()
            });
            return;
        }

        this.metrics.push({
            name: `sinceLaunch:${name}`,
            startTime: this.appStartTime,
            endTime: d.getTime(),
        });
    }

    toastLaunchTime() {
        const d = new Date();
        const elapsedTime = d.getTime() - this.appStartTime;

        if (Platform.OS === 'android' && elapsedTime < TOAST_LIMIT) {
            ToastAndroid.show(`Launched in ${elapsedTime / 1000} seconds`, ToastAndroid.SHORT);
        }

    }

    sendMetrics() {
        const d = new Date();
        this.metrics.push({
            name: 'totalDuration',
            startTime: this.appStartTime,
            endTime: d.getTime()
        });
        logger('metrics', this.metrics);
    }
}


const telemetry = new Telemetry();
export default telemetry;
