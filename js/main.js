'use strict';

const globals = {
    bookColumns: 9,
    rooms: [],
    guestsProcessing: [],
    monthNames: ["", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    class_selected: "selected", //выделен
    class_reserved: "reserved", //зарезервирован
    class_adjacent: "adjacent", //смежный
    class_redeemed: "redeemed", //выкупленный
    class_view: "view", //предпросмотр
    class_viewfix: "view-fix", // выделен
    intent_add: 1,
    intent_edit: 0,
    intent_del: -1
}

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

                    var td = $('#calendar tbody tr#' + wa.room + ' td#' + wa.room + '_' + tmpda.format('yyyy-mm-dd'));

                    //
                    td.text('');

                    // добавляем класс
                    if (td.hasClass(globals.class_redeemed) || td.hasClass(globals.class_reserved)) {
                        td.removeClass(globals.class_redeemed);
                        td.removeClass(globals.class_reserved);
                        td.addClass(globals.class_adjacent);
                    } else {
                        td.removeClass(globals.class_selected);
                        if (tmpda < curda) {
                            td.addClass(globals.class_redeemed);
                        } else {
                            td.addClass(globals.class_reserved);
                        }
                    }
                    td.addClass('N' + wa.id);

                    // добавляем подсказку  
                    var div = td.children('div'),
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
            var hiddenRow = $('#' + wa.room + '-book');
            if (hiddenRow.length == 0) {
                hiddenRow = document.createElement('tr');
                hiddenRow.setAttribute('id', wa.room + '-book');
                hiddenRow.classList.add('hidden');
                var td = document.createElement('td'),
                    days = new Date(year, month, 0).getDate();
                td.setAttribute('colspan', days + 1);
                var table = document.createElement('table');
                table.classList.add('book');
                table.appendChild(document.createElement('tbody'));
                td.appendChild(table);
                hiddenRow.appendChild(td);
                $('#calendar tbody tr#' + wa.room).after(hiddenRow);
                hiddenRow = $('#' + wa.room + '-book');
            }

            var rTable = $('table', hiddenRow),
                rBody = $('tbody', rTable),
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
            td.setAttribute('class', 'person-info');
            td.appendChild(document.createTextNode(wa.info));
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
            rBody[0].appendChild(rTR);
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
                    td = $('#calendar tbody tr#' + room + ' td#' + room + '_' + date);
                td.removeClass('N' + wa.id);
                td.removeClass('N' + wa.id + '-' + globals.class_viewfix);
                td.removeClass('N' + wa.id + '-' + globals.class_view);
                if (td.hasClass(globals.class_adjacent)) {
                    td.removeClass(globals.class_adjacent);
                    if (begda < curda) {
                        td.addClass(globals.class_redeemed);
                    } else {
                        td.addClass(globals.class_reserved);
                    }
                } else {
                    td.removeClass(globals.class_redeemed);
                    td.removeClass(globals.class_reserved);
                }
                td.children('div').remove();
                begda.setDate(begda.getDate() + 1);
            }
            // calendar end

            // book begin
            $('.book > tbody > tr#N' + wa.id).remove();
            if (tables.isEmptyBook(wa.room)) {
                $('#calendar > tbody > tr#' + wa.room + '-book').remove();
            }
            // book end
        }
    },

    upd: function (oldData, newData) {

        this.del(oldData);
        var year = $('#year').val(),
            monthName = $('#month').val(),
            month = globals.monthNames.indexOf(monthName);
        this.add(year, month, newData)

        // book sort begin
        var tr = $('#' + newData[0].room + '-book > td > .book > tbody > tr'),
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

        var prevRow = $('#' + newData[0].room + '-book tr#N' + pos[0].id);
        for (let i = 0; i < (pos.length - 1); i++) {
            if (pos[i].pos > pos[i + 1].pos) {
                var curRow = $('#' + newData[0].room + '-book tr#N' + pos[i].id),
                    nextRow = $('#' + newData[0].room + '-book tr#N' + pos[i + 1].id);
                curRow.insertBefore(nextRow);
            }
            prevRow = $('#' + newData[0].room + '-book tbody tr#N' + pos[i].id);
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
        $('#calendar > tbody').empty();
                // дни месяца
        var trdays = document.getElementById('calendar-row-days'),
            childs = trdays.children.length;
        for (let i = 0; i < childs; i++) {
            try {
                trdays.deleteCell(0);
            } catch (e) {}
        }
        //  --- --- название месяца
        document.getElementById('month').innerHTML = "";
        document.getElementById('month').value = "";
        //  --- --- год
        document.getElementById('year').innerHTML = "";
        document.getElementById('year').value = "";

        //  --- добавляем
        //  --- --- год
        document.getElementById('year').innerHTML = year;
        document.getElementById('year').value = year;
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
                date = year + '-' + utils.overlay(month,'0', 2) + '-' + day;
                th.setAttribute('id', date)
                th.appendChild(document.createTextNode(i));
            }
            trdays.appendChild(th);
        }
        // thead end

        //  tbody begin
        var tbody = $('#calendar > tbody');
        for (let i = 0; i < globals.rooms.length; i++) {
            var room = globals.rooms[i].room,
                tr = document.createElement('tr');
            tr.setAttribute('id', room);
            for (let j = 0; j < days + 1; j++) {
                var node;
                if (0 == j) {
                    node = document.createElement('th');
                    node.appendChild(document.createTextNode(room));
                } else {
                    let day = utils.overlay(j, '0', 2),
                        date = year + '-' + utils.overlay(month,'0', 2) + '-' + day;
                    node = document.createElement('td');
                    node.setAttribute('id', room + '_' + date);
                    node.appendChild(document.createTextNode(""));
                }
                tr.appendChild(node);
            }
            tbody.append(tr);
        }
        // tbody end
    },

    isEmptyBook: function (room) {
        return !$('#' + room + '-book tbody').children().length;
    }
}

const utils = {

    overlay: function (val, char, len) {
        var overlayedVal = val + "";
        while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
        return overlayedVal;
    },

    getMonthName: function (id) {
        return globals.monthNames[parseInt(id)];
    },

    getMonthId: function (month) {
        return this.overlay(globals.monthNames.indexOf(month), '0', 2);
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

$('#button-pick-calendar').click(function () {
    var pickCalendar = new PickCalendar({
        buttons: {
            ok: function () {
                var res = pickCalendar.getVal();
                if (res.year < 1900) {
                    return;
                }

                if ($('#year').val() == res.year) {
                    if ($('#month').val() == res.monthName) {
                        pickCalendar.unbind();
                        return;
                    }
                }

                pickCalendar.unbind();

                $('#month').innerHTML = res.monthName;
                $('#month').val(res.monthName);
                $('#year').innerHTML = res.year;
                $('#year').val(res.year);
                db.gl001.select();
                db.cf001.update();
            },
            no: function () {
                pickCalendar.unbind();
            }
        }
    });
    pickCalendar.bind();
    var month = globals.monthNames.indexOf($('#month').val());
    pickCalendar.setVal({
        year: $('#year').val(),
        month: utils.overlay(month, '0', 2)
    });
    pickCalendar.show();
});

$('#button-month-left').click(function () {
    var month = globals.monthNames.indexOf($('#month').val());
    if (month > 1) {
        month--;
    } else {
        month = 12;
    }
    var month = globals.monthNames[month];
    $('#month').innerHTML = month;
    $('#month').val(month);
    db.gl001.select();
});

$('#button-month-right').click(function () {
    var month = globals.monthNames.indexOf($('#month').val());
    if (month > 11) {
        month = 1;
    } else {
        month++;
    }
    var month = globals.monthNames[month];
    $('#month').innerHTML = month;
    $('#month').val(month);
    db.gl001.select();
});

var addGuest = function (e) {
    //  чистим список на добавление перед добавлением новых записей
    globals.guestsProcessing = [];

    var val = {
        intent: globals.intent_add,
        id: -1,
        dayin: this.dayin,
        dayout: this.dayout,
        room: this.room,
        price: "",
        paid: "",
        name: "",
        tel: "",
        info: ""
    };

    var inOutDialog = new InOutDialog({
        source: document,
        flag: globals.intent_add,
        buttons: {
            btnOk: function () {
                val = inOutDialog.getVal();
                db.gl001.insert(val);
                inOutDialog.unbind();
            },
            btnNo: function () {
                inOutDialog.unbind();
            }
        }
    });
    inOutDialog.bind();
    inOutDialog.setVal(val);
    inOutDialog.show();
}

var editGuest = function (e) {

    //  чистим список на редактирование перед добавлением новых записей
    var guest = $('.book tbody tr#' + this.id[0]);

    var val = {
        intent: globals.intent_edit,
        id: $('.person-id', guest).html(),
        dayin: ($('.person-dayin', guest).html()).substring(3),
        dayout: ($('.person-dayout', guest).html()).substring(3),
        room: $('.person-room-num', guest).html(),
        price: $('.person-room-price', guest).html(),
        paid: $('.person-room-paid', guest).html(),
        name: $('.person-name', guest).html(),
        tel: $('.person-tel', guest).html(),
        info: $('.person-info', guest).html()
    }

    var inOutDialog = new InOutDialog({
        source: document,
        flag: globals.intent_edit,
        buttons: {
            btnOk: function () {
                db.gl001.modify(inOutDialog.getVal());
                inOutDialog.unbind();
            },
            btnNo: function () {
                inOutDialog.unbind();
            }
        }
    });
    inOutDialog.bind();
    inOutDialog.setVal(val);
    inOutDialog.show();
}

var delGuest = function (e) {

    var intentList = [];
    intentList.push((this.id[0]).substring(1));

    if (intentList.length != 0) {
        var confirmDialog = new ConfirmDialog({
            source: document,
            flag: globals.intent_del,
            dialog: {
                title: 'Удаление',
                body: 'Удалить запись под номером №' + intentList[0] + ' из гостевой книги?\r\nДействие нельзя будет отменить!'
            },
            buttons: {
                btnOk: function () {
                    db.gl001.delete(intentList[0]);
                    confirmDialog.unbind();
                },
                btnNo: function () {
                    confirmDialog.unbind();
                }
            }
        });
        confirmDialog.bind();
        confirmDialog.show();
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
                    $('#year').val(data.year);
                    globals.rooms = data.rooms;
                    
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
                    if (data.status == 'error') {
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
                    year: $('#year').val(),
                    month: utils.getMonthId($('#month').val()),
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
                        globals.rooms = data;
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
                    year: $('#year').val(),
                    month: utils.getMonthId($('#month').val()),
                    dayin: opts.dayin,
                    dayout: opts.dayout,
                    room: opts.room,
                    price: opts.price,
                    paid: opts.paid,
                    name: opts.name,
                    tel: opts.tel,
                    info: opts.info,
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
                    year: $('#year').val(),
                    month: utils.getMonthId($('#month').val()),
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
                    year: $('#year').val(),
                    month: utils.getMonthId($('#month').val()),
                    id: opts.id,
                    dayin: opts.dayin,
                    dayout: opts.dayout,
                    room: opts.room,
                    price: opts.price,
                    paid: opts.paid,
                    name: opts.name,
                    tel: opts.tel,
                    info: opts.info
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