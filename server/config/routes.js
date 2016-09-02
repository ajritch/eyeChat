//server API routing
var rooms = require('./../controllers/rooms.js');
// var messages = require('./../controllers/messages.js');

module.exports = function(app) {


	//get all rooms
	app.get('/rooms', function(req, res) {
		rooms.get_all(req, res);
	});

	//get specific room
	app.get('/rooms/:name', function(req, res) {
		rooms.get_room(req, res);
	});

	//add a room
	app.post('/rooms', function(req, res) {
		rooms.create(req, res);
	});

}