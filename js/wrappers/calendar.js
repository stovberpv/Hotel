const guest = {

    add: function (year, month, list) {

        var list = (list === undefined) ? [] : list;

        for (let i = 0; i < list.length; i++) {
            var wa = list[i];

            // calendar begin
            var begda = new Date(wa.dayin),
                endda = new Date(wa.dayout),
                curda = new Date(),
                tmpda = begda;

            while (tmpda <= endda) {
                if (tmpda.format('yyyy-mm') == (year + '-' + month)) {

                    //
                    var td = document.querySelector('#calendar tbody tr#R' + wa.room + ' td#RD' + wa.room + '_' + tmpda.format('yyyy-mm-dd'));
                    td.innerHTML = '';

                    // добавляем класс
                    if (td.classList.contains(gl.class_redeemed) || td.classList.contains(gl.class_reserved)) {
                        td.classList.remove(gl.class_redeemed);
                        td.classList.remove(gl.class_reserved);
                        td.classList.add(gl.class_adjacent);
                    } else {
                        td.classList.remove(gl.class_selected);
                        if (tmpda < curda) {
                            td.classList.add(gl.class_redeemed);
                        } else {
                            td.classList.add(gl.class_reserved);
                        }
                    }
                    td.classList.add('N' + wa.id);

                    // добавляем подсказку  
                    var div = td.getElementsByTagName('div'),
                        hintText = '№' + wa.id + ' ' + wa.name + ' с ' + begda.format('dd.mm') + ' по ' + endda.format('dd.mm');
                    if (div.length == 0) {
                        var span = document.createElement('span');
                        span.setAttribute('class', 'hintText');
                        span.appendChild(document.createTextNode(hintText));
                        div = document.createElement('div');
                        div.setAttribute('class', 'hint');
                        div.appendChild(span);
                        td.append(div);
                    } else {
                        div.children('span').append('<br>' + hintText);
                    }
                }

                begda.setDate(begda.getDate() + 1);
            }
            // calendar end

            // book begin
            var hiddenRow = document.getElementById('R' + wa.room + '-book');
            if (!hiddenRow) {
                hiddenRow = document.createElement('tr');
                hiddenRow.setAttribute('id', 'R' + wa.room + '-book');
                hiddenRow.classList.add('hidden');
                var td = document.createElement('td'),
                    days = new Date(year, month, 0).getDate();
                td.setAttribute('colspan', days + 1);
                var table = document.createElement('table');
                table.classList.add('book');
                table.appendChild(document.createElement('tbody'));
                td.appendChild(table);
                hiddenRow.appendChild(td);
                var tr = document.querySelector('#calendar tbody tr#R' + wa.room );
                tr.parentNode.insertBefore(hiddenRow, tr.nextSibling);
                hiddenRow = document.getElementById('R' + wa.room + '-book');
            }

            var rTable = hiddenRow.querySelector('table'),
                rBody = rTable.querySelector('tbody'),
                tr, rTR, td, a;

            //------------------------------------------------------------
            td = document.createElement('td');
            td.setAttribute('class', 'person-id');
            td.appendChild(document.createTextNode(wa.id));

            rTR = document.createElement('tr');
            rTR.setAttribute('class', 'person-row');
            rTR.setAttribute('id', 'N' + wa.id);
            rTR.appendChild(td);
            //------------------------------------------------------------

            //------------------------------------------------------------
            td = document.createElement('td');
            td.setAttribute('class', 'person-base-info');

            a = document.createElement('a');
            a.setAttribute('class', 'person-name');
            a.appendChild(document.createTextNode(wa.name));
            td.appendChild(a);

            if (wa.tel.length > 0) {
                a = document.createElement('a');
                a.setAttribute('class', 'person-tel');
                a.appendChild(document.createTextNode(wa.tel));
                td.appendChild(a);
            }

            tr = document.createElement('tr');
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-dates');
            td.classList.add('person-dayin');
            td.appendChild(document.createTextNode('с  ' + (new Date(wa.dayin).format('dd.mm'))));
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-room-num');
            td.setAttribute('rowspan', '2');
            td.appendChild(document.createTextNode(wa.room));
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-room-price');
            td.appendChild(document.createTextNode(wa.price));
            tr.appendChild(td);

            var tbody = document.createElement('tbody')
            tbody.appendChild(tr);
            //------------------------------------------------------------

            //------------------------------------------------------------
            tr = document.createElement('tr');

            td = document.createElement('td');
            td.setAttribute('class', 'person-additional-info');

            a = document.createElement('a');
            a.setAttribute('class', 'person-city');
            a.appendChild(document.createTextNode(wa.city));
            td.appendChild(a);

            a = document.createElement('a');
            a.setAttribute('class', 'person-fn');
            a.appendChild(document.createTextNode(wa.fn));
            td.appendChild(a);

            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-dates');
            td.classList.add('person-dayout');
            td.appendChild(document.createTextNode('по ' + (new Date(wa.dayout).format('dd.mm'))));
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-room-paid');
            td.appendChild(document.createTextNode(wa.paid));
            tr.appendChild(td);

            tbody.appendChild(tr);
            //------------------------------------------------------------

            //------------------------------------------------------------
            var iTable = document.createElement('table');
            iTable.setAttribute('class', 'innerBook');
            iTable.appendChild(tbody);
            //------------------------------------------------------------

            //------------------------------------------------------------
            td = document.createElement('td');
            td.appendChild(iTable);
            //------------------------------------------------------------

            //------------------------------------------------------------
            rTR.appendChild(td);
            //------------------------------------------------------------

            //------------------------------------------------------------
            rBody.appendChild(rTR);
            //------------------------------------------------------------
            // book end
        }
    },

    del: function (list) {
        for (let i = 0; i < list.length; i++) {
            var wa = list[i];

            // calendar begin
            var room = wa.room,
                begda = new Date(wa.dayin),
                endda = new Date(wa.dayout),
                curda = new Date();

            while (begda <= endda) {
                var date = begda.format('yyyy-mm-dd'),
                    td = document.querySelector('#calendar tbody tr#R' + room + ' td#RD' + room + '_' + date);
                td.removeClass('N' + wa.id);
                td.removeClass('N' + wa.id + '-' + gl.class_viewfix);
                td.removeClass('N' + wa.id + '-' + gl.class_view);
                if (td.hasClass(gl.class_adjacent)) {
                    td.removeClass(gl.class_adjacent);
                    if (begda < curda) {
                        td.addClass(gl.class_redeemed);
                    } else {
                        td.addClass(gl.class_reserved);
                    }
                } else {
                    td.removeClass(gl.class_redeemed);
                    td.removeClass(gl.class_reserved);
                }
                td.children('div').remove();
                begda.setDate(begda.getDate() + 1);
            }
            // calendar end

            // book begin
            var tr = document.querySelector('.book > tbody > tr#N' + wa.id);
            tr.parentNode.removeChild(tr);
            if (tables.isEmptyBook(wa.room)) {
                tr = document.querySelector('#calendar > tbody > tr#R' + wa.room + '-book');
                tr.parentNode.removeChild(tr);
            }
            // book end
        }
    },

    upd: function (oldData, newData) {

        this.del(oldData);
        var year = document.getElementById('year').innerHTML,
            monthName = document.getElementById('month').innerHTML,
            month = gl.monthNames.indexOf(monthName);
        this.add(year, month, newData)

        // book sort begin
        var tr = document.querySelector('#R' + newData[0].room + '-book > td > .book > tbody > tr'),
            pos = [];
        for (let i = 0; i < tr.length; i++) {
            pos.push({
                id: parseInt(tr[i].children[0].innerHTML, 10),
                pos: i
            });
        }

        pos.sort(function (a, b) {
            return a.id - b.id;
        });

        var prevRow = document.querySelector('#R' + newData[0].room + '-book tr#N' + pos[0].id);
        for (let i = 0; i < (pos.length - 1); i++) {
            if (pos[i].pos > pos[i + 1].pos) {
                var curRow = document.querySelector('#R' + newData[0].room + '-book tr#N' + pos[i].id),
                    nextRow = document.querySelector('#R' + newData[0].room + '-book tr#N' + pos[i + 1].id);
                nextRow.parentNode.insertBefore(nextRow, curRow);
            }
            prevRow = document.querySelector('#R' + newData[0].room + '-book tbody tr#N' + pos[i].id);
        }
        // book sort end
    }
}

const tables = {

    create: function (year, month) {

        var monthName = utils.getMonthName(month),
            days = new Date(year, month, 0).getDate();

        // thead begin
        //  --- чистим
        //  --- --- тело
        document.querySelector('#calendar > tbody').innerHTML = "";
        // дни месяца
        var trdays = document.getElementById('calendar-row-days'),
            childs = trdays.children.length;
        for (let i = 0; i < childs; i++) {
            try {
                trdays.deleteCell(0);
            } catch (e) { }
        }
        //  --- --- название месяца
        document.getElementById('month').innerHTML = "";
        //  --- --- год
        document.getElementById('year').innerHTML = "";

        //  --- добавляем
        //  --- --- год
        document.getElementById('year').innerHTML = year;
        //  --- --- название месяца
        var td = document.getElementById('calendar-row-buttons').getElementsByTagName('td')[0];
        td.setAttribute('colspan', days + 1);
        document.getElementById('month').innerHTML = monthName;
        document.getElementById('month').value = monthName;
        //  --- --- дни месяца
        for (let i = 0; i <= days; i++) {
            var th = document.createElement('th');
            if (i == 0) {
                th.classList.add('blank-cell');
            } else {
                let day = utils.overlay(i, '0', 2),
                    date = year + '-' + utils.overlay(month, '0', 2) + '-' + day;
                th.setAttribute('id', 'D' + date)
                th.appendChild(document.createTextNode(i));
            }
            trdays.appendChild(th);
        }
        // thead end

        //  tbody begin
        var tbody = document.querySelector('#calendar > tbody');
        for (let i = 0; i < gl.rooms.length; i++) {
            var room = gl.rooms[i].room,
                tr = document.createElement('tr');
            tr.setAttribute('id', 'R' + room);
            for (let j = 0; j < days + 1; j++) {
                var node;
                if (0 == j) {
                    node = document.createElement('th');
                    node.appendChild(document.createTextNode(room));
                } else {
                    let day = utils.overlay(j, '0', 2),
                        date = year + '-' + utils.overlay(month, '0', 2) + '-' + day;
                    node = document.createElement('td');
                    node.setAttribute('id', 'RD' + room + '_' + date);
                    node.appendChild(document.createTextNode(""));
                }
                tr.appendChild(node);
            }
            tbody.append(tr);
        }
        // tbody end
    },

    isEmptyBook: function (room) {
        return !document.querySelector('#\\' + room + '-book tbody').childElementCount;
    }
}

const db = {

    initialize: function () {
        $.ajax({
            url: '../db/init.php',
            dataType: 'json',
            success: function (data) {
                if (!data.status) {
                    console.log(data.msg);
                    var redirectDialog = new RedirectDialog();
                    redirectDialog.bind();
                    redirectDialog.show();
                } else {
                    data.data.sort(function (a, b) {
                        if (a.id > b.id) {
                            return 1;
                        } else if (a.id < b.id) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    document.getElementById('year').innerHTML = data.year;
                    gl.rooms = data.rooms;

                    tables.create(data.year, data.month);
                    guest.add(data.year, data.month, data.data);
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },

    us001: {

        select: function () {

        }
    },

    cf001: {

        select: function () {
            $.ajax({
                url: '../db/cf001/select.php',
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        update: function () {
            $.ajax({
                url: '../db/cf001/modify.php',
                data: {
                    year: document.getElementById('year').innerHTML,
                    month: utils.getMonthId(document.getElementById('month').innerHTML),
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        insert: function () {

        }
    },

    rm001: {

        select: function () {
            $.ajax({
                url: '../db/rm001/select.php',
                data: {},
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        gl.rooms = data;
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    },

    gl001: {

        insert: function (opts) {
            $.ajax({
                url: '../db/gl001/insert.php',
                data: {
                    year: document.getElementById('year').innerHTML,
                    month: utils.getMonthId(document.getElementById('month').innerHTML),
                    dayin: opts.dayin,
                    dayout: opts.dayout,
                    room: opts.room,
                    price: opts.price,
                    paid: opts.paid,
                    name: opts.name,
                    tel: opts.tel,
                    fn: opts.fn,
                    city: opts.city
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        guest.add(data.year, data.month, data.data);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        select: function () {
            $.ajax({
                url: '../db/gl001/select.php',
                data: {
                    year: document.getElementById('year').innerHTML,
                    month: utils.getMonthId(document.getElementById('month').innerHTML),
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        data.data.sort(function (a, b) {
                            if (a.id > b.id) {
                                return 1;
                            } else if (a.id < b.id) {
                                return -1;
                            } else {
                                return 0;
                            }
                        });
                        tables.create(data.year, data.month);
                        guest.add(data.year, data.month, data.data);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        modify: function (opts) {
            $.ajax({
                url: '../db/gl001/modify.php',
                data: {
                    year: document.getElementById('year').innerHTML,
                    month: utils.getMonthId(document.getElementById('month').innerHTML),
                    id: opts.id,
                    dayin: opts.dayin,
                    dayout: opts.dayout,
                    room: opts.room,
                    price: opts.price,
                    paid: opts.paid,
                    name: opts.name,
                    tel: opts.tel,
                    fn: opts.fn,
                    city: opts.city
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        guest.upd(data.old, data.new);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        delete: function (opts) {
            $.ajax({
                url: '../db/gl001/delete.php',
                data: {
                    id: opts
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        guest.del(data.data);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    },

    lg001: {

        select: function () {

        }
    }
}

const utils = {

    overlay: function (val, char, len) {
        var overlayedVal = val + "";
        while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
        return overlayedVal;
    },

    getMonthName: function (id) {
        return gl.monthNames[parseInt(id)];
    },

    getMonthId: function (month) {
        return this.overlay(gl.monthNames.indexOf(month), '0', 2);
    },

    getDaysInMonth: function (m, y) {
        m--;
        var isLeap = ((y % 4) == 0 && ((y % 100) != 0 || (y % 400) == 0));
        return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
    },

    getKeyValue: function (data, index) {
        switch (index) {
            case 0:
                return data.id;
                break;
            case 1:
                return data.dayin.substring(8) + '.' + data.dayin.substring(5, 7);
                break;
            case 2:
                return data.dayout.substring(8) + '.' + data.dayout.substring(5, 7);
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
    },

    groupBy: function (list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            if (!map.has(key)) {
                map.set(key, [item]);
            } else {
                map.get(key).push(item);
            }
        });
        return map;
    }

}
class Calendar extends DataWrapper {

    bind(target) {

        var label, span, td, tr, tbody, thead, table; 

        //
        tr = document.createElement('tr');

        //
        span = document.createElement('span');
        span.setAttribute('id', 'button-month-left');
        span.classList.add('month-button');
        span.addEventListener('click', listeners.monthLeftClick);

        td = document.createElement('td');
        td.appendChild(span);

        tr.appendChild(td);

        //
        span = document.createElement('span'),
        span.setAttribute('id', 'button-pick-calendar');
        span.addEventListener('click', listeners.pickCalendarClick);

        label = document.createElement('label');
        label.setAttribute('id', 'month');
        span.appendChild(label);

        label = document.createElement('label');
        label.setAttribute('id', 'year');
        span.appendChild(label);

        td = document.createElement('td');
        td.appendChild(span);

        tr.appendChild(td);

        //
        span = document.createElement('span');
        span.setAttribute('id', 'button-month-right');
        span.classList.add('month-button');
        span.addEventListener('click', listeners.monthRightClick);

        td = document.createElement('td');
        td.appendChild(span);

        tr.appendChild(td);

        //
        tbody = document.createElement('tbody');
        tbody.appendChild(tr);

        //
        table = document.createElement('table');
        table.appendChild(tbody);

        //
        td = document.createElement('td');
        td.appendChild(table);

        //
        tr = document.createElement('tr');
        tr.setAttribute('id', 'calendar-row-buttons');
        tr.appendChild(td);

        //
        thead = document.createElement('thead');
        thead.appendChild(tr);

        //
        tr = document.createElement('tr');
        tr.setAttribute('id', 'calendar-row-days');

        thead.appendChild(tr);
        
        //
        table = document.createElement('table');
        table.setAttribute('id', 'calendar');
        table.classList.add('my-table');
        table.appendChild(thead);

        //
        tbody = document.createElement('tbody');

        table.appendChild(tbody);

        target.appendChild(table);

        listeners.delegateWithExclude('#calendar > tbody', 'mousedown', 'td', 'tr', (/^R\d+-book$/g), listeners.calendarTDs.mousedown);
        listeners.delegateWithExclude('#calendar > tbody', 'mouseover', 'td', 'tr', (/^R\d+-book$/g), listeners.calendarTDs.mouseover);
        listeners.delegateWithExclude('#calendar > tbody', 'mouseout',  'td', 'tr', (/^R\d+-book$/g), listeners.calendarTDs.mouseout);
        listeners.delegateWithExclude('#calendar > tbody', 'mouseup',   'td', 'tr', (/^R\d+-book$/g), listeners.calendarTDs.mouseup);
        
        listeners.delegate('#calendar > tbody', 'mouseup', 'tr > th', listeners.calendarTHs.mousedown);
        
        listeners.delegate('#calendar > tbody', 'mousedown', '.book > tbody > tr', listeners.bookTRs.mousedown);
        listeners.delegate('#calendar > tbody', 'mouseover', '.book > tbody > tr', listeners.bookTRs.mouseover);
        listeners.delegate('#calendar > tbody', 'mouseout', '.book > tbody > tr', listeners.bookTRs.mouseout);
    }

    init() {
        db.initialize();
    }    
}