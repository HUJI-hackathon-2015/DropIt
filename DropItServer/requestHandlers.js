/**
 * Created by lior on 30/04/2015.
 */
var dataUtils = require(__base + 'dataUtils.js');
var deepcopy = require('deepcopy');

module.exports.getTagsHandler = function(socket, data, serverState) {
    console.log('Got getTags from ' + socket.id);
    dataUtils.addUser(socket.id, socket, data.user, data.BSSID,  serverState);
    console.log("data is " + JSON.stringify(data));
    var room = dataUtils.getRoom(data.BSSID, serverState);
    var labels = deepcopy(dataUtils.getLabels(room, serverState));
    console.log("room is " + room + " and labels is " + labels);

    for (var i = 0; i < labels.length; i++) {
        for (var j = 0; j < labels[i].members.length; j++) {
            labels[i].members[j] = dataUtils.getNameFromIMEI(labels[i].members[j], serverState);
        }
    }
    var result = {'location': room, 'labels': labels};
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
    var user = dataUtils.findUser(socket.id);
    dataUtils.removeUserFromLabel(user.imei, data.name, dataUtils.getRoom(user.BSSID, serverState));
    socket.emit({status: OK});
}

module.exports.postMsg = function(socket, data, serverState) {
    var user = dataUtils.findUser(socket.id);
    var room = dataUtils.getRoom(user.BSSID, serverState);

    var labels = dataUtils.getLabels(room, serverState);
    for (var label in labels) {
        if (label.name == data.label) {
            for (var member in label.members) {
                var user = dataUtils.findUserByIMEI(member, serverState);
                data.user = dataUtils.getNameFromIMEI(user.imei);
                if (user.uid != socket.id) {
                    user.socket.emit('msgPosted', data);
                }
            }
        }
    }
}