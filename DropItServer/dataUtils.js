/**
 * Created by lior on 30/04/2015.
 */

var jf = require('jsonfile');
var util = require('util');
var users_file = __base + 'users.json';
var fs = require("fs");


module.exports.findUser = function(uid, serverState) {
   // var connectedUsers = util.inspect(jf.readFileSync(users_file)).a;
    console.log("Asked for used with uid " + uid);
    for (var i = 0; i < serverState.connectedUsers.length; i++) {
        var userEntry = serverState.connectedUsers[i];
        if (userEntry['uid'] == uid) {
            return serverState.connectedUsers[i];
        }
    }

    return null;
};

module.exports.findUserByIMEI = function(imei, serverState) {
    //var connectedUsers = util.inspect(jf.readFileSync(users_file)).a;
    console.log("IMEI is " + imei);
    for (var i = 0;i < serverState.connectedUsers.length; i++) {
        console.log("User IMEI is " + serverState.connectedUsers[i].imei);
        if (serverState.connectedUsers[i].imei == imei) {
            return serverState.connectedUsers[i];
        }
    }
    console.log("Out of loop");
    return null;
}

module.exports.addUser = function(uid, socket, imei, bssid, serverState) {
    module.exports.removeUser(uid, serverState);
    var entry = {uid: uid, socket: socket, imei: imei, bssid: bssid};
    serverState.connectedUsers.push(entry);
    console.log(serverState.connectedUsers);
}


module.exports.removeUser = function(uid, serverState) {
    //var connectedUsers = util.inspect(jf.readFileSync(users_file, {throws: true}));
   // var connectedUsers = JSON.parse(fs.readFileSync(users_file)).a;
    //console.log('aaa' - JSON.stringify(connectedUsers));
    for (var i = 0; i < serverState.connectedUsers.length; i++)
    {
        if (serverState.connectedUsers[i].uid == uid) {
            //delete serverState.connectedUsers[i];
            serverState.connectedUsers.splice(i, 1);
            return true;
        }
    }
    //jf.writeFileSync(users_file, {a: connectedUsers});
   // fs.writeFileSync(users_file, JSON.stringify({a : connectedUsers}));
    return false;
}


module.exports.mystringify = function(str) {
    return JSON.stringify( str, function( key, value) {
        if( key == 'socket') { return "<SOCKET>";}
        else {return value;}
    });
};


module.exports.getRoom = function(bssid, serverState) {
    for (var i = 0; i <  serverState.bssids.length; i++) {
        if (serverState.bssids[i].bssid == bssid) {
            return serverState.bssids[i].name;
        }
    }

    //return "Unknown Room";
    return "Aquarium A";
};


module.exports.getLabels = function(room, serverState) {
    return serverState.labels[room];
}

module.exports.newLabel = function(labelName, room, serverState) {
    var labels = module.exports.getLabels(room, serverState);
    var new_label = {name: labelName, members: []};
    labels.push(new_label);
}

module.exports.getNameFromIMEI = function(imei, serverState) {
    return serverState.imeis[imei];
}

module.exports.addUserToLabel = function(imei, labelName, room, serverState) {
    console.log("IMEI - " + imei +". Labelname - " + labelName + ". room = " + room);
    var labels = module.exports.getLabels(room, serverState);
    console.log("labels - " + JSON.stringify(labels));
    for (var i = 0; i < labels.length; i++) {
        if (labels[i].name == labelName) {
            labels[i].members.push(imei);
        }
    }

}

module.exports.removeUserFromLabel = function(imei, labelName, room, serverState) {
    var labels = module.exports.getLabels(room, serverState);
    for (var i = 0; i < labels.length; i++) {
        if (labels[i].name == labelName) {
            var members = labels[i].members;
            for (var j = 0; j < members.length; j++) {
                if (members[j] == imei) {
                   labels[i].members.splice(j, 1);
                }
            }
        }
    }
}