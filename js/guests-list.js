'use strict';
var guestsList = {

    addGuest: function (data) {
        var tbody = document.getElementById('guests-table').getElementsByTagName('tbody')[0],
            tr = document.createElement('tr');

        for (let i = 0; i < globals.guestsTableColumns; i++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(utils.getKeyValue(globals.newGuest[0], i)));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    },

    delGuest: function (id) {
        globals.guestsList.slice(id, 1);
    },

    modGuest: function (id, guest) {
        globals.guestsList[id] = guest;
    },

    createGuestListTableBody: function () {

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
            tr.addEventListener('click', utils.clickListener_select);

            for (let j = 0; j < globals.guestsTableColumns; j++) {
                td = document.createElement('td');
                td.appendChild(document.createTextNode(utils.getKeyValue(globals.guestsList[i], j)));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
}
