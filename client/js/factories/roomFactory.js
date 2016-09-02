app.factory('roomFactory', function($location, $http) {
	factory = {};
	var room;

	//enter a room
	factory.enter = function(name) {
		console.log('in factory', name);
		room = name;
		//change location to new room
		$location.path('/chat');
	}

	//add a new room
	factory.addRoom = function(name) {
		// factory.room = name;
		room = name;
		// console.log('the room is', room);
		$http.post('/rooms', {'name': room}).success(function(output) {
			console.log('room added');
		})
		$location.path('/chat');
	}

	//get roomname
	factory.get_roomname = function() {
		return room;
	}

	// factory.get_room = function(name, callback) {
	// 	$http.get('/rooms/' + name).success(function(output) {
	// 		callback(output);
	// 	});
	// }

	factory.all_rooms = function(callback) {
		$http.get('/rooms').success(function(output) {
			callback(output);
		});
	}

	factory.leave = function() {
		factory.room = '';
		$location.path('/home');
	}

	return factory;
});