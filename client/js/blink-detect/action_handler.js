var cell_loop; //interval to loop through all cells in a row
var row_loop; //interval to loop through all rows in table
var room_loop; //interval to loop through all rooms in list
var highlight_row; //row currently highlighted
var highlight_cell; //cell currently highlighted
var rowblink; //true if current blink expects landing on row

var blink_mode = true; //true if blinking turned on

var highlight_room; //room name currently highlighted

var entering_roomname; //name of room to be entered. sorry it's global


//clear whatever loop interval was happily going on
clearInterval(row_loop);
clearInterval(cell_loop);

//interval timing
const INTERVAL = 500;



var handle_blink = function() {
    rowblink = !rowblink;
    //loop through to highlight rows
    if (highlight_row == undefined) {
        //only loop if we don't have a row
        row_loop = setInterval(loopRows, INTERVAL);        
    } else {
        //highlight_row already defined, do cell loop (if no cell yet)
        clearInterval(row_loop);
        if (highlight_cell == undefined) {
            cell_loop = setInterval(loopCells, INTERVAL, highlight_row);   
        } else {
            //now we have the chosen cell!
            clearInterval(cell_loop);
            //if on an action, do action
            if ($(highlight_cell).attr('class').includes('action')) {
                //do the action
                var action = $(highlight_cell).attr('id');
                // console.log(action);
                switch(action) {
                    case 'backspace-btn':
                        var wordStr = $('#building_word').html();
                        // console.log(wordStr,'oiawejfowif');
                        var PATTERN = /([\ud800-\udbff])([\udc00-\udfff])/g;
                        var value = wordStr.substring(wordStr.length-10,wordStr.length);
                        // console.log(value,'value')
                        var matches = value.match(PATTERN);
                        if(matches){
                            // console.log('in if statement')
                            wordStr = wordStr.substring(0,wordStr.length-10);
                            // console.log('after backspace in if statement',wordStr);
                            $('#building_word').html(wordStr);
                        } else {
                            // console.log(wordStr);
                            wordStr = wordStr.substring(0, wordStr.length - 1);
                            $('#building_word').html(wordStr);
                        }
                        break;
                    case 'clear-btn':
                        $('#building_word').html('');
                    case 'space-btn':
                        $('#building_word').append(' ');
                        break;
                    case 'yes-btn':
                        $('#building_word').append('YES');
                        break;
                    case 'no-btn':
                        $('#building_word').append('NO');
                        break;
                    case 'submit-btn':
                        //force click hidden submit button
                        $('#hidden-submit-btn').click();
                        return;
                        break;
                    case 'chat-submit-btn':
                        //force click to submit
                        $('#chat-hidden-submit-btn').click();
                        return;
                        break;
                    case 'chat-logout':
                        $('#logout-hidden-submit-btn').click();
                        return;
                        break;
                    case 'new-room-submit-btn':
                        $('#new-room-hidden-submit-btn').click();
                        return;
                        break;
                    default:
                        break;
                }
            } else {
                //add letter to word
                $('#building_word').append(highlight_cell.innerHTML);
            }
            //clear out any highlighting
            $(highlight_row).toggleClass('highlight_row');
            $(highlight_cell).toggleClass('highlight_cell');
            highlight_row = undefined;
            highlight_cell = undefined;
            //begin looping through rows again
            row_loop = setInterval(loopRows, INTERVAL);
        }
    }
}

var choose_room = function() {
    //start looping if not already highlighting
    if (highlight_room == undefined) {
        room_loop = setInterval(loopRooms, INTERVAL); 
    } else {
        //choose highlighted room
        clearInterval(room_loop);
        //check if highlighted room is "make new room"
        if ($(highlight_room).attr('class').includes('last')) {
            //action to let user make new room
            $('#new-room-hidden-submit-btn').click();
        } else {
            //enter the chosen room           
            var preroom = $(highlight_room).html();
            var room = preroom.substring(46, preroom.length - 7);
            $('#room_name_input').val(room);
            entering_roomname = room;
            // console.log($('#room_name_input').val());
            $('#enter-room-hidden-submit-btn').click();
            console.log('chose a room!!', room);
        }
    }
}

//loop through all the rooms in a list
function loopRooms() {
    var rooms = $('#room_list').children();
    if (highlight_room == undefined) {
        highlight_room = rooms[0];
        $(highlight_room).toggleClass('highlight_room');
    } else if ($(highlight_room).attr('class') != undefined && $(highlight_room).attr('class').includes('last')) {
        $(highlight_room).toggleClass('highlight_room');
        highlight_room = rooms[0];
        $(highlight_room).toggleClass('highlight_room');
    } else {
        $(highlight_room).toggleClass('highlight_room');
        highlight_room = $(highlight_room).next()[0];
        $(highlight_room).toggleClass('highlight_room');
    }
}

//loop through all of the rows in a table
function loopRows() {
    var rows = $('#letter_grid tbody').children();
    if (highlight_row == undefined) {
        highlight_row = rows[0];
        $(highlight_row).toggleClass('highlight_row');
    } else if ($(highlight_row).attr('class') != undefined && $(highlight_row).attr('class').includes('last')) {
        $(highlight_row).toggleClass('highlight_row');
        highlight_row = rows[0];
        $(highlight_row).toggleClass('highlight_row');
    } else {
        $(highlight_row).toggleClass('highlight_row');
        highlight_row = $(highlight_row).next()[0];
        $(highlight_row).toggleClass('highlight_row');
    }
}

//loop through all the cells in a row
function loopCells(row){
    var cells = $(row).children();
    // var highlight_cell;
    if (highlight_cell == undefined) {
        highlight_cell = cells[0];
        $(highlight_cell).toggleClass('highlight_cell');
    } else if ($(highlight_cell).attr('class') != undefined && $(highlight_cell).attr('class').includes('last')) {
        $(highlight_cell).toggleClass('highlight_cell');
        highlight_cell = cells[0];
        $(highlight_cell).toggleClass('highlight_cell');
    } else {
        $(highlight_cell).toggleClass('highlight_cell');
        highlight_cell = $(highlight_cell).next('td')[0];
        $(highlight_cell).toggleClass('highlight_cell');
    }            
    // console.log('CELL', highlight_cell);          
}
