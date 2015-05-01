/**
 * Created by tmrlvi on 4/30/15.
 */

var main = {
    setLocation: function (name) {
        $(".user-location").text(name);
    },

    addNewLabel: function (name, population, to_sort) {
        var list = $("#tag-list");
        var children = list.children().size();
        var labelDiv = $("<div>").addClass("w-col w-col-2 w-col-stack");
        var link = $("<a>").addClass("tag-button link2").addClass("link" + (((children-1)%5)+1));
        link.data({"population": population}).html("<br/>" + name);
        if (app.mode === "share"){
            link.on("click", null, name, main.postFile);
        } else {
            link.on("click", null, name, main.goChat);
        }
        labelDiv.append(link);
        list.append(labelDiv);
    },

    goChat: function(event){
        socketClient.joinLabel(event.data);

    },

    postFile: function(event){
        socketClient.postFile(app.shareTarget);

    },

    loadChat: function(room, members){
        sessionStorage.setItem("room", room);
        sessionStorage.setItem("members", members);
        window.location = "label-page.html";
    }
};


var chatUI = {
    room : null,
    members : null,

    init: function(){
        chatUI.room = sessionStorage.getItem("room");
        chatUI.members = sessionStorage.getItem("members");
        $(".nav2text").text(chatUI.room);
        $("#field-2").keypress(function (e) {
            if (e.which == 13) {
                chatUI.sendMessage()
                return false;
            }
        });
    },

    sendMessage: function(){
        var input = $("#field-2");
        socketClient.postMsg(chatUI.room, input.val())
        chatUI.showMessage("me", input.val(), true);
        input.val("");
    },

    showMessage: function(user, message, fromMe){
        var chat = $(".chatcolumns");
        var column = $("<div>").addClass("w-col w-col-2 w-clearfix")
        var bubble = $("<div>").addClass("bubble1");
        if (fromMe){
            bubble.addClass("bubble-2");
        }
        else{
            column.addClass("column1");
        }
        bubble.append($("<div>").addClass("example-text").text(user + ": " + message));
        column.append(bubble);
        chat.append(column);
    },

    sendFile: function(){

    },

    showFile: function(){

    },

    loadHistory: function(){

    },
    takePicture: function (label) {

        alert("before navigator")
        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.DATA_URL
        });

        function onSuccess(imageData) {
            alert ("camera success");
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
            var date = new Date();
            var fName = date.getDate();
            socketClient.postFile(label, image, fName);
        }

        function onFail(message) {
            alert ("camera failure");
            alert('Failed because: ' + message);
        }
    }
};

