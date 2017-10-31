'use strict';
class Calendar {

    constructor() {
        this._document = window.document;
        this._selectedRooms = [];
        this._rooms = [11, 12, 13, 21, 22, 23, 31, 32, 33, 34];
        this._monthNames = [
                            ["Январь", 1],
                            ["Февраль", 2],
                            ["Март", 3],
                            ["Апрель", 4],
                            ["Май", 5],
                            ["Июнь", 6],
                            ["Июль", 7],
                            ["Август", 8],
                            ["Сентябрь", 9],
                            ["Октябрь", 10],
                            ["Ноябрь", 11],
                            ["Декабрь", 12]
                        ];

        this._year = (new Date()).getFullYear();
        this._month = (new Date()).getMonth() + 1;

        this._clickListener = (function (e) {
            if (e.currentTarget.getAttribute('class') === 'selected') {
                e.currentTarget.removeAttribute('class');
            } else {
                e.currentTarget.setAttribute('class', 'selected');
            }
        });

    }

    get getDocument() {
        return this._document;
    }

    get getSelectedRooms() {
        return this._selectedRooms;
    }

    get getRooms() {
        return this._rooms;
    }

    get getMonthNames() {
        return this._monthNames;
    }

    get getYear() {
        return this._year;
    }

    get getMonth() {
        return this._month;
    }

    set setDocument(document) {
        this._document = document;
    }

    set setSelectedRooms(selectedRooms) {
        this._selectedRooms = selectedRooms;
    }

    set setYear(year) {
        this._document.getElementById('selectYear').value = year;
    }

    set setMonth(month) {
        this._document.getElementById("selectMonth").value = month;
    }
    
    parseYear() {
        this._year = this._document.getElementById('selectYear').value;
    }
    
    parseMonth() {
        this._month = this._document.getElementById("selectMonth").value;
    }

    updateYear() {
         this._document.getElementById('selectYear').value = this._year;
    }
    
    updateMonth() {
        this._document.getElementById("selectMonth").value = this._month;
    }

    getMonthNameByIndex(index_a, index_b) {
        return this._monthNames[index_a][index_b];
    }

    getRoom(index) {
        return this._rooms[index];
    }

    getSelectedRoom(index_a, index_b) {
        return this._selectedRooms[index_a][index_b];
    }

    createMonthSelection() {
        var select = this.getDocument.getElementById("selectMonth");
        for (let i = 0; i < this.getMonthNames.length; i++) {
            var month = this.getMonthNameByIndex(i, 0),
                el = this.getDocument.createElement("option");

            el.textContent = month;
            el.value = this.getMonthNameByIndex(i, 1);
            select.appendChild(el);
        }
    }

    deleteRowDays() {
        var calendar = this.getDocument.getElementById('calendar'),
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

    createRowDays() {
        var days = new Date(this.getYear, this.overlay(this.getMonth, 0, 2), 0).getDate(),
            month = this.getMonth,
            year = this.getYear,
            thead = this.getDocument.getElementById('calendar').getElementsByTagName('thead')[0],
            tr = this.getDocument.createElement('tr');

        for (let i = 0; i <= days; i++) {
            var td = this.getDocument.createElement('th');
            if (0 == i) {
                td.appendChild(this.getDocument.createTextNode(""));
            } else {
                td.appendChild(this.getDocument.createTextNode(i));
            }
            tr.appendChild(td);
        }
        thead.appendChild(tr);
    }

    createRowsByRooms() {
        var totalCells = this.getDocument
            .getElementById('calendar')
            .getElementsByTagName('thead')[0]
            .getElementsByTagName('tr')[0]
            .childElementCount,
            tbody = this.getDocument.getElementById('calendar').getElementsByTagName('tbody')[0];

        for (let i = 0; i < this.getRooms.length; i++) {
            var tr = this.getDocument.createElement('tr');
            for (let j = 0; j < totalCells; j++) {
                var node;
                if (0 == j) {
                    node = this.getDocument.createElement('th');
                    node.appendChild(this.getDocument.createTextNode(this.getRoom(i)));
                } else {
                    node = this.getDocument.createElement('td');
                    node.id = this.getRoom(i);
                    node.addEventListener('click', this._clickListener);
                    node.appendChild(this.getDocument.createTextNode(""));
                }
                tr.appendChild(node);
            }
            tbody.appendChild(tr);
        }
    }

    coloringSelectedDay() {
        if (this.getSelectedRooms.length == 0) {
            return;
        }
        var tbody = this.getDocument.getElementById('calendar').getElementsByTagName('tbody')[0];
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
    }

    overlay(val, char, len) {
        var overlayedVal = val + "";
        while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
        return overlayedVal;
    }
};