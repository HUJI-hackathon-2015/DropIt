/**
 * Created by tmrlvi on 4/30/15.
 */

SERVER_ADDRESS = 'http://132.65.125.7:8080'
var client = {
    init : function(){
        this.server = io(SERVER_ADDRESS);
        this.server.on("getTags", this.getTagsResponse);
        this.server.on("newLabel", this.newLabelResponse);
        this.server.on("addedLabel", this.addedLabelResp);
        alert("ready");
        this.getTags()
    },

    getTags : function ()
    {
        navigator.wifi.getAccessPoints(function (accessPoints) {
                for (var accessPoint in accessPoints){
                    this.server.emit('getTags', {
                                            'BSSID' : accessPoint.BSSID,
                                            'user' : cordova.plugins.uid.IMEI
                                            });
                }
            },
            function (error) {
                alert("error" + error);
            })
    },

    getTagsResponse : function(data){
                        alert(data);
    },

    newLabel : function(name){
        this.server.emit("newLabel", {'name': name})
    },

    newLabelResponse : function(data){
        alert(data);
    },

    addedLabelResp : function(data){
        alert(data["name"]);
        this.server.emit('addedLabel', { 'status' : 'OK' });
    }


}


document.addEventListener('deviceready', init, false);