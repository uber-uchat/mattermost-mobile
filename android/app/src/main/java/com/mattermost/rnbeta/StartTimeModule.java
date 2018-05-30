package com.mattermost.rnbeta;

import android.app.Application;
import android.app.KeyguardManager;
import android.content.Context;
import android.database.Cursor;
import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.storage.AsyncStorageModule;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;
import com.oblador.keychain.KeychainModule;
import com.reactnativenavigation.NavigationApplication;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import javax.annotation.Nullable;

/**
 * Created by miguelespinoza on 3/22/18.
 */

public class StartTimeModule extends ReactContextBaseJavaModule {

    private final Application mApplication;

    public StartTimeModule(Application application, ReactApplicationContext reactContext) {
        super(reactContext);
        mApplication = application;
    }

    @Override
    public String getName() {
        return "StartTime";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();

        /**
         * KeyStore:__________
         * credentialsExist
         * deviceToken
         * currentUserId
         * token
         * url
         *
         * AsyncStorage:__________
         * toolbarBackground
         * toolbarTextColor
         * appBackground
         * isDeviceSecure
         *
         * MattermostManaged.Config
         */

        NavigationApplication app = (NavigationApplication) mApplication;
        final Boolean[] credentialsExist = {false};
        final WritableMap[] credentials = {null};
        final Object[] config = {null};

        KeychainModule module = new KeychainModule(this.getReactApplicationContext());
        module.getGenericPasswordForOptions(null, new Promise() {
            @Override
            public void resolve(@Nullable Object value) {
                if (value instanceof Boolean && !(Boolean)value) {
                    credentialsExist[0] = false;
                    return;
                }

                WritableMap map = (WritableMap) value;
                if (map != null) {
                    credentialsExist[0] = true;
                    credentials[0] = map;
                }
            }

            @Override
            public void reject(String code, String message) {

            }

            @Override
            public void reject(String code, Throwable e) {

            }

            @Override
            public void reject(String code, String message, Throwable e) {

            }

            @Override
            public void reject(String message) {

            }

            @Override
            public void reject(Throwable reason) {

            }
        });

        {   // Get managedConfig from MattermostManagedModule
            MattermostManagedModule.getInstance().getConfig(new Promise() {
                @Override
                public void resolve(@Nullable Object value) {
                    WritableNativeMap nativeMap = (WritableNativeMap) value;
                    config[0] = value;
                }

                @Override
                public void reject(String code, String message) {

                }

                @Override
                public void reject(String code, Throwable e) {

                }

                @Override
                public void reject(String code, String message, Throwable e) {

                }

                @Override
                public void reject(String message) {

                }

                @Override
                public void reject(Throwable reason) {

                }
            });
        }


        {   // Get values stored in AsyncStorage
            AsyncStorageModule storage = new AsyncStorageModule(this.getReactApplicationContext());
            final ArrayList<String> keys = new ArrayList<String>(5);
            keys.add("TOOLBAR_BACKGROUND");
            keys.add("TOOLBAR_TEXT_COLOR");
            keys.add("APP_BACKGROUND");
            ReadableArray asyncStorageKeys = new ReadableArray() {
                @Override
                public int size() {
                    return keys.size();
                }

                @Override
                public boolean isNull(int index) {
                    return false;
                }

                @Override
                public boolean getBoolean(int index) {
                    return false;
                }

                @Override
                public double getDouble(int index) {
                    return 0;
                }

                @Override
                public int getInt(int index) {
                    return 0;
                }

                @Override
                public String getString(int index) {
                    return keys.get(index);
                }

                @Override
                public ReadableArray getArray(int index) {
                    return null;
                }

                @Override
                public ReadableMap getMap(int index) {
                    return null;
                }

                @Override
                public Dynamic getDynamic(int index) {
                    return null;
                }

                @Override
                public ReadableType getType(int index) {
                    return null;
                }

                @Override
                public ArrayList<Object> toArrayList() {
                    return null;
                }
            };

            HashMap<String, String> asyncStorageResults = this.getFromRNAsyncStorage(asyncStorageKeys);

            String toolbarBackground = asyncStorageResults.get("TOOLBAR_BACKGROUND");
            String toolbarTextColor = asyncStorageResults.get("TOOLBAR_TEXT_COLOR");
            String appBackground = asyncStorageResults.get("APP_BACKGROUND");

            if (toolbarBackground != null
                    && toolbarTextColor != null
                    && appBackground != null) {

                constants.put("themesExist", true);
                constants.put("toolbarBackground", toolbarBackground);
                constants.put("toolbarTextColor", toolbarTextColor);
                constants.put("appBackground", appBackground);
            } else {
                constants.put("themesExist", false);
            }
        }

        // LocalAuth isDeviceSecure
//        KeyguardManager mKeyguardManager = (KeyguardManager) this.getReactApplicationContext().getSystemService(Context.KEYGUARD_SERVICE);
//        Boolean isDeviceSecure = null;
//        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
//            isDeviceSecure = mKeyguardManager.isDeviceSecure();
//            constants.put("isDeviceSecure", isDeviceSecure);
//        }


        if (credentialsExist[0]) {
            constants.put("credentialsExist", true);
            constants.put("credentials", credentials[0]);
        } else {
            constants.put("credentialsExist", false);
        }

        constants.put("appStartTime", app.APP_START_TIME);
        constants.put("managedConfig", config[0]);


        return constants;
    }

    @ReactMethod
    public void getNativeTimes(Promise promise) {
        NavigationApplication app = (NavigationApplication) mApplication;


        WritableMap map = Arguments.createMap();
        map.putDouble("appStartTime", app.APP_START_TIME);
        map.putDouble("reactInitializedStartTime", app.REACT_INITIALIZED_START_TIME);
        map.putDouble("reactInitializedEndTime", app.REACT_INITIALIZED_END_TIME);
        map.putDouble("jsBundleRunStartTime", app.JS_BUNDLE_RUN_START_TIME);
        map.putDouble("jsBundleRunEndTime", app.JS_BUNDLE_RUN_END_TIME);

        promise.resolve(map);
    }

    @ReactMethod
    public void sinceLaunch(String msg, Promise promise) {
        long sinceLaunchTime = System.currentTimeMillis() - MainApplication.APP_START_TIME;
        Log.e("Mattermost", "StartTimeModule.SinceLaunch {" + msg + "}  = " + sinceLaunchTime);

        WritableMap map = Arguments.createMap();
        map.putDouble("sinceLaunchTime", sinceLaunchTime);

        promise.resolve(map);
    }

    public HashMap<String, String> getFromRNAsyncStorage(ReadableArray keys) {
        HashMap<String, String> results = new HashMap<>(keys.size());

        final int MAX_SQL_KEYS = 999;
        Context reactContext = this.getReactApplicationContext();
        HashSet<String> keysRemaining = new HashSet<>();
        String[] columns = {"key", "value"};
        ReactDatabaseSupplier reactDatabaseSupplier = ReactDatabaseSupplier.getInstance(reactContext);
        for (int keyStart = 0; keyStart < keys.size(); keyStart += MAX_SQL_KEYS) {
            int keyCount = Math.min(keys.size() - keyStart, MAX_SQL_KEYS);
            Cursor cursor = reactDatabaseSupplier.get().query(
                    "catalystLocalStorage", // TODO: refactor constants to final String
                    columns,
                    buildKeySelection(keyCount),
                    buildKeySelectionArgs(keys, keyStart, keyCount),
                    null,
                    null,
                    null);
            keysRemaining.clear();
            try {
                if (cursor.getCount() != keys.size()) {
                    // some keys have not been found - insert them with null into the final array
                    for (int keyIndex = keyStart; keyIndex < keyStart + keyCount; keyIndex++) {
                        keysRemaining.add(keys.getString(keyIndex));
                    }
                }

                if (cursor.moveToFirst()) {
                    do {
                        results.put(cursor.getString(0), cursor.getString(1));
                        keysRemaining.remove(cursor.getString(0));
                    } while (cursor.moveToNext());
                }
            } catch (Exception e) {
                return new HashMap<>(1);
            } finally {
                cursor.close();
            }

            for (String key : keysRemaining) {
                results.put(key, null);
            }
            keysRemaining.clear();
        }

        return results;
    }

    static String buildKeySelection(int selectionCount) {
        String[] list = new String[selectionCount];
        Arrays.fill(list, "?");
        return "key" + " IN (" + TextUtils.join(", ", list) + ")";
    }

    static String[] buildKeySelectionArgs(ReadableArray keys, int start, int count) {
        String[] selectionArgs = new String[count];
        for (int keyIndex = 0; keyIndex < count; keyIndex++) {
            selectionArgs[keyIndex] = keys.getString(start + keyIndex);
        }
        return selectionArgs;
    }
}
