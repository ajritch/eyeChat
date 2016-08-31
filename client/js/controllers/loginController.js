app.controller('loginController', function($scope, $location, userFactory, socketFactory) {

	//re-establish the looping!
	highlight_row = undefined;
    highlight_cell = undefined;
    rowblink = true;
    clearInterval(row_loop);
	clearInterval(cell_loop);
    row_loop = setInterval(loopRows, INTERVAL);

	$scope.username = '';

	$scope.login = function() {
		console.log('submitted login');
		$scope.username = $('#building_word').html();

		//update username in factory
		userFactory.login($scope.username);
		
		//send username to server
		socketFactory.emit('add_new_user', {'name': $scope.username});
		//redirect to chat partial
		$location.path('/chat');
		$scope.username = '';
	}

});