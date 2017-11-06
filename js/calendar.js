'use strict';
var calendar = {

    setYear: function (val) {
        globals.year = val;
        document.getElementById('year').textContent = globals.year;
    },

    setMonth: function (val) {
        globals.month = val;
        document.getElementById('month').value = globals.monthNames[val, 0]; //TODo test
    },

    deleteCalendarTableHead: function () {
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
    },

    createCalendarTableHead: function () {
        var days = new Date(globals.year, utils.overlay(globals.month, 0, 2), 0).getDate(),
            thead = document.getElementById('calendar-table').getElementsByTagName('thead')[0],
            tr,
            th;

        th = document.createElement('th');
        th.setAttribute('colspan', days + 1);
        th.setAttribute('id', 'month');
        th.appendChild(document.createTextNode(globals.monthNames[globals.month][0]));

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
    },

    createCalendarTableBody: function () {
        var totalCells = document
            .getElementById('calendar-table')
            .getElementsByTagName('thead')[0]
            .getElementsByTagName('tr')[1]
            .childElementCount,
            tbody = document.getElementById('calendar-table').getElementsByTagName('tbody')[0];

        for (let i = 0; i < globals.rooms.length; i++) {
            var tr = document.createElement('tr');
            for (let j = 0; j < totalCells; j++) {
                var node;
                if (0 == j) {
                    node = document.createElement('th');
                    node.appendChild(document.createTextNode(globals.rooms[i]));
                } else {
                    node = document.createElement('td');
                    node.id = globals.rooms[i];
                    node.addEventListener('click', clickListener_select);
                    node.appendChild(document.createTextNode(""));
                }
                tr.appendChild(node);
            }
            tbody.appendChild(tr);
        }
    },

    coloringCalendar: function (data) {

        var tbody = document.getElementById('calendar-table').getElementsByTagName('tbody')[0];

        var oneDay = 86400000;
        var firstDay = Date.parse(globals.year + "-" + globals.month + "-" + 1);
        var lastDay = Date.parse(globals.year + "-" + globals.month + "-" + utils.getDaysInMonth(globals.month, globals.year));
        var today = Date.parse(new Date());

        for (let guest = 0; guest < data.length; guest++) {

            var dayin = Date.parse(data[guest].dayin);
            var dayout = Date.parse(data[guest].dayout);
            var room = data[guest].room;
            var rows = tbody.children.length;
            var childRow = -1;

            for (let row = 0; row < rows; row++) {

                if (tbody.children[row].textContent == room) {
                    childRow = row;
                    break;
                }
            }
            
            if (childRow == -1) {
                console.log("calendar.coloringCalendar.childRow = " + childRow + ", room =" + room);
                return;
            }

            while (dayin <= dayout) {

                if (dayin >= firstDay && dayin <= lastDay) {
                    var date = new Date(dayin);
                    var day = date.getDate();
                    var childCell = day;

                    var newAttr;
                    if (dayin < today) {
                        newAttr = globals.class_redeemed; /*выкупленный*/
                    } else if (dayin >= today) {
                        newAttr = globals.class_reserver; /*зарезервирован*/
                    }

                    if (tbody.children[childRow].children[childCell].hasAttribute('class')) {
                        newAttr = globals.class_adjacent; /*смежный*/
                    }

                    tbody.children[childRow].children[childCell].setAttribute('class', newAttr);
                }
                dayin += oneDay;
            }
        }
    },

    resetCalendarColors: function () {
        var tbody = document.getElementById('calendar-table').getElementsByTagName('tbody')[0];
        for (let i = 1; i < tbody.children.length; i++) {
            var row = tbody.children[i];
            for (let j = 1; j < row.children.length; j++) {
                var cell = row.children[j];
                if (cell.hasAttribute('class')) {
                    cell.removeAttribute('class');
                }
            }
        }
    }

}
