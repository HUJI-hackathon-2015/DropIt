cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/nl.nielsad.cordova.wifiscanner/www/AccessPoint.js",
        "id": "nl.nielsad.cordova.wifiscanner.AccessPoint",
        "clobbers": [
            "AccessPoint"
        ]
    },
    {
        "file": "plugins/nl.nielsad.cordova.wifiscanner/www/WifiScanner.js",
        "id": "nl.nielsad.cordova.wifiscanner.wifi",
        "clobbers": [
            "navigator.wifi"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.hygieiasoft.cordova.uid/www/uid.js",
        "id": "org.hygieiasoft.cordova.uid.uid",
        "clobbers": [
            "cordova.plugins.uid"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/notification.js",
        "id": "org.apache.cordova.dialogs.notification",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.dialogs/www/android/notification.js",
        "id": "org.apache.cordova.dialogs.notification_android",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/com.borismus.webintent/www/webintent.js",
        "id": "com.borismus.webintent.WebIntent",
        "clobbers": [
            "WebIntent"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "nl.nielsad.cordova.wifiscanner": "0.0.1",
    "org.apache.cordova.device": "0.3.0",
    "org.hygieiasoft.cordova.uid": "1.1.0",
    "org.apache.cordova.dialogs": "0.3.0",
    "com.borismus.webintent": "1.0.0"
}
// BOTTOM OF METADATA
});