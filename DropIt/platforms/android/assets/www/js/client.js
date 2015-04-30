/**
 * Created by tmrlvi on 4/30/15.
 */

var SERVER_ADDRESS = 'http://132.65.250.197:3000';
var server = io(SERVER_ADDRESS);

var socketClient = {

    init : function(){
        alert("hi1");
        server.on("getTags", socketClient.getTagsResponse);
        server.on("newLabel", socketClient.newLabelResponse);
        server.on("addedLabel", socketClient.addLabel);
        server.on("joinLabel", socketClient.joinLabelResponse);
        socketClient.getTags();
        alert("before before join label");
        socketClient.joinLabel("First Label!");
        //alert("before before part label");
        //socketClient.partLabel("partingLabel")
    },

    getTags: function ()
    {
        alert ("in get tags");
        navigator.wifi.getAccessPoints(function (accessPoints) {
                var chosen = null;
                for (var index in accessPoints){
                    if (chosen === null || accessPoints[index].level > chosen.level){
                        chosen = accessPoints[index];
                    }
                }
                alert ("before emitting getTags");
                alert ("chosen Bssis: " +  chosen.BSSID);
                alert("uid: " + cordova.plugins.uid.IMEI);

                server.emit('getTags', {
                    'BSSID' : chosen.BSSID,
                    'user' : cordova.plugins.uid.IMEI
                });
            },
            function (error) {
                alert("Error obtaining wifi list: " + error.message);
            });
        alert ("after get tags");
    },

    getTagsResponse : function(data){
        alert("got tags");
		alert(JSON.stringify(data));
        main.setLocation(data["location"]);
        for (index in data["labels"]){
            //alert(data["labels"][index]["name"] + " " + data["labels"][index]["priority"] + " " + data["labels"][index]["members"]);
            main.addNewLabel(data["labels"][index]["name"], data["labels"][index]["members"].length, true);
        }
    },

    newLabel : function(name){
        alert ("newLabel");
        //server.emit("newLabel", {'name': name})
        server.emit("newLabel", {'name': name})
    },

    newLabelResponse : function(data){
        alert ("in new label response");
        alert(JSON.stringify(data));
        main.addNewLabel(data["name"], 0, true);
    },

    addLabel : function(data){
        alert("in added label and see data");
        alert(JSON.stringify(data));
        alert(server.emit('addedLabel', { 'status' : 'OK' }));
    },

    joinLabel : function(labelName) {
        alert("in join label with label name: " + labelName);
        server.emit('joinLabel', {'name': labelName});

    },

    joinLabelResponse : function(data) {
        alert ("in join label response ");
        alert(data);
    },

    partLabel : function(labelName) {
        alert(server.emit('partLabel', {'name': 'somePartLabelName'}))
    },

    partLabelResponse : function(data) {
        alert ("in part label response ");
        alert(data);
    }




};

alert("hi2");
alert(document.addEventListener);
document.addEventListener('deviceready', socketClient.init, false);