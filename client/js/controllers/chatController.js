app.controller('chatController', function($scope, $location, socketFactory, userFactory) {


	//get name of new user from socketFactory
	$scope.username = userFactory.get_username();
	//return to login page if no username
	if ($scope.username == '') {
		$location.path('/');
	}

	//re-establish the looping!
	highlight_row = undefined;
    highlight_cell = undefined;
    rowblink = true;
    clearInterval(row_loop);
	clearInterval(cell_loop);
    row_loop = setInterval(loopRows, INTERVAL);


	$scope.message = '';
	$scope.messages = '';


	//submit new chat
	$scope.submit = function() {
		console.log('submitted chat');
		$scope.message = $('#building_word').html();
		console.log($scope.message);
		
		//send message to server
		socketFactory.emit('add_new_chat', {'name': $scope.username, 'chat': $scope.message});
		
		$scope.message = '';
		//reestablish the looping! and un-highlight!
		highlight_row = undefined;
	    highlight_cell = undefined;
	    rowblink = true;
	    clearInterval(row_loop);
		clearInterval(cell_loop);
	    row_loop = setInterval(loopRows, INTERVAL);
	}

	//ask for all previously existing messages
	socketFactory.emit('give_me_messages', {});
	//get all the messages
	socketFactory.on('all_messages', function(data) {
		console.log('MESSAGES', data);
		$scope.messages = data.messages;
	});
	
});