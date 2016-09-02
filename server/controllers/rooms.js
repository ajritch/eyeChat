var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var Message = mongoose.model('Message');

module.exports = (function() {
	return {

		//get all rooms
		get_all: function(req, res) {
			Room.find({}).populate('messages').exec(function(err, results) {
				if (err) {
					console.log(err);
				} else {
					res.json(results);
				}
			});
		},

		//get specific room
		get_room: function(req, res) {
			Room.findOne({_id: req.params.id}).populate('messages').exec(function(err, room) {
				if (err) {
					console.log(err);
				} else {
					res.json(room);
				}
			});
		},

		//get all messages belonging to a room
		get_messages: function(roomname, callback) {
			Room.findOne({name: roomname}).populate('messages').exec(function(err, room) {
				if (err) {
					console.log(err);
				} else {
					// console.log('ctrl messages', room.messages[0]);
					callback(room.messages);
				}
			});
		},

		//add a room
		create: function(req, res) {
			var room = new Room({name: req.body.name});
			Room.find({name: req.body.name}).exec(function(err, results) {
				if (results.length === 0) {
					//only save room if that name isn't found
					room.save(function(err) {
						if (err) {
							console.log(err);
						} 
					});
				}
			})
		}


	}
})();