app.controller('chatController', function($scope, $location, socketFactory, userFactory, roomFactory) {


	//get name of current room from roomFactory
	$scope.roomname = roomFactory.get_roomname();
	console.log('we are in room', $scope.roomname);

	$scope.newRoom; //room when adding room name

	//get names of all rooms from roomFactory
	roomFactory.all_rooms(function(results) {
		$scope.rooms = results;
		console.log(results);
	});
	// console.log('ROOMS', $scope.rooms);

	//get name of new user from socketFactory
	$scope.username = userFactory.get_username();
	console.log($scope.username);



	//load all buttons
	$scope.load = function() {
		$('#blink-btn-rooms').click(function() {
			if (highlight_room != undefined) {
				choose_room();
			}
		});
		$('#blink-btn-new-room').click(function() {
			if (highlight_row != undefined && rowblink) {
	            handle_blink();
	        } else if (highlight_cell != undefined && !rowblink) {
	            handle_blink();
	        }
		});
		$('#blink-btn-chat').click(function() {
			// console.log('clicked chat blink btn')
			if (highlight_row != undefined && rowblink) {
	            handle_blink();
	        } else if (highlight_cell != undefined && !rowblink) {
	            handle_blink();
	        }
		});
	};
	$scope.load();

	//load the scroller
	$scope.loadScroll = function() {
		$('#chats').stop().animate({
			scrollTop: $('#chats')[0].scrollHeight
		}, 500);
	}

	//reestablish any loops
	highlight_room = undefined;
	clearInterval(room_loop);


	//DEFINE FUNCTIONS

	//go to make new room page
	$scope.new_room = function() {
		//redirect to page where user can add a new room
		$location.path('/new_room');
	}

	//user has submitted room name (make new room)
	$scope.make_room = function() {
		$scope.newRoom = $('#building_word').html();
		entering_roomname = $scope.newRoom;
		// console.log($scope.newRoom);
		//enter the new room (factory handles page change)
		roomFactory.addRoom($scope.newRoom);
	}

	//enter pre-existing chat room
	$scope.enter_room = function() {
		// console.log('entering', $scope.roomname);
		$scope.roomname = entering_roomname
		roomFactory.enter(entering_roomname);
	}

	//submit new chat
	$scope.submit = function() {
		$scope.message = $('#building_word').html();
		// console.log($scope.message);
		
		//send message to server
		// console.log('SUBMITTING');
		socketFactory.emit('add_new_chat', {'name': $scope.username, 'chat': $scope.message, 'room': $scope.roomname});
		$scope.loadScroll();
		
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

	//submit new chat via typing
	$scope.type_submit = function() {
		// console.log($scope.message);
		//send off new message
		socketFactory.emit('add_new_chat', {'name': $scope.username, 'chat': $scope.message, 'room': $scope.roomname});
		$scope.loadScroll();

		$scope.message = '';
	}

	//logout!
	$scope.logout = function() {
		//tell socket there's been a "disconnet"
		socketFactory.emit('logout', {'name': $scope.username, 'room': $scope.roomname});
		userFactory.logout();
	}





	//CONTROLLER LOGIC


	//return to login page if no username
	if ($scope.username == '' || $scope.username == ' ') {
		$location.path('/login');
	} else if ($scope.roomname == '' || $scope.roomname == ' ') {

		//not on roompage? go to roompage
		if ($location.path() != '/home' && $location.path() != '/new_room') {
			$location.path('/home');
		}

		if ($location.path() == '/home') {
			//on roompage? select a room!
			//loop through rooms
			highlight_room = undefined;
			clearInterval(room_loop);
			room_loop = setInterval(loopRooms, INTERVAL);
		
		}


		//on make new room page? refresh looping
		if ($location.path() == '/new_room') {
			//re-establish the looping!
			highlight_row = undefined;
		    highlight_cell = undefined;
		    rowblink = true;
		    clearInterval(row_loop);
			clearInterval(cell_loop);
		    row_loop = setInterval(loopRows, INTERVAL);
		}

		

	} else if ($location.path() == '/new_room') {
			//on make new room page? refresh looping
			//re-establish the looping!
			highlight_row = undefined;
		    highlight_cell = undefined;
		    rowblink = true;
		    clearInterval(row_loop);
			clearInterval(cell_loop);
		    row_loop = setInterval(loopRows, INTERVAL);
	} else if ($location.path() == '/home') {
		//on roompage? select a room!
		//loop through rooms
		highlight_room = undefined;
		clearInterval(room_loop);
		room_loop = setInterval(loopRooms, INTERVAL);
	
	} else {

		//IT'S TIME TO CHAT!


		//connect to socket; tell which room to join
		// console.log('chat time')
		// socketFactory.on('connect', function() {
		// 	console.log('client has connected');
		// 	console.log($scope.roomname);
		// });

		$scope.loadScroll();
		$scope.roomname = roomFactory.get_roomname();
		//tell server that a new user was added to room
		socketFactory.emit('add_new_user', {'name': $scope.username, 'room': $scope.roomname});


		//re-establish the looping!
		highlight_row = undefined;
	    highlight_cell = undefined;
	    rowblink = true;
	    clearInterval(row_loop);
		clearInterval(cell_loop);
	    row_loop = setInterval(loopRows, INTERVAL);

		$scope.message = '';
		$scope.messages = [];

		
		//ask for all previously existing messages
		//this seems to be getting called WITH EACH SUBMIT
		socketFactory.emit('give_me_messages', {'room': $scope.roomname});


		//get all the messages
		socketFactory.on('all_messages', function(data) {
			//this is firing twice
			$scope.messages = data.messages;
			// console.log('MESSAGES', $scope.messages);
		});

		//get newly added message
		// socketFactory.on('new_message', function(data) {
		// 	console.log('new message', data);
		// 	$scope.messages.push(data);
		// });

		
	}


	
});