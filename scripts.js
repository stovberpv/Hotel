var selected = new Array();

//
window.onload = function onload() {
    "use strict";
    createSelectMonthSelect();
    setYear();
    createCalendarTable();
    
    document.getElementById('selectMonth').addEventListener('change', createCalendarTable);
}

//
function createSelectMonthSelect() {
    "use strict";
    var monthNames = [ ["Январь",    1], 
                       ["Февраль",   2], 
                       ["Март",      3], 
                       ["Апрель",    4], 
                       ["Май",       5], 
                       ["Июнь",      6], 
                       ["Июль",      7], 
                       ["Август",    8], 
                       ["Сентябрь",  9], 
                       ["Октябрь",  10], 
                       ["Ноябрь",   11], 
                       ["Декабрь",  12] ];
    var currentDate = new Date();
    var select = document.getElementById("selectMonth");

    for (var i = 0; i < monthNames.length; i++) {
        var month = monthNames[i][0];
        var el = document.createElement("option");
        el.textContent = month;
        el.value = monthNames[i][1];
        select.appendChild(el);
    }
}

//
function setYear(){
    "use strict";
    document.getElementById('selectYear').value = "2017";
}

//
function createCalendarTable() {
    delRowDays();
    setRowDays();
    addRooms();
}

//
function delRowDays() {
    "use strict";
    var calendar = document.getElementById('calendar');

    var thead = calendar.getElementsByTagName('thead')[0];
    var tr = thead.getElementsByTagName('tr');
    for (var i = tr.length; i > 0; i--) {
	thead.removeChild(tr[0]);
    }
    
    var tbody = calendar.getElementsByTagName('tbody')[0];
    var tr = tbody.getElementsByTagName('tr');
    for (var i = tr.length; i > 0; i--) {
	tbody.removeChild(tr[0]);
    }
}

//
function setRowDays(month) {
    "use strict";
    var month = document.getElementById('selectMonth').value,
    	year = document.getElementById('selectYear').value,
    	days = new Date(year, overlay(month, 0, 2), 0).getDate();
    
    var thead = document.getElementById('calendar').getElementsByTagName('thead')[0],
	tr = document.createElement('tr');
    
    for (var i = 0; i <= days; i++) {
        var td = document.createElement('th');
	if (i == 0) {
		td.appendChild(document.createTextNode("R"));
	} else {
		td.appendChild(document.createTextNode(i));
	}
        tr.appendChild(td);
    }
    thead.appendChild(tr);
}

// 
function overlay(val, char, len) {
    "use strict";
    var overlayedVal = val + "";
    while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
    return overlayedVal;
}

//
function addRooms(){
    "use strict";
    var rooms = [11, 12, 13, 21, 22, 23, 31, 32, 32, 34];
    
    var totalCells = document
			.getElementById('calendar')
			.getElementsByTagName('thead')[0]
			.getElementsByTagName('tr')[0]
			.childElementCount;

    var tbody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
    for (var i = 0; i < rooms.length; i++) {
	var tr = document.createElement('tr');
    	for (var j = 0; j < totalCells; j++) {
		if (j == 0) {
			var node = document.createElement('th');
			node.appendChild(document.createTextNode(rooms[i]));
		} else {
			var node = document.createElement('td');
			node.id = rooms[i];
			node.addEventListener('click', cellClick);
			node.appendChild(document.createTextNode(""));
		}
	tr.appendChild(node);
	}
	tbody.appendChild(tr);
    }
}

//
function cellClick() {
	var room = parseInt(this.id);
	var day = this.cellIndex;
	
	var res = isSelected([room, day]);
	
	if (res[0]) {
        selected.splice(res[1], 1);
        this.removeAttribute('class');
	} else {
		selected.push([room, day]);
        this.setAttribute('class', 'selected');
	}
}

//
function isSelected(item) {
    for (var i = 0; i < selected.length; i++) {
        if (selected[i][0] == item[0] && selected[i][1] == item[1]) {
            return [true, i];
        }
    }
    return [false, -1];
}