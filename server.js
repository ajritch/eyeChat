var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client')));
app.use(express.static(path.join(__dirname, './bower_components')));
app.use(express.static(path.join(__dirname, './node_modules')));

//database config
require('./server/config/mongoose.js');

//module config and routing
require('./server/config/routes.js')(app);

var server = app.listen(7000, function() {
	console.log('listening on port 7000');
});


//all the socket things
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	console.log('connected to', socket.id);
	socket.on('test', function(data) {
		console.log(data.name);
	});
})