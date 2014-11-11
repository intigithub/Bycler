/**
 * Created by zilnus on 23-10-14.
 */
App.info({
    id: 'com.mobile.meteor.bycler',
    name: 'Bycler',
    description: 'Comparte el movimiento',
    author: 'Bycler',
    email: 'info@bycler.com',
    website: 'http://www.bycler.com',
    version: '0.0.4'
});

App.icons({
    'iphone': 'public/launchers/ios/icon-60.png',
    'iphone_2x': 'public/launchers/ios/Icon-60@2x.png',
    'iphone_3x': 'public/launchers/ios/Icon-60@3x.png',
    'android_ldpi': 'public/launchers/android/ic_launcher_ldpi.png',
    'android_mdpi': 'public/launchers/android/ic_launcher_mdpi.png',
    'android_hdpi': 'public/launchers/android/ic_launcher_hdpi.png',
    'android_xhdpi': 'public/launchers/android/ic_launcher_xhdpi.png'
});
App.launchScreens({
    // iOS
    'iphone': 'public/splash/splash-320x480.png',
    'iphone_2x': 'public/splash/splash-320x480@2x.png',
    'iphone5': 'public/splash/splash-320x568@2x.png',
    'ipad_portrait': 'public/splash/splash-768x1024.png',
    'ipad_portrait_2x': 'public/splash/splash-768x1024@2x.png',
    'ipad_landscape': 'public/splash/splash-1024x768.png',
    'ipad_landscape_2x': 'public/splash/splash-1024x768@2x.png',

    // Android
    'android_ldpi_portrait': 'public/splash/splash-200x320.png',
    'android_ldpi_landscape': 'public/splash/splash-320x200.png',
    'android_mdpi_portrait': 'public/splash/splash-320x480.png',
    'android_mdpi_landscape': 'public/splash/splash-480x320.png',
    'android_hdpi_portrait': 'public/splash/splash-480x800.png',
    'android_hdpi_landscape': 'public/splash/splash-800x480.png',
    'android_xhdpi_portrait': 'public/splash/splash-720x1280.png',
    'android_xhdpi_landscape': 'public/splash/splash-1280x720.png'
});

App.setPreference('StatusBarOverlaysWebView', 'false');
App.setPreference('StatusBarBackgroundColor', '#000000');