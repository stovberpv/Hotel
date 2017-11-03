'use strict';

function addGuest(opt) {
    var dayin = opt["dayin"];
    var dayout = opt["dayout"];
    var room = opt["room"];
    var price = opt["price"];
    var paid = opt["paid"];
    var name = opt["name"];
    var tel = opt["tel"];
    var text = opt["text"];
    guestsList.push(dayin, dayout, room, price, paid, name, tel, text);
}

function delGuest(id) {
    guestsList.slice(id, 1);
}

function modGuest(id, guest) {
    guestsList[id] = guest;
}

function createGuestListTableBody() {

    var table = document.getElementById('guests-table'),
        tbody = table.getElementsByTagName('tbody')[0],
        tr,
        td;

    tr = tbody.getElementsByTagName('tr')
    for (let i = tr.length; i > 0; i--) {
        tbody.removeChild(tr[0]);
    }

    for (let i = 0; i < guestsList.length; i++) {
        tr = document.createElement('tr');
        tr.addEventListener('click', clickListener_select);

        for (let j = 0; j < guestsTableColumns; j++) {
            td = document.createElement('td');
            td.appendChild(document.createTextNode(getKeyValue(guestsList[i], j)));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

function getKeyValue(data, index) {
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
}