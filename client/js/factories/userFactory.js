app.factory('userFactory', function($location) {
	factory = {};
	var username = '';

	factory.login = function(name) {
		username = name;
	}

	factory.get_username = function() {
		return username;
	}

	factory.logout = function() {
		username = '';
		$location.path('/login');
	}

	return factory;
});