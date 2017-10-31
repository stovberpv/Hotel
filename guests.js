'use strict';
class Guest {

    constructor() {
        this._document = window.document;
        this._guestsList = [];

        this._clickListener_select = (function (e) {
            if (e.currentTarget.getAttribute('class') === 'selected') {
                e.currentTarget.removeAttribute('class');
            } else {
                e.currentTarget.setAttribute('class', 'selected');
            }
        });
        this._guestTableColumns = 9;
    }

    get getDocument() {
        return this._document;
    }

    get getGuestsList() {
        return this._guestsList;
    }

    getGuest(index_a) {
        return this._guestsList[index_a];
    }

    getGuest(index_a, index_b) {
        return this._guestsList[index_a][index_b];
    }
    
    guestsListInsert(dayin, dayout, room, price, paid, name, tel, text) {
        this._guestsList.push(dayin, dayout, room, price, paid, name, tel, text);
    }

    //TODO SQL
    refreshTable() {
        /*
        var table = this.getDocument.getElementById('guests'),
            tbody = table.getElementsByTagName('tbody')[0],
            tr,
            td;

        tr = tbody.getElementsByTagName('tr')
        for (let i = tr.length; i > 0; i--) {
            tbody.removeChild(tr[0]);
        }

        for (let i = 0; i < this.getGuestsList.length; i++) {
            td = this.getDocument.createElement('td');
            td.appendChild(this.getDocument.createTextNode(i + 1));

            tr = this.getDocument.createElement('tr');
            tr.appendChild(td);
            tr.addEventListener('click', this._clickListener_select);

            for (let j = 0; j < this._guestTableColumns; j++) {
                td = this.getDocument.createElement('td');
                td.appendChild(this.getDocument.createTextNode(this.getGuest(i, j)));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        //  $( "#guests" ).load( "index.html #guests" ); TODO ???
        */
    }

    guestAdd(val) {
        var dayin = val["dayin"];
        var dayout = val["dayout"];
        var room = val["room"];
        var price = val["price"];
        var paid = val["paid"];
        var name = val["name"];
        var tel = val["tel"];
        var text = val["text"];
        this.guestsListInsert([dayin, dayout, room, price, paid, name, tel, text]);
        this.refreshTable();
    }

    //TODO Edit Guest
    guestEdit() {

    }
    
    //TODO Delete Guest
    guestDelete() {

    }
}
