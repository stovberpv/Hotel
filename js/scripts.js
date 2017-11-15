'use strict';

//---------------------------------------------------------------------
//  GLOBALS BEGIN
//---------------------------------------------------------------------
const globals = {
    month: "", //(new Date()).getMonth() + 1
    year: "", //(new Date()).getFullYear()
    guestsTableColumns: 9,
    guestsList: [],
    newGuest: [],
    selectedRooms: [],
    rooms: [11, 12, 13, 21, 22, 23, 31, 32, 33, 34],
    monthNames: ["", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    class_selected: "selected",
    class_reserver: "reserver",
    class_adjacent: "adjacent",
    class_redeemed: "redeemed"
}
//---------------------------------------------------------------------
//  GLOBALS END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  UTILS BEGIN
//---------------------------------------------------------------------
const utils = {

    initialize: function () {
        $.ajax({
            url: './php/func/initialize.php',
            data: { sessionId: 'root' }, //TODO session id
            dataType: 'json',
            success: function (data) {
                utils.setYear(data['year']);
                globals.month = data['month'];
                globals.rooms = data['rooms'];
                globals.guestsList = data['guestList'];
                calendarTable.del();
                calendarTable.addHead();
                calendarTable.addBody();
                calendarTable.setRoomsStatus(globals.guestsList);
                guestsTable.addBody();
            },
            error: function (xhr, textStatus, errorThrown) {
                $( "#ajax-msg" ).append( xhr.responseText );
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },

    setYear: function (val) {
        globals.year = val;
        document.getElementById('year').textContent = globals.year;
    },

    setMonth: function (val) {
        globals.month = val;
        document.getElementById('month').value = globals.monthNames[val, 0];
    },

    getYear: function () {

    },

    getMonth: function () {

    },

    getRooms: function () {

    },

    getGuestsList: function () {
        $.ajax({
            url: './php/guests/db-select.php',
            data: { /*"year=" + encodeURIComponent(year) + "&month=" + month*/
                year: globals.year,
                month: globals.month
            },
            dataType: 'json',
            success: function (data) {
                calendarTable.delRoomsStatus();
                globals.guestsList = data.data;
                guestsTable.addBody();
                calendarTable.setRoomsStatus(globals.guestsList);
            },
            error: function (xhr, textStatus, errorThrown) {
                $( "#ajax-msg" ).append( xhr.responseText );
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },

    overlay: function (val, char, len) {
        var overlayedVal = val + "";
        while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
        return overlayedVal;
    },

    getDaysInMonth: function (m, y) {
        return m === 2 ? y & 3 || !(y % 25) && y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1);
    },

    getKeyValue: function (data, index) {
        switch (index) {
            case 0:
                return data.id;
                break;
            case 1:
                return data.dayin;
                break;
            case 2:
                return data.dayout;
                break;
            case 3:
                return data.room;
                break;
            case 4:
                return data.price;
                break;
            case 5:
                return data.paid;
                break;
            case 6:
                return data.name;
                break;
            case 7:
                return data.tel;
                break;
            case 8:
                return data.info;
                break;
            default:
                break;
        }
        /*
        var iteration = 0;
        for (var propName in data) {
            if (iteration == index) {
                if (data.hasOwnProperty(propName)) {
                    return data[propName];
                }
            } else if(iteration> index) {
                return "";
            }
            iteration += 1;
        }
        */
    }

}
//---------------------------------------------------------------------
//  UTILS END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  CLICK LISTENERS BEGIN
//---------------------------------------------------------------------
var clickListener_select = (function (e) {
    if (e.currentTarget.hasAttribute('class')) {
        if (e.currentTarget.getAttribute('class') === globals.class_selected) {
            e.currentTarget.removeAttribute('class');
        } else {
            // do nothing!
        }
    } else {
        e.currentTarget.setAttribute('class', globals.class_selected);
    }
});
//---------------------------------------------------------------------
//  CLICK LISTENERS END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  INITIALIZE BEGIN
//---------------------------------------------------------------------
const initialize = {
    
}
//---------------------------------------------------------------------
//  INITIALIZE END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  CALENDAR TABLE BEGIN
//---------------------------------------------------------------------
const calendarTable = {

    del: function () {
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

    addHead: function () {
        var days = new Date(globals.year, utils.overlay(globals.month, 0, 2), 0).getDate(),
            thead = document.getElementById('calendar-table').getElementsByTagName('thead')[0],
            tr,
            th;

        th = document.createElement('th');
        th.setAttribute('colspan', days + 1);
        th.setAttribute('id', 'month');
        th.appendChild(document.createTextNode(globals.monthNames[globals.month]));

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

    addBody: function () {
        var totalCells = document.getElementById('calendar-table').getElementsByTagName('thead')[0].getElementsByTagName('tr')[1].childElementCount,
            tbody = document.getElementById('calendar-table').getElementsByTagName('tbody')[0];

        for (let i = 0; i < globals.rooms.length; i++) {
            var tr = document.createElement('tr');
            for (let j = 0; j < totalCells; j++) {
                var node;
                if (0 == j) {
                    node = document.createElement('th');
                    node.appendChild(document.createTextNode(globals.rooms[i].room));
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

    setRoomsStatus: function (data) {
        var tbody = document.getElementById('calendar-table').getElementsByTagName('tbody')[0],
            oneDay = 86400000,
            firstDay = Date.parse(globals.year + "-" + globals.month + "-" + 1),
            lastDay = Date.parse(globals.year + "-" + globals.month + "-" + utils.getDaysInMonth(globals.month, globals.year)),
            today = Date.parse(new Date());

        for (let guest = 0; guest < data.length; guest++) {

            var dayin = Date.parse(data[guest].dayin),
                dayout = Date.parse(data[guest].dayout),
                room = data[guest].room,
                rows = tbody.children.length,
                childRow = -1;

            for (let row = 0; row < rows; row++) {

                if (tbody.children[row].textContent == room) {
                    childRow = row;
                    break;
                }
            }

            if (childRow == -1) {
                console.log("calendarTable.setRoomsStatus.childRow = " + childRow + ", room =" + room);
                return;
            }

            while (dayin <= dayout) {

                if (dayin >= firstDay && dayin <= lastDay) {
                    var date = new Date(dayin),
                        day = date.getDate(),
                        childCell = day,
                        newAttr;

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

    delRoomsStatus: function (opts) {
        var tbody = document.getElementById('calendar-table').getElementsByTagName('tbody')[0];
        if (opts !== undefined) {
            //todo
        } else {
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
}
//---------------------------------------------------------------------
//  CALENDAR TABLE END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  GUESTS TABLE BEGIN
//---------------------------------------------------------------------
const guestsTable = {

    addGuest: function (data) {
        var tbody = document.getElementById('guests-table').getElementsByTagName('tbody')[0],
            tr = document.createElement('tr');

        for (let i = 0; i < globals.guestsTableColumns; i++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(utils.getKeyValue(globals.newGuest[0], i)));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);

        $.ajax({
            url: './php/guest-list/db-insert.php',
            data: {
                year: globals.year,
                month: globals.month,
                dayin: globals.newGuest[0].dayin,
                dayout: globals.newGuest[0].dayout,
                room: globals.newGuest[0].room,
                price: globals.newGuest[0].price,
                paid: globals.newGuest[0].paid,
                name: globals.newGuest[0].name,
                tel: globals.newGuest[0].tel,
                info: globals.newGuest[0].info
            },
            dataType: 'json',
            success: function (data) {
                globals.newGuest[0].id = data.id;
                this.addGuest();
                calendarTable.setRoomsStatus(globals.newGuest);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },

    delGuest: function (id) {
        for (let i = globals.guestsList.length - 1; i--;) {
            if (globals.guestsList[i].id == id) globals.guestsList.splice(i, 1);
        }
        //TODO delete guest-list table body only deleted id by id == child.td.id
        var tbody = document.getElementById('guest-table').getElementsByTagName('tbody')[0];
        for (let i = 0; i < tbody.childElementCount; i++) {
            var curId = tbody.children[i].getElementsByTagName('tr')[0].getElementsByTagName('td')[0];
            if (curId == id) {
                tbody.removeChild[i];
            }
        }

        $.ajax({
            url: './php/guest-list/db-delete.php',
            data: {
                id: opts.id
            },
            dataType: 'json',
            success: function (data) {
                if (data.rows != 0) {
                    this.delGuest(data.id);
                    calendarTable.delRoomsStatus(); //TODO reset ony del
                    calendarTable.setRoomsStatus(globals.guestsList);
                }
                /*
                guestsList.createGuestListTableBody();
                */
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },

    modGuest: function (id, guest) {
        globals.guestsList[id] = guest;
        //TODO
    },

    addBody: function () {
        var table = document.getElementById('guests-table'),
            tbody = table.getElementsByTagName('tbody')[0],
            tr,
            td;

        tr = tbody.getElementsByTagName('tr')
        for (let i = tr.length; i > 0; i--) {
            tbody.removeChild(tr[0]);
        }

        for (let i = 0; i < globals.guestsList.length; i++) {
            tr = document.createElement('tr');
            tr.addEventListener('click', clickListener_select);

            for (let j = 0; j < globals.guestsTableColumns; j++) {
                td = document.createElement('td');
                td.appendChild(document.createTextNode(utils.getKeyValue(globals.guestsList[i], j)));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    },
}
//---------------------------------------------------------------------
//  GUESTS TABLE END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//   BEGIN
//---------------------------------------------------------------------

//---------------------------------------------------------------------
//   END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//   BEGIN
//---------------------------------------------------------------------

//---------------------------------------------------------------------
//   END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//   BEGIN
//---------------------------------------------------------------------

//---------------------------------------------------------------------
//   END
//---------------------------------------------------------------------