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
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "nl.nielsad.cordova.wifiscanner": "0.0.1"
}
// BOTTOM OF METADATA
});