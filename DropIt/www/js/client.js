/**
 * Created by tmrlvi on 4/30/15.
 */

var SERVER_ADDRESS = 'http://132.65.250.197:3000';
var server = io(SERVER_ADDRESS);
var socketClient = {
    user : null,

    init : function(){
        server.on("getTags", socketClient.getTagsResponse);
        server.on("newLabel", socketClient.newLabelResponse);
        server.on("addedLabel", socketClient.addLabel);
        server.on("joinLabel", socketClient.joinLabelResponse);
        server.on("postMsg", socketClient.postMsgResponse);
        server.on("msgPosted", socketClient.msgPosted);
        socketClient.getTags();
    },

    getTags: function ()
    {
        navigator.wifi.getAccessPoints(function (accessPoints) {
                var chosen = null;
                for (var index in accessPoints){
                    if (chosen === null || accessPoints[index].level > chosen.level){
                        chosen = accessPoints[index];
                    }
                }

                server.emit('getTags', {
                    'BSSID' : chosen.BSSID,
                    'user' : cordova.plugins.uid.IMEI
                });
            },
            function (error) {
                alert("Error obtaining wifi list: " + error.message);
            });
    },

    getTagsResponse : function(data){
        socketClient.user = data["user"];
        main.setLocation(data["user"] + "@" + data["location"]);
        for (index in data["labels"]){
            main.addNewLabel(data["labels"][index]["name"], data["labels"][index]["members"].length, true);
        }
    },

    newLabel : function(name){
        server.emit("newLabel", {'name': name})
    },

    newLabelResponse : function(data){

    },

    addLabel : function(data){
        main.addNewLabel(data["name"], 0, true);
        server.emit('addedLabel', { 'status' : 'OK' });
    },

    joinLabel : function(labelName) {
        server.emit('joinLabel', {'name': labelName});

    },

    joinLabelResponse : function(data) {
        main.loadChat(data["name"], data["members"]);
    },

    partLabel : function(labelName) {
        server.emit('partLabel', {'name': 'somePartLabelName'});
    },

    partLabelResponse : function(data) {
    },

    postMsg: function(label, msg){
        server.emit('postMsg', {
            "label" : label,
            "type" : "text",
            "content" : msg
        });
    },

    postMsgResponse: function(data){
    },

    msgPosted: function(data){
        if (data["type"] == "text") {
            chatUI.showMessage(data["user"], data["content"], false);
        } else if  (data["type"] == "file") {
            if (socketClient.user === data["user"]) {
                chatUI.showFile("me", data["content"], true);
            } else {
                chatUI.showFile(data["user"], data["content"], false);
            }
        } else {
            alert("Unknown msg recieved")
        }
    },


    postFile: function(label, image, fName){

        server.emit('postMsg', {
            "label" : label,
            "type" : "file",
            "content" : image,
            "fileName" : fName
        });

    }
};

document.addEventListener('deviceready', socketClient.init, false);


