/**
 * Created by tmrlvi on 4/30/15.
 */

var main = {
    setLocation: function (name) {

    },

    addNewLabel: function (name, population, to_sort) {
        var list = $("#tag-list");
        var children = list.children().size();
        var labelDiv = $("<div>").addClass("w-col w-col-2 w-col-stack");
        var link = $("<a>").addClass("tag-button link2").addClass("link" + (children+1));
        link.data({"population": population}).text(name).on("click", null, name, main.goChat);
        labelDiv.append(link);
        list.append(labelDiv);
    },

    goChat: function(event){
        sessionStorage.room = event.data;
        window.location.replace("chat.html");
    }
};


var chat = {
    sendMessage: function(){
        socketClient.sendMsg($("#input").val());
        showMessage(message, true);
    },

    showMessage: function(message, fromMe){
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


