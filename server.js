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

//load the necessary server controllers
var roomsCtrl = require('./server/controllers/rooms.js');
var messagesCtrl = require('./server/controllers/messages.js');

// var messages = [];
var users = [];

io.sockets.on('connection', function(socket) {
	console.log('connected to', socket.id);

	//new user has logged in
	socket.on('add_new_user', function(data) {
		//join the room
		socket.join(data.room);
		// console.log(data.name);
		//make sure that user isn't there
		// console.log(data.name);
		// console.log(socket.id);
		var index = -1;
		for (var i = 0; i < users.length; i++) {
			if (users[i].id === socket.id && users[i].name === data.name) {
				index = i;
				break;
			}
		}
		//only send alert if this is actually a new user
		if (index === -1) {
			users.push({'name': data.name, 'id': socket.id});
			// socket.emit('hello_new_user', {'name': data.name, 'messages': messages});
			var alert = '';
			alert += data.name + ' has entered the chatroom.';
			//add this alert to the room's messages
			messagesCtrl.add({'alert': alert}, data.room);

			//get all messages from the room
			roomsCtrl.get_messages(data.room, function(output) {
				io.to(data.room).emit('all_messages', {'messages': output});
			});
			// io.to(data.room).emit('all_messages', {'messages': messages});		
		}
	});

	//new user wants all previous messages
	socket.on('give_me_messages', function(data) {
		// console.log('sending all', messages);
		//get all messages from the room
		// console.log(data.room);
		roomsCtrl.get_messages(data.room, function(output) {
			// console.log('callback', output);
			io.to(data.room).emit('all_messages', {'messages': output});
		});
		// console.log('MESSAGES', messages);
		// io.to(data.room).emit('all_messages', {'messages': messages});
	});

	//a new chat has been submitted
	socket.on('add_new_chat', function(data) {

		//add this alert to the room's messages
		messagesCtrl.add({'name': data.name, 'chat': data.chat}, data.room, function() {
			console.log('doing callback');
			//get all messages from the room
			roomsCtrl.get_messages(data.room, function(output) {
				// console.log('callback', output);
				io.to(data.room).emit('all_messages', {'messages': output});
			});
		});

	});

	//a user has left the chat room!
	socket.on('disconnect', function() {
		var index = -1;
		for (var i = 0; i < users.length; i++) {
			if (users[i].id === socket.id) {
				index = i;
				break;
			}
		}
		//make alert if actual user is disconnecting
		//data.room does not exist!
		// if (index > -1) {
		// 	var alert = '';
		// 	alert += users[index].name + ' has left the chatroom.';
		// 	messagesCtrl.add({'alert': alert}, entering_roomname, function() {
		// 		//get all messages from the room
		// 		roomsCtrl.get_messages(entering_roomname, function(output) {
		// 			io.to(entering_roomname).emit('all_messages', {'messages': output});
		// 		});
		// 		//splice out that user
		// 		users.splice(index, 1);
				
		// 	});
		// }
	});

	//a user has logged out
	socket.on('logout', function(data) {
		var index = -1;
		for (var i = 0; i < users.length; i++) {
			if (users[i].id === socket.id && users[i].name === data.name) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			var alert = '';
			alert += users[index].name + ' has left the chatroom.';
			messagesCtrl.add({'alert': alert}, data.room, function() {
				//get all messages from the room
				roomsCtrl.get_messages(data.room, function(output) {
					io.to(data.room).emit('all_messages', {'messages': output});
				});
				//splice out that user
				users.splice(index, 1);
				
			});
		}
	})

})