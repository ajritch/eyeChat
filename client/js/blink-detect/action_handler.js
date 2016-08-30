var cell_loop; //interval to loop through all cells in a row
var row_loop; //interval to loop through all rows in table
var highlight_row; //row currently highlighted
var highlight_cell; //cell currently highlighted

var blink_mode = false; //true if blinking turned on

//clear whatever loop interval was happily going on
clearInterval(row_loop);
clearInterval(cell_loop);

//interval timing
const INTERVAL = 1200;



var handle_blink = function() {
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
                console.log(action);
                switch(action) {
                    case 'backspace-btn':
                        var wordStr = $('#building_word').html();
                        console.log(wordStr);
                        wordStr = wordStr.substring(0, wordStr.length - 1);
                        $('#building_word').html(wordStr);
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