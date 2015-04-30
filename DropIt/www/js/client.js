/**
 * Created by tmrlvi on 4/30/15.
 */

var SERVER_ADDRESS = 'http://132.65.120.137:3000';
var server = io(SERVER_ADDRESS);

var socketClient = {

    init : function(){
        server.on("getTags", socketClient.getTagsResponse);
        server.on("newLabel", socketClient.newLabelResponse);
        server.on("addedLabel", socketClient.addedLabelResp);
        socketClient.getTags();
    },

    getTags: function ()
    {
        navigator.wifi.getAccessPoints(function (accessPoints) {
                var chosen = null;
                for (var index in accessPoints){
                    if (chosen === null || accessPoints[index].level > chosen.level){
                        chosen = accessPoints[index]
                    }
                }
                server.emit('getTags', {
                    'BSSID' : chosen.BSSID,
                    'user' : cordova.plugins.uid.IMEI
                });
            },
            function (error) {
                alert("Error obtaining wifi list: " + error.message);
            })
    },

    getTagsResponse : function(data){
        data["location"];
        for (index in data["labels"]){
            alert(data["labels"][index]["name"] + " " + data["labels"][index]["priority"] + " " + data["labels"][index]["members"]);
        }
    },

    newLabel : function(name){
        server.emit("newLabel", {'name': name})
    },

    newLabelResponse : function(data){
        alert(data);
    },

    addedLabelResp : function(data){
        server.emit('addedLabel', { 'status' : 'OK' });
    }


}

document.addEventListener('deviceready', socketClient.init, false);