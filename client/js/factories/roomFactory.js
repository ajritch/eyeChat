app.factory('roomFactory', function($location) {
	factory = {};
	var room = '';
	var rooms = [];

	factory.enter = function(name) {
		room = name;
		if (rooms.indexOf(room) === -1) {
			rooms.push(room);
		}
		//change location to new room
		$location.path('/home');
	}

	factory.get_room = function() {
		return room;
	}

	factory.all_rooms = function() {
		return rooms;
	}

	factory.leave = function() {
		room = '';
		$location.path('/home');
	}

	return factory;
});