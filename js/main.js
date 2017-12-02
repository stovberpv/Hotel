'use strict';

//---------------------------------------------------------------------
//  GLOBALS BEGIN
//---------------------------------------------------------------------
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
//---------------------------------------------------------------------
//  GLOBALS END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  NEW
//---------------------------------------------------------------------
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
            var rTable = document.getElementById('book'),
                rBody = rTable.getElementsByTagName('tbody'),
                tr, rTR, td, a;
            //------------------------------------------------------------

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
                if (td.attr('class') == globals.class_adjacent) {
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
            $('#book tbody tr#N' + wa.id).remove();
            // book end
        }
    },

    upd: function (oldData, newData) {

        this.del(oldData);
        var year = $('#year')[0].innerHTML,
            monthName = $('#month')[0].innerHTML,
            month = globals.monthNames.indexOf(monthName);
        this.add(year, month, newData)

        // book sort begin
        var tr = $('#book > tbody > tr'), pos = [];
        for (let i = 0; i < tr.length; i++) {
            pos.push({ id: parseInt(tr[i].children[0].innerHTML, 10), pos: i });
        }

        pos.sort(function (a, b) {
            return a.id - b.id;
        });

        var prevRow = $('#book tbody tr#N' + pos[0].id);
        for (let i = 0; i < (pos.length - 1); i ++) {
            if (pos[i].pos > pos[i + 1].pos) {
                var curRow = $('#book tbody tr#N' + pos[i].id),
                    nextRow = $('#book tbody tr#N' + pos[i + 1].id);
                curRow.insertBefore(nextRow);
            }
            prevRow = $('#book tbody tr#N' + pos[i].id);
        }
        // book sort end
    }
}

const tables = {

    create: function (year, month) {

        var monthName = globals.monthNames[month],
            days = new Date(year, month, 0).getDate();

        // thead begin
        $('#calendar thead').empty();
        var thead = document.getElementById('calendar').getElementsByTagName('thead')[0];

        // название месяца
        var th = document.createElement('th');
        th.setAttribute('colspan', days + 1);
        th.setAttribute('id', 'month');
        th.appendChild(document.createTextNode(monthName));
        var tr = document.createElement('tr')
        tr.appendChild(th);
        thead.appendChild(tr);

        // дни месяца
        tr = document.createElement('tr');
        for (let i = 0; i <= days; i++) {
            th = document.createElement('th');
            if (0 == i) {
                th.appendChild(document.createTextNode(""));
            } else {
                let day = utils.overlay(i, '0', 2),
                    date = year + '-' + month + '-' + day;
                th.setAttribute('id', date)
                th.appendChild(document.createTextNode(i));
            }
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        // thead end

        //  tbody begin
        $('#calendar tbody').empty();
        var tbody = document.getElementById('calendar').getElementsByTagName('tbody')[0];
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
                        date = year + '-' + month + '-' + day;
                    node = document.createElement('td');
                    node.setAttribute('id', room + '_' + date);
                    node.appendChild(document.createTextNode(""));
                }
                tr.appendChild(node);
            }
            tbody.appendChild(tr);
        }
        // tbody end

        $('#book tbody').empty();

    },

    reset: function () {
        $('#calendar thead').empty();
        $('#calendar tbody').empty();
        $('#book tbody').empty();
    }
}
//---------------------------------------------------------------------
//  NEW
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  UTILS BEGIN
//---------------------------------------------------------------------
const utils = {

    overlay: function (val, char, len) {
        var overlayedVal = val + "";
        while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
        return overlayedVal;
    },

    getDaysInMonth: function (m, y) {
        m--;
        var isLeap = ((y % 4) == 0 && ((y % 100) != 0 || (y % 400) == 0));
        return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
        // return m === 2 ? y & 3 || !(y % 25) && y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1);
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
//---------------------------------------------------------------------
//  UTILS END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  CLICK LISTENERS BEGIN
//---------------------------------------------------------------------
$('#year').click(function () {
    var inputDialog = new InputDialog({
        source: document,
        flag: 0,
        dialog: {
            title: 'Укажите год выборки',
        },
        buttons: {
            btnOk: function () {
                let val = inputDialog.getVal(),
                    beg = 1900,
                    end = 9999;
                if (val.year >= beg && val.year <= end) {
                    $('#year')[0].innerHTML = val.year;
                    db.gl001.select();
                    inputDialog.unbind();
                } else {
                    infoMsg = 'Некорректный ввод!';
                    inputDialog.unbind();
                }
            },
            btnNo: function () {
                inputDialog.unbind();
            }
        }
    });
    inputDialog.bind();
    inputDialog.show();
});

$('#month-left').click(function () {
    var month = globals.monthNames.indexOf($('#month')[0].innerHTML);
    if (month > 1) {
        month--;
    } else {
        month = 12;
    }
    $('#month')[0].innerHTML = globals.monthNames[month];
    db.gl001.select();
});

$('#month-right').click(function () {
    var month = globals.monthNames.indexOf($('#month')[0].innerHTML);
    if (month > 11) {
        month = 1;
    } else {
        month++;
    }
    $('#month')[0].innerHTML = globals.monthNames[month];
    db.gl001.select();
});

$("#addGuest").on("click", function (e) {
    //  чистим список на добавление перед добавлением новых записей
    globals.guestsProcessing = [];

    // выбираем все выделенные ячейки в таблице Календарь
    var selected = [];
    $('#calendar tbody tr td.' + globals.class_selected).each(function () {
        selected.push({
            room: $(this)[0].id.substring(0, 2),
            day: $(this)[0].cellIndex
        });
    });

    // группировка по комнате
    var grouped = utils.groupBy(selected, sel => sel.room);

    // формируем итоговый список
    grouped.forEach(group => {
        var room = group[0].room,
            begda = 999,
            endda = 0;

        group.forEach(entry => {
            if (endda != 0 && (endda + 1) != entry.day) {
                globals.guestsProcessing.push({
                    intent: globals.intent_add,
                    id: -1,
                    dayin: begda,
                    dayout: endda,
                    room: room,
                    price: "",
                    paid: "",
                    name: "",
                    tel: "",
                    info: ""
                });
                begda = entry.day;
                endda = entry.day;
            }

            if (begda > entry.day) {
                begda = entry.day;
            }
            if (endda < entry.day) {
                endda = entry.day;
            }
        });
        globals.guestsProcessing.push({
            intent: globals.intent_add,
            id: -1,
            dayin: begda,
            dayout: endda,
            room: room,
            price: "",
            paid: "",
            name: "",
            tel: "",
            info: ""
        });
    });

    let val = globals.guestsProcessing[0] ? globals.guestsProcessing[0] : [];
    if (val.length != 0) {
        globals.guestsProcessing.splice(0, 1);
    }

    var inOutDialog = new InOutDialog({
        source: document,
        flag: globals.intent_add,
        buttons: {
            btnOk: function () {
                val = inOutDialog.getVal();
                db.gl001.insert(val);
                inOutDialog.unbind();

                if (globals.guestsProcessing.length != 0) {
                    inOutDialog.bind();
                    inOutDialog.setVal(globals.guestsProcessing[0]);
                    globals.guestsProcessing.splice(0, 1);
                    inOutDialog.show();
                }

            },
            btnNo: function () {
                inOutDialog.unbind();
            }
        }
    });
    inOutDialog.bind();
    inOutDialog.setVal(val);
    inOutDialog.show();

});

$('#editGuest').on('click', function (e) {

    //  чистим список на редактирование перед добавлением новых записей
    globals.guestsProcessing = [];

    $('#book tbody tr.' + globals.class_viewfix).each(function () {

        globals.guestsProcessing.push({
            intent: globals.intent_edit,
            id: $('.person-id', $(this)).html(),
            dayin: ($('.person-dayin', $(this)).html()).substring(3),
            dayout: ($('.person-dayout', $(this)).html()).substring(3),
            room: $('.person-room-num', $(this)).html(),
            price: $('.person-room-price', $(this)).html(),
            paid: $('.person-room-paid', $(this)).html(),
            name: $('.person-name', $(this)).html(),
            tel: $('.person-tel', $(this)).html(),
            info: $('.person-info', $(this)).html()
        });
    });
    // ициализируем поля диалога

    let val = globals.guestsProcessing[0] ? globals.guestsProcessing[0] : [];
    if (val.length != 0) {
        globals.guestsProcessing.splice(0, 1);

        var inOutDialog = new InOutDialog({
            source: document,
            flag: globals.intent_edit,
            buttons: {
                btnOk: function () {
                    val = inOutDialog.getVal();
                    db.gl001.modify(val);
                    inOutDialog.unbind();

                    if (globals.guestsProcessing.length != 0) {
                        inOutDialog.bind();
                        inOutDialog.setVal(globals.guestsProcessing[0]);
                        globals.guestsProcessing.splice(0, 1);
                        inOutDialog.show();
                    }
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
});

$("#delGuest").on("click", function (e) {

    var intentList = [];

    $('#book tbody tr.' + globals.class_viewfix).each(function () {
        intentList.push($(this).children('td')[0].innerHTML);
    });

    if (intentList.length != 0) {
        var confirmDialog = new ConfirmDialog({
            source: document,
            flag: globals.intent_del,
            dialog: {
                title: 'Удаление записи',
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

});
//---------------------------------------------------------------------
//  CLICK LISTENERS END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  DB BEGIN
//---------------------------------------------------------------------
const db = {

    initialize: function () {
        $.ajax({
            url: './php/db/init.php',
            /* 
            TODO: SESSION ID
            */
            data: {
                sessionId: 'root'
            },
            dataType: 'json',
            success: function (data) {
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
                globals.rooms = data.rooms;

                tables.create(data.year, data.month);
                guest.add(data.year, data.month, data.data);
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#ajax-msg").append(xhr.responseText);
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
                url: './php/db/cf001/select.php',
                /* 
                TODO: session id
                */
                data: {
                    sessionId: 'root'
                },
                dataType: 'json',
                success: function (data) {
                    // utils.setYear(data['year']);
                    // utils.setMonth(data['month']);
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#ajax-msg").append(xhr.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        update: function () {

        },

        insert: function () {

        }
    },

    rm001: {

        select: function () {
            $.ajax({
                url: './php/db/rm001/select.php',
                data: {},
                dataType: 'json',
                success: function (data) {
                    globals.rooms = data;
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#ajax-msg").append(xhr.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    },

    gl001: {

        insert: function (opts) {
            $.ajax({
                url: './php/db/gl001/insert.php',
                data: {
                    year: $('#year')[0].innerHTML,
                    month: globals.monthNames.indexOf($('#month')[0].innerHTML),
                    dayin: opts.dayin,
                    dayout: opts.dayout,
                    room: opts.room,
                    price: opts.price,
                    paid: opts.paid,
                    name: opts.name,
                    tel: opts.tel,
                    info: opts.info,
                    /* 
                    TODO: sessionID    
                    */
                    sessionId: 'root'
                },
                dataType: 'json',
                success: function (data) {
                    guest.add(data.year, data.month, data.data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#ajax-msg").append(xhr.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        select: function () {
            $.ajax({
                url: './php/db/gl001/select.php',
                data: {
                    year: $('#year')[0].innerHTML,
                    month: globals.monthNames.indexOf($('#month')[0].innerHTML),
                },
                dataType: 'json',
                success: function (data) {
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
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#ajax-msg").append(xhr.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        modify: function (opts) {
            $.ajax({
                url: './php/db/gl001/modify.php',
                data: {
                    year: $('#year')[0].textContent,
                    month: globals.monthNames.indexOf($('#month')[0].textContent),
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
                    guest.upd(data.old, data.new);
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#ajax-msg").append(xhr.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        delete: function (opts) {
            $.ajax({
                url: './php/db/gl001/delete.php',
                data: {
                    id: opts
                },
                dataType: 'json',
                success: function (data) {
                    guest.del(data.data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#ajax-msg").append(xhr.responseText);
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
//---------------------------------------------------------------------
//  DB END
//---------------------------------------------------------------------