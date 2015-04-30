/**
 * Created by tmrlvi on 4/30/15.
 */

var SERVER_ADDRESS = 'http://132.65.250.197:3000';
var server = io(SERVER_ADDRESS);
var socketClient = {

    init : function(){
        server.on("getTags", socketClient.getTagsResponse);
        server.on("newLabel", socketClient.newLabelResponse);
        server.on("addedLabel", socketClient.addLabel);
        server.on("joinLabel", socketClient.joinLabelResponse);
        server.on("postMsg", socketClient.postMsgResponse);
        server.on("msgPosted", socketClient.msgPosted);
        if (app.page == "main") {
            alert("in main");
            socketClient.getTags();
        }
        //alert("before before part label");
        //socketClient.partLabel("partingLabel")
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
    },

    getTagsResponse : function(data){
        main.setLocation(data["location"]);
        for (index in data["labels"]){
            alert(JSON.stringify(data["labels"][index]));
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

    },

    addLabel : function(data){
        alert("in added label and see data");
        alert(JSON.stringify(data));
        main.addNewLabel(data["name"], 0, true);
        alert(server.emit('addedLabel', { 'status' : 'OK' }));
    },

    joinLabel : function(labelName) {
        alert("in join label");
        server.emit('joinLabel', {'name': labelName});

    },

    joinLabelResponse : function(data) {
        alert ("in join label response ");
        alert(JSON.stringify(data));
        alert(JSON.stringify(data["name"]));
        alert(JSON.stringify(data["members"]));
        main.loadChat(data["name"], data["members"]);
    },

    partLabel : function(labelName) {
        alert(server.emit('partLabel', {'name': 'somePartLabelName'}))
    },

    partLabelResponse : function(data) {
        alert ("in part label response ");
        alert(data);
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
        // TODO: deal with files
        ui.showMessage(data["user"], data["content"], false);
    },

    postFile: function(fileUrl){

        alert("posting file");

        var FR= new FileReader();
        FR.onload = function(e) {
            el("img").src = e.target.result;
            el("base").innerHTML = e.target.result;
        };
        FR.readAsDataURL( fileUrl );
        alert(fileUrl);
        alert(FT.encodeBase64Packet());
    }
};

document.addEventListener('deviceready', socketClient.init, false);


