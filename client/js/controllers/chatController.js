app.controller('chatController', function($scope, $location, socketFactory, userFactory) {


	//get name of new user from socketFactory
	$scope.username = userFactory.get_username();
	//return to login page if no username
	if ($scope.username == '') {
		$location.path('/');
	} else {
		
		//tell server that a new user was added
		socketFactory.emit('add_new_user', {'name': $scope.username});

		//re-establish the looping!
		highlight_row = undefined;
	    highlight_cell = undefined;
	    rowblink = true;
	    clearInterval(row_loop);
		clearInterval(cell_loop);
	    row_loop = setInterval(loopRows, INTERVAL);

		$scope.message = '';
		$scope.messages = [];

		$scope.blink_btn_click = function () {
			$scope.load = function() {
				$('#blink-btn-chat').on('click','#blink-btn-chat', function() {
					console.log('clicked chat blink btn')
					if (highlight_row != undefined && rowblink) {
			            handle_blink();
			        } else if (highlight_cell != undefined && !rowblink) {
			            handle_blink();
			        }
				});
			};
			$scope.load();
		}


		//submit new chat
		$scope.submit = function() {
			$scope.message = $('#building_word').html();
			// console.log($scope.message);
			
			//send message to server
			console.log('SUBMITTING');
			socketFactory.emit('add_new_chat', {'name': $scope.username, 'chat': $scope.message});
			
			$scope.message = '';
			//clear out previous building_word
			$('#building_word').html('');

			//reestablish the looping! and un-highlight!
			$(highlight_row).toggleClass('highlight_row');
	        $(highlight_cell).toggleClass('highlight_cell');
			highlight_row = undefined;
		    highlight_cell = undefined;
		    rowblink = true;
		    clearInterval(row_loop);
			clearInterval(cell_loop);
		    row_loop = setInterval(loopRows, INTERVAL);
		}

		//ask for all previously existing messages
		//this seems to be getting called WITH EACH SUBMIT
		socketFactory.emit('give_me_messages', {});

		//get all the messages
		socketFactory.on('all_messages', function(data) {
			//this is firing twice
			console.log('MESSAGES', data);
			$scope.messages = data.messages;
		});

		//get newly added message
		// socketFactory.on('new_message', function(data) {
		// 	console.log('new message', data);
		// 	$scope.messages.push(data);
		// });
	}


	
});