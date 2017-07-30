//
window.onload = function onload() {
    "use strict";
    createSelectMonthSelect();
    setYear();
    createCalendarTable();
    addRooms();
    
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
}

//
function delRowDays() {
    "use strict";
    var tbody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
    var tr = tbody.getElementsByTagName('tr');
//    tbody.removeAttribute(tr);
    tbody.removeChild;
}
//
function setRowDays(month) {
    "use strict";
    var month = document.getElementById('selectMonth').value;
    var year = document.getElementById('selectYear').value;
    var days = new Date(year, overlay(month, 0, 2), 0).getDate();
    
    var tbody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
    var daysRow = tbody.insertRow(tbody.rows.length);
    
    for (var i = 0; i <= days; i++) {
        var dayCell = daysRow.insertCell(i)
        var textCell = document.createTextNode(i);
        dayCell.appendChild(textCell);
    }
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
    
    var tbody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
    var tr = tbody.rows[0];
    tr.cells[0].textContent = " ";
    
    for (var i = 0; i < rooms.length; i++) {
        var newRow = tr.cloneNode(true);
        var cell = newRow.cells[0].textContent = rooms[i];
        tbody.appendChild(newRow);
    }
}