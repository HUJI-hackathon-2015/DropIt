/**
 * Created by lior on 30/04/2015.
 */
var dataUtils = require(__base + 'dataUtils.js');

module.exports.getTagsHandler = function(socket, data, serverState) {
    console.log('Got getTags from ' + socket.id);
    dataUtils.addUser(socket.id, socket, data.imei, data.BSSID,  serverState);
    var room = dataUtils.getRoom(data.BSSID, serverState);
    var labels = dataUtils.getLabels(room, serverState);
    var result = {'location': room, 'labels': labels};
    socket.emit('getTags', result);
};

module.exports.newLabelHandler = function(socket, data, serverState, io) {
    console.log("Got newLabel from " + socket.id);
    var current_user = dataUtils.findUser(socket.id, serverState);
    dataUtils.newLabel(data.name, dataUtils.getRoom(current_user.bssid), serverState);
    socket.emit('newLabel', {status: 'OK'});
    io.sockets.emit('addedLabel', {name: data.name});
};

module.exports.joinLabelHandler = function(socket, data, server) {
    // TODO
}