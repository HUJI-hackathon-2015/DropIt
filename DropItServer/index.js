global.__base = __dirname + '/';
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var handlers = require(__base + 'requestHandlers.js');
var serverState = require(__base + 'serverState.js');
var dataUtils = require(__base + 'dataUtils.js');
var MongoClient = require('mongodb').MongoClient;

server.listen(8000);

app.get('/', function (req, res) {
    console.log("Serrved index");
    res.sendfile(__dirname + '/www/index.html');
});

app.get('/sockettest', function (req, res) {
    res.sendfile(__dirname + '/www/sockettest.html');
});

app.get('/defs.js', function (req, res) {
    res.sendfile(__dirname + '/www/defs.js');
});

app.get('/uploads/:filename', function(req, res) {
    console.log('uploads request - ' + req.params.filename)
    //res.send('AAA');
    res.sendfile(__dirname + '/uploads/' + req.params.filename);
});

io.on('connection', function (socket) {
    console.log("Got Incoming connection with ID " + socket.id);
    socket.on('getTags', function (data) {
        handlers.getTagsHandler(socket, data, serverState);
    });

    socket.on('newLabel', function (data) {
        handlers.newLabelHandler(socket, data, serverState, io);
    });

    socket.on('joinLabel', function (data) {
        handlers.joinLabelHandler(socket, data, serverState);
    });

    socket.on('partLabel', function (data) {
        handlers.partLabelHandler(socket, data, serverState);
    });

    socket.on('postMsg', function (data) {
        handlers.postMsg(socket, data, serverState);
    });

    socket.on('disconnect', function () {
        // This is to ensure the client disconnects (so it can try to reconnect)
        socket.client.close();
        dataUtils.removeUser(socket.id, serverState);
        console.log('After disconnect - ' + dataUtils.mystringify(serverState.connectedUsers));
    });

    socket.on("error", function(error){
        console.log("Error: " + error);
    });

    socket.on("close", function(error){
        console.log("Close: " + error);
    });
});