var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: 'static/partials/login.html'
		})
        .when('/chat', {
            templateUrl: 'static/partials/chat.html'
        })
        .when('/type', {
            templateUrl: 'static/partials/type.html'
        })
        .when('/home', {
            templateUrl: 'static/partials/rooms.html'
        })
        .when('/new_room', {
            templateUrl: 'static/partials/new_room.html'
        })
		.otherwise({
			redirectTo: '/login'
		});
});

//range filter to display lots of options
app.filter('range', function() {
  return function(input, start, end) {    
    start = parseInt(start);
    end = parseInt(end);
    var direction = (start <= end) ? 1 : -1;
    while (start != end) {
        input.push(start);
        start += direction;
    }
    return input;
  };
});