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
        link.data({"population": population}).html("<br/>#" + name);
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
        alert("Shared!")
    },

    loadChat: function(room, members){
        sessionStorage.room = room;
        sessionStorage.members = members;
        window.location.replace("chat.html");
    }
};


var chat = {
    room : null,
    members : null,

    init: function(){
        chat.room = sessionStorage.room;
        chat.members = sessionStorage.members;
    },

    sendMessage: function(){
        socketClient.postMsg(chat.room, $("#input").val())
        chat.showMessage(message, true);
    },

    showMessage: function(user, message, fromMe){
        var messageItem = $("<p>").addClass("text").text(message);
        if (fromMe){
            messageItem.addClass("me");
        }
        $("#text").append(messageItem)
    },

    sendFile: function(){

    },

    showFile: function(){

    },

    loadHistory: function(){

    }
};


