package com.mattermost.rnbeta;

import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import static android.content.Context.ACTIVITY_SERVICE;

public class OnUpgradeReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(final Context context, final Intent intent) {
        Log.i("OnUpgradeReceiver", "onReceive begin");
        ((ActivityManager)context.getSystemService(ACTIVITY_SERVICE)).clearApplicationUserData();
    }
}