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

    var tbody = document.getElementById('calendar-table').getElementsByTagName('tbody')[0];

    var oneDay = 86400000;
    var firstDay = Date.parse(year + "-" + month + "-" + 1);
    var lastDay = Date.parse(year + "-" + month + "-" + getDaysInMonth(month, year));
    var today = Date.parse(new Date());

    for (let guest = 0; guest < guestsList.length; guest++) {

        var dayin = Date.parse(guestsList[guest].dayin);
        var dayout = Date.parse(guestsList[guest].dayout);
        var room = guestsList[guest].room;
        var rows = tbody.childNodes.length;
        var childRow = -1;

        for (let row = 1; row < rows; row++) {

            if (tbody.childNodes[row].textContent == room) {
                childRow = row;
                break;
            }
        }

        while (dayin <= dayout) {

            if (dayin >= firstDay && dayin <= lastDay) {
                var date = new Date(dayin);
                var day = date.getDate();
                var childCell = day;

                var newAttr;
                if (dayin < today) {
                    newAttr = class_redeemed; /*выкупленный*/
                } else if (dayin >= today) {
                    newAttr = class_reserver; /*зарезервирован*/
                }
                
                if (tbody.childNodes[childRow].childNodes[childCell].hasAttribute('class')) {
                    newAttr = class_adjacent; /*смежный*/
                }

                tbody.childNodes[childRow].childNodes[childCell].setAttribute('class', newAttr);
            }
            dayin += oneDay;
        }
    }
}

function overlay(val, char, len) {
    var overlayedVal = val + "";
    while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
    return overlayedVal;
}

function getDaysInMonth(m, y) {
    return m === 2 ? y & 3 || !(y % 25) && y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1);
}
