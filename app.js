var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    port = process.env.PORT || 5000;

server.listen(port);

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'));

io.sockets.on('connection', function(socket) {
    socket.emit('news', {hello: 'world'});
    //socket.broadcast.emit('news', {hello: 'world'});
    socket.on('my other event', function(data) {
        console.log(data);
    });
});
