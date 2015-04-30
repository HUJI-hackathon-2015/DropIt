/**
 * Created by tmrlvi on 4/30/15.
 */

var SERVER_ADDRESS = 'http://132.65.120.137:3000';
var server = io(SERVER_ADDRESS);

var socketClient = {

    init : function(){
        server.on("getTags", socketClient.getTagsResponse);
        server.on("newLabel", socketClient.newLabelResponse);
        server.on("addedLabel", socketClient.addLabel);
        server.on("joinLabel", socketClient.joinLabelResponse);
        server.on("partLabel", socketClient.joinLabelResponse);
        socketClient.getTags();
        alert("before new label");
        socketClient.newLabel("newLabel");
        //alert("before before join labell");
        //socketClient.joinLabel("joiningLabel");
        //alert("before before part label");
        //socketClient.partLabel("partingLabel")
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
        setLocation(data["location"]);
		alert(JSON.stringify(data));
        for (index in data["labels"]){
            addNewLabel(data["labels"][index]["name"], data["labels"][index]["members"].length, true);
        }
    },

    newLabel : function(name){
        alert ("newLabel");
        //server.emit("newLabel", {'name': name})
        server.emit("newLabel", {'name': name})
    },

    newLabelResponse : function(data){
        alert ("in new label response")
        alert(JSON.stringify(data));
    },

    addLabel : function(data){
        addNewLabel(data["name"], 0, false)
        server.emit('addedLabel', { 'status' : 'OK' });
    },
    
    joinLabel : function(labelName) {
        alert("in join label");
        alret(server.emit('joinLabel', {'name': labelName}));
    },
    joinLabelResponse : function(data) {
        alert ("in join label response ")
        alert(data);
    },

    partLabel : function(labelName) {
        alert(server.emit('partLabel', {'name': 'somePartLabelName'}))
    },

    partLabelResponse : function(data) {
        alert ("in part label response ")
        alert(data);
    }

};

document.addEventListener('deviceready', socketClient.init, false);