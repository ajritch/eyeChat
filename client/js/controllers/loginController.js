app.controller('loginController', function($scope, socketFactory) {

	$scope.username = '';

	$scope.login = function() {
		$scope.username = $('#building_word').html();
		console.log($scope.username);
		//send username to server
		socketFactory.emit()
	}

	socketFactory.emit('test', {'name': 'Annie'});
});