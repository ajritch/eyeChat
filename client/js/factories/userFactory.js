app.factory('userFactory', function() {
	factory = {};
	var username = '';

	factory.login = function(name) {
		username = name;
	}

	factory.get_username = function() {
		return username;
	}

	return factory;
});