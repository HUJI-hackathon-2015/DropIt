/**
 * Created by lior on 30/04/2015.
 */
var dataUtils = require(__base + 'dataUtils.js');
var deepcopy = require('deepcopy');
var Buffer = require('Buffer');
var fs = require('fs');
var defs = require(__base + 'www/defs.js');

module.exports.getTagsHandler = function(socket, data, serverState) {
    console.log('Got getTags from ' + socket.id);
    dataUtils.addUser(socket.id, socket, data.user, data.BSSID,  serverState);
    console.log("data is " + JSON.stringify(data));
    var room = dataUtils.getRoom(data.BSSID, serverState);
    var labels = deepcopy(dataUtils.getLabels(room, serverState));
    console.log("room is " + room + " and labels is " + labels);

    for (var i = 0; i < labels.length; i++) {
        if ((labels[i] == undefined) || (labels[i].members == undefined)) {
            continue;
        }
        for (var j = 0; j < labels[i].members.length; j++) {
            labels[i].members[j] = dataUtils.getNameFromIMEI(labels[i].members[j], serverState);
        }
    }
    var result = {'location': room, 'labels': labels, 'user' : dataUtils.getNameFromIMEI(data.user, serverState)};
    socket.emit('getTags', result);
};

module.exports.newLabelHandler = function(socket, data, serverState, io) {
    console.log("Got newLabel from " + socket.id);
    var current_user = dataUtils.findUser(socket.id, serverState);
    dataUtils.newLabel(data.name, dataUtils.getRoom(current_user.bssid, serverState), serverState);
    socket.emit('newLabel', {status: 'OK'});
    io.sockets.emit('addedLabel', {name: data.name});
};

module.exports.joinLabelHandler = function(socket, data, serverState) {
    var user = dataUtils.findUser(socket.id, serverState);
    var room = dataUtils.getRoom(user.bssid, serverState);
    dataUtils.addUserToLabel(user.imei ,data.name, room, serverState);


    var labels = deepcopy(dataUtils.getLabels(room, serverState));

    for (var i = 0; i < labels.length; i++) {
        if (labels[i].name == data.name) {
            for (var j = 0; j < labels[i].members.length; j++) {
                labels[i].members[j] = dataUtils.getNameFromIMEI(labels[i].members[j], serverState);
            }
            socket.emit('joinLabel', labels[i]);
        }
    }
}

module.exports.partLabelHandler = function(socket, data, serverState) {
    var user = dataUtils.findUser(socket.id, serverState);
    dataUtils.removeUserFromLabel(user.imei, data.name, dataUtils.getRoom(user.BSSID, serverState), serverState);
    socket.emit({status: "OK"});
}


function postMessages(labels, serverState, socket, postLabel, msgToPost, isFullBroadcast) {
    console.log("About to post messages");
    for (var i = 0; i <  labels.length; i++) {
        if (labels[i].name == postLabel) {
            var sentList = [];
            if (labels[i].members == undefined) {
                continue;
            }
            for (var j = 0; j < labels[i].members.length; j++) {
                var user = dataUtils.findUserByIMEI(labels[i].members[j], serverState);
                var originatedUser = dataUtils.findUser(socket.id, serverState);
                if (user == null) {
                    continue;
                }
                msgToPost.user = dataUtils.getNameFromIMEI(originatedUser.imei, serverState);
                console.log('Current User is ' + labels[i].members);
                var broadcastCondition = false;
                if (isFullBroadcast) {
                    broadcastCondition = true;
                } else {
                    broadcastCondition = (user.uid != socket.id);
                }
                if ((broadcastCondition) && (sentList.indexOf(user.uid) == -1)) {
                    sentList.push(user.uid);
                    user.socket.emit('msgPosted', msgToPost);
                }
            }
        }
    }
}


module.exports.postMsg = function(socket, data, serverState) {
    var user = dataUtils.findUser(socket.id, serverState);
    var room = dataUtils.getRoom(user.bssid, serverState);
    console.log("Got message to send - " + JSON.stringify(data));

    var labels = dataUtils.getLabels(room, serverState);

    // save file to disc
    if (data.type == 'file') {
        var fileBuff = new Buffer(data.content, 'base64');
        fs.writeFile(__base + 'uploads/' + data.fileName, fileBuff, function (err) {
            if (err) {
                console.log("error while writing uploaded file " +  err);
                return;
            }
            var newData = {label: data.label, type: data.type, user: data.user, content: 'http://' + defs.SERVER_HOST + '/uploads/' + data.fileName};
            postMessages(labels, serverState, socket, data.label, newData , true);

        })

        //var newData = {label: data.label, type: data.type, user: data.user, content: 'http://132.65.250.197:3000/uploads/' + data.filename};
    } else {

        postMessages(labels, serverState, socket, data.label, data, false );
    }
}