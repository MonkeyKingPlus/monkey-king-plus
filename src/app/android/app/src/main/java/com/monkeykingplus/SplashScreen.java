package com.monkeykingplus;

import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;

/**
 * Created by yzw on 2016/10/24.
 */
public class SplashScreen extends Activity {

    private final int SPLASH_SCREEN_DISPLAY_LENGTH=1000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.setContentView(R.layout.splash_screen);

        new Handler().postDelayed(new Runnable(){
            @Override
            public void run() {
                /* Create an Intent that will start the Menu-Activity. */
//                Intent mainIntent = new Intent(SplashScreen.this,MainApplication.class);
//                SplashScreen.this.startActivity(mainIntent);
                SplashScreen.this.finish();
                SplashScreen.this.overridePendingTransition(0,R.anim.fade_out);
            }
        }, SPLASH_SCREEN_DISPLAY_LENGTH);
    }
}
