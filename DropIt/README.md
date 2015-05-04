# Installation
## Develop environment
In order to develop you'll need nodejs and cordova. The repository does not provide the platform files as they differ
from version to version and shouldn't be changed (Instead change the *relevant* files in plugins or *www*).

*The repository is still under work (there was a mess due to the initial phase was done in 24 hours). Basically, you 
don't need the platforms directory as it is created dynamically. Instead, you should add your own platforms after
checking out.*

### Adding platforms
We need to used cordova-android 3.7.0 since version 4.0.0 has problems with socket.io requests yet.

    $ cordova platforms add android@3.7.0
    
### Running 
Then run:

    $ cordova build
    $ cordova run
    
If run doesn't work, try to erase the app first (it will help in most cases).
If it still doesn't help, run
    
    $ adb install -r <the apk path from build>
    
### Other info
Corodova in a development environment based on plugins. Currently installed plugins are (might be redundant, and need
to add links):

* com.borismus.webintent 1.0.0 "WebIntent" **For file sharing - not working yet**
*  com.phearme.cordovaplugin.ContentProviderPlugin 0.2.7 "ContentProviderPlugin" **???**
*  cordova-plugin-file 2.0.1-dev "File" **???**
*  nl.nielsad.cordova.wifiscanner 0.0.1 "WifiScanner" **For getting wifi list**
*  org.apache.cordova.camera 0.3.6 "Camera" **For getting camera pictures (For sharing)**
*  org.apache.cordova.device 0.3.0 "Device" **For getting device IMEI**
*  org.apache.cordova.dialogs 0.3.0 "Notification" **???**
*  org.hygieiasoft.cordova.uid 1.1.0 "UID" **For getting device IMEI**
