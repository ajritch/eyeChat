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

var messages = [];
var users = [];

io.sockets.on('connection', function(socket) {
	console.log('connected to', socket.id);

	//new user has logged in
	socket.on('add_new_user', function(data) {
		// console.log(data.name);
		users.push({'name': data.name, 'id': socket.id});
		socket.emit('hello_new_user', {'name': data.name, 'messages': messages});
		var alert = '';
		alert += data.name + ' has entered the chatroom.';
		messages.push({'alert': alert});
		io.emit('all_messages', {'messages': messages});		
	});

	//new user wants all previous messages
	socket.on('give_me_messages', function(data) {
		console.log('sending all', messages);
		socket.emit('all_messages', {'messages': messages});
	})

	//a new chat has been submitted
	socket.on('add_new_chat', function(data) {
		console.log('NEW MESSAGE', data);
		messages.push({'name': data.name, 'chat': data.chat});
		console.log('ALL', messages);
		// io.emit('new_message', {'name': data.name, 'chat': data.chat});
		io.emit('all_messages', {'messages': messages});
	})
})