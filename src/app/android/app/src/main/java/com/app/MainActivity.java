package com.app;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.rnfs.RNFSPackage;
import com.umeng.analytics.MobclickAgent;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent splash=new Intent(this,SplashScreen.class);
        splash.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);

        this.startActivity(splash);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "app";
    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }
}
