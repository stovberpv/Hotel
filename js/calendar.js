'use strict';

function setYear(val) {
    year = val;
    document.getElementById('year').textContent = year;
}

function setMonth(val) {
    month = val;
    document.getElementById('month').value = monthNames[val, 0]; //TODo test
}

function deleteCalendarTableHead() {
    var calendar = document.getElementById('calendar-table'),
        thead = calendar.getElementsByTagName('thead')[0],
        tbody = calendar.getElementsByTagName('tbody')[0],
        tr;

    tr = thead.getElementsByTagName('tr');
    for (let i = tr.length; i > 0; i--) {
        thead.removeChild(tr[0]);
    }

    tr = tbody.getElementsByTagName('tr');
    for (let i = tr.length; i > 0; i--) {
        tbody.removeChild(tr[0]);
    }
}

function createCalendarTableHead() {
    var days = new Date(year, overlay(month, 0, 2), 0).getDate(),
        thead = document.getElementById('calendar-table').getElementsByTagName('thead')[0],
        tr,
        th;

    th = document.createElement('th');
    th.setAttribute('colspan', days + 1);
    th.setAttribute('id', 'month');
    th.appendChild(document.createTextNode(monthNames[month][0]));

    tr = document.createElement('tr')
    tr.appendChild(th);
    thead.appendChild(tr);

    tr = document.createElement('tr');
    for (let i = 0; i <= days; i++) {
        th = document.createElement('th');
        if (0 == i) {
            th.appendChild(document.createTextNode(""));
        } else {
            th.appendChild(document.createTextNode(i));
        }
        tr.appendChild(th);
    }
    thead.appendChild(tr);
}

function createCalendarTableBody() {
    var totalCells = document
        .getElementById('calendar-table')
        .getElementsByTagName('thead')[0]
        .getElementsByTagName('tr')[1]
        .childElementCount,
        tbody = document.getElementById('calendar-table').getElementsByTagName('tbody')[0];

    for (let i = 0; i < rooms.length; i++) {
        var tr = document.createElement('tr');
        for (let j = 0; j < totalCells; j++) {
            var node;
            if (0 == j) {
                node = document.createElement('th');
                node.appendChild(document.createTextNode(rooms[i]));
            } else {
                node = document.createElement('td');
                node.id = rooms[i];
                node.addEventListener('click', clickListener_select);
                node.appendChild(document.createTextNode(""));
            }
            tr.appendChild(node);
        }
        tbody.appendChild(tr);
    }
}

function coloringSelectedDay() {
    /* TODo
    if (this.getSelectedRooms.length == 0) {
        return;
    }
    var tbody = this.getDocument.getElementById('calendar-table').getElementsByTagName('tbody')[0];
    for (let i = 1; i < tbody.childNodes.length; i++) {
        for (let j = 1; j < tbody.childNodes[i].childNodes.length; j++) {
            for (let k = 0; k < this.getSelectedRooms.length; k++) {
                var day = j;
                var month = this.getMonth;
                var year = this.getYear;
                var room = this.getRoom(i - 1);
                if (this.getSelectedRoom(k, 0) == year &&
                    this.getSelectedRoom(k, 1) == month &&
                    this.getSelectedRoom(k, 2) == day &&
                    this.getSelectedRoom(k, 3) == room) {
                    tbody.childNodes[i].childNodes[j].setAttribute('class', 'selected');
                }
            }
        }
    }
    */
}

function overlay(val, char, len) {
    var overlayedVal = val + "";
    while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
    return overlayedVal;
}
