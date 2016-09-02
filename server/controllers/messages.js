var mongoose = require('mongoose');
var Room = mongoose.model('Room');
var Message = mongoose.model('Message');

module.exports = (function() {
	return {

		//add a message
		add: function(newmessage, roomname, callback) {
			Room.findOne({name: roomname}, function(err, room) {
				if (err) {
					console.log(err);
				} else {
					// console.log(room);
					var message = new Message(newmessage);
					message.room = room._id;
					message.save(function(err) {
						if (err) {
							console.log(err);
						} else {
							room.messages.push(message);
							room.save(function(err) {
								if (err) {
									console.log(err);
								} else {
									if (typeof callback === 'function') {
										callback();
									}
								}
							});
						}
					});
				}
			});
		}


	}
})();