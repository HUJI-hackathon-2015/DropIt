global.__base = __dirname + '/';
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var handlers = require(__base + 'requestHandlers.js');
var serverState = require(__base + 'serverState.js');
var dataUtils = require(__base + 'dataUtils.js');

server.listen(3000);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/www/index.html');
});

app.get('/sockettest', function (req, res) {
    res.sendfile(__dirname + '/www/sockettest.html');
})

app.get('/defs.js', function (req, res) {
    res.sendfile(__dirname + '/www/defs.js');
})

io.on('connection', function (socket) {
    console.log("Got Incoming connection with ID " + socket.id);
    socket.on('getTags', function(data) {
        handlers.getTagsHandler(socket, data, serverState);
    });

    socket.on('newLabel', function(data) {
        handlers.newLabelHandler(socket, data, serverState, io);
    });

    socket.on('joinLabel', function(data) {
        handlers.joinLabelHandler(socket, data, serverState);
    })

    socket.on('disconnect', function() {
        dataUtils.removeUser(socket.id, serverState);
        console.log('After disconnect - ' + dataUtils.mystringify(serverState.connectedUsers));
    });
});