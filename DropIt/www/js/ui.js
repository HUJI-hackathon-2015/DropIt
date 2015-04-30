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
            alert ( "in if share");
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
        alert("Shared!");
        socketClient.postFile(app.shareTarget);

    },

    loadChat: function(room, members){
        alert("loadChat!");
        sessionStorage.room = room;
        alert("setRoom!");
        sessionStorage.members = members;
        alert("setMembers!");
        window.location.replace("label-page.html");
    }
};


var chat = {
    room : null,
    members : null,

    init: function(){
        chat.room = sessionStorage.room;
        chat.members = sessionStorage.members;
        $(".nav2text").text(room);
        $("#field-2").keypress(function (e) {
            if (e.which == 13) {
                chat.sendMessage()
                return false;
            }
        });
    },

    sendMessage: function(){
        socketClient.postMsg(chat.room, $("#field-2").val())
        chat.showMessage(message, true);
    },

    showMessage: function(user, message, fromMe){
        var chat = $(".chatcolumns");
        var column = $("<div>").addClass("w-col w-col-2 w-clearfix")
        var bubble = $("<div>").addClass("bubble1");
        if (fromMe){
            bubble.addClass("bubble2");
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

    }
};

