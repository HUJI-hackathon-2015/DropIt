/**
 * Created by lior on 30/04/2015.
 */

module.exports.findUser = function(uid, serverState) {
    for (var userEntry in serverState.connectedUsers) {
        if (userEntry['uid'] == uid) {
            return userEntry;
        }
    }

    return null;
};

module.exports.addUser = function(uid, socket, imei, bssid, serverState) {
    var entry = {uid: uid, socket: socket, imei: imei, bssid: bssid};
    console.log("Adding - " + module.exports.mystringify(entry));
    serverState.connectedUsers.push(entry);
}


module.exports.removeUser = function(uid, serverState) {
    for (var i = 0; i < serverState.connectedUsers.length; i++)
    {
        if (serverState.connectedUsers[i].uid == uid) {
            delete serverState.connectedUsers[i];
            return true;
        }
    }

    return false;
}


module.exports.mystringify = function(str) {
    return JSON.stringify( str, function( key, value) {
        if( key == 'socket') { return "<SOCKET>";}
        else {return value;}
    });
};


module.exports.getRoom = function(bssid, serverState) {

    for (var entry_bssid in serverState.bssids) {
        if (entry_bssid.bssid == bssid) {
            return entry_bssid.name;
        }
    }

    return "Unknown Room";
};


module.exports.getLabels = function(room, serverState) {
    return serverState.labels[room];
}

module.exports.newLabel = function(labelName, room, serverState) {
    var labels = module.exports.getLabels(room, serverState);
    var new_label = {name: labelName, members: []};
    labels.push(new_label);
}
