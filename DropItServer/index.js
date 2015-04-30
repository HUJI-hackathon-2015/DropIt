/**
 * Created by lior on 30/04/2015.
 */

var http = require('http'),
    fs = require('fs'),
// NEVER use a Sync function except at start-up!
    index = fs.readFileSync(__dirname + '/www/index.html');

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
});

// Socket.io server listens to our app
var io = require('socket.io').listen(app);
app.listen(3000);

