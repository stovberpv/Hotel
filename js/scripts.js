// 'use strict';

//---------------------------------------------------------------------
//  GLOBALS BEGIN
//---------------------------------------------------------------------
const globals = {
    year: "",
    month: "",
    guestsTableColumns: 9,
    rooms: [],
    newGuests: [],
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

    setYear: function (val) {
        globals.year = val;
        document.getElementById('year').textContent = globals.year;
    },

    setMonth: function (val) {
        globals.month = val;
        document.getElementById('month').value = globals.monthNames[val, 0];
    },

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
const clickListener_select = function (e) {
    if (e.currentTarget.hasAttribute('class')) {
        if (e.currentTarget.getAttribute('class') === globals.class_selected) {
            e.currentTarget.removeAttribute('class');
        } else {
            // do nothing!
        }
    } else {
        e.currentTarget.setAttribute('class', globals.class_selected);
    }
}

$('#year-button-pick').click(function () {
    $.bs.popup.prompt({
        title: 'Новая выборка',
        info: 'Год выборки',
        width: '220px',
        value: globals.year
    }, function (dialogE, value) {
        var infoMsg = "",
            beg = 1900,
            end = 9999;

        if (value >= beg && value <= end) {
            infoMsg = 'Идет выборка данных за ' + value + ' год...';
        } else {
            infoMsg = 'Некорректный ввод!';
            value = new Date().getFullYear();
        }

        $.bs.popup.toast({
            title: 'Ожидайте',
            info: infoMsg
        }, function () {
            utils.setYear(value);
            db.gl001.select();
            dialogE.modal('hide');
        });
    });
});

$('#month-button-left').click(function () {
    var month = globals.monthNames.indexOf($('#month')[0].textContent);
    if (month > 1) {
        month--;
    } else {
        month = 12;
    }
    utils.setMonth(month);
    tableCalendar.reset();
    tableCalendar.addHead();
    tableCalendar.addBody();
    db.gl001.select();
});

$('#month-button-right').click(function () {
    var month = globals.monthNames.indexOf($('#month')[0].textContent);
    if (month > 11) {
        month = 1;
    } else {
        month++;
    }
    utils.setMonth(month);
    tableCalendar.reset();
    tableCalendar.addHead();
    tableCalendar.addBody();
    db.gl001.select();
});

$("#addGuest").on("click", function (e) {
    /* 
    FIX:
            когда-нибудь переделать весь этот вертолет
    */
    // выбираем все выделенные ячейки в таблице Календарь
    var selected = [];
    $('#calendar-table tbody tr td.' + globals.class_selected).each(function () {
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
                globals.newGuests.push({
                    room: room,
                    dayin: begda,
                    dayout: endda
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
        globals.newGuests.push({
            room: room,
            dayin: begda,
            dayout: endda
        });
    });

    var val;
    if (globals.newGuests.length != 0) {
        val = {
            id: -1,
            dayin: globals.newGuests[0].dayin,
            dayout: globals.newGuests[0].dayout,
            room: globals.newGuests[0].room,
            price: "",
            paid: "",
            name: "",
            tel: "",
            info: ""
        }
    }
    guestDialog.setVal(val);
    guestDialog.open();
});

$('#modGuest').on('click', function (e) {

    $('#guests-table tbody tr.' + globals.class_selected).each(function () {
        var fulldayin = $(this).children('td')[1].textContent,
            dayin = fulldayin.substring(8) + "." + fulldayin.substring(5, 7)
        fulldayout = $(this).children('td')[2].textContent,
            dayout = fulldayout.substring(8) + "." + fulldayout.substring(5, 7);

        var val = {
            id: $(this).children('td')[0].textContent,
            dayin: dayin,
            dayout: dayout,
            room: $(this).children('td')[3].textContent,
            price: $(this).children('td')[4].textContent,
            paid: $(this).children('td')[5].textContent,
            name: $(this).children('td')[6].textContent,
            tel: $(this).children('td')[7].textContent,
            info: $(this).children('td')[8].textContent
        }

        guestDialog.setVal(val);
        guestDialog.open();
    });
});

$("#delGuest").on("click", function (e) {
    $.bs.popup.confirm({
        title: 'Удаление записей',
        info: 'Вы уверены?'
    }, function (e) {
        $('#guests-table tbody tr.' + globals.class_selected).each(function () {
            var id = $(this).children('td')[0].textContent;
            db.gl001.delete(id);
        });
        e.modal('hide');
    });
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
const tableCalendar = {

    reset: function () {
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
            tr.id = globals.rooms[i].room;
            for (let j = 0; j < totalCells; j++) {
                var node;
                if (0 == j) {
                    node = document.createElement('th');
                    node.appendChild(document.createTextNode(globals.rooms[i].room));
                } else {
                    node = document.createElement('td');
                    node.id = globals.rooms[i].room + '-' + j;
                    node.addEventListener('click', clickListener_select);
                    node.appendChild(document.createTextNode(""));
                }
                tr.appendChild(node);
            }
            tbody.appendChild(tr);
        }
    },

    setRoomsStatus: function (delList, addList) {
        var tmp = globals.year + "-" + globals.month + "-" + utils.getDaysInMonth(globals.month, globals.year);

        var tbody = document.getElementById('calendar-table').getElementsByTagName('tbody')[0],
            firstDay = Date.parse(globals.year + "-" + globals.month + "-" + 1),
            lastDay = Date.parse(tmp),
            today = Date.parse(new Date()),
            oneDay = 86400000;

        //DELETE
        if (delList != null) {

            for (let guest = 0; guest < delList.length; guest++) {

                var dayin = Date.parse(delList[guest].dayin),
                    dayout = Date.parse(delList[guest].dayout),
                    room = delList[guest].room,
                    rows = tbody.children.length,
                    childRow = -1;

                for (let row = 0; row < rows; row++) {

                    if (tbody.children[row].textContent == room) {
                        childRow = row;
                        break;
                    }
                }

                if (childRow == -1) {
                    return;
                }

                while (dayin <= dayout) {

                    if (dayin >= firstDay && dayin <= lastDay) {
                        var date = new Date(dayin),
                            childCell = date.getDate(),
                            oldAttr = tbody.children[childRow].children[childCell].getAttribute('class'),
                            newAttr;

                        if (oldAttr == globals.class_adjacent) /*смежный*/ {
                            if (dayin < today) {
                                newAttr = globals.class_redeemed; /*выкупленный*/
                            } else if (dayin >= today) {
                                newAttr = globals.class_reserver; /*зарезервирован*/
                            }
                            tbody.children[childRow].children[childCell].setAttribute('class', newAttr);
                        } else {
                            tbody.children[childRow].children[childCell].removeAttribute('class');
                        }

                    }
                    dayin += oneDay;
                }
            }

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

        //ADD
        for (let guest = 0; guest < addList.length; guest++) {

            var dayin = Date.parse(addList[guest].dayin),
                dayout = Date.parse(addList[guest].dayout),
                room = addList[guest].room,
                rows = tbody.children.length,
                childRow = -1;

            for (let row = 0; row < rows; row++) {

                if (tbody.children[row].textContent == room) {
                    childRow = row;
                    break;
                }
            }

            if (childRow == -1) {
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

    removeSelection(row, aCell, bCell) {
        $('#calendar-table tbody tr#' + row + ' td.' + globals.class_selected).each(function () {
            var day = $(this)[0].id.substring(3);
            if (day >= aCell && day <= bCell) {
                $(this).removeClass(globals.class_selected);
            }
        });
    }
}
//---------------------------------------------------------------------
//  CALENDAR TABLE END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  GUESTS TABLE BEGIN
//---------------------------------------------------------------------
const tableGuests = {

    addGuest: function (data) {

        var tbody = document.getElementById('guests-table').getElementsByTagName('tbody')[0];

        for (let i = 0; i < data.length; i++) {
            var tr = document.createElement('tr');
            tr.addEventListener('click', clickListener_select);

            for (let j = 0; j < globals.guestsTableColumns; j++) {
                var td = document.createElement('td');
                td.appendChild(document.createTextNode(utils.getKeyValue(data[i], j)));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    },

    delGuest: function (id) {

        $('#guests-table > tbody > tr').each(function () {
            var curId = $(this).children('td')[0].textContent;
            if (curId == id) {
                $(this).remove();
            }
        });
    },

    modGuest: function (id, newVal) {

        var tbody = document.getElementById('guests-table').getElementsByTagName('tbody')[0];

        for (let i = 0; i < tbody.childElementCount; i++) {

            var child = tbody.children[i].getElementsByTagName('tr')[0],
                td = child.getElementsByTagName('td');

            if (td[0] == id) {
                td[1] = newVal.dayin;
                td[2] = newVal.dayout;
                td[3] = newVal.room;
                td[4] = newVal.price;
                td[5] = newVal.paid;
                td[6] = newVal.name;
                td[7] = newVal.tel;
                td[8] = newVal.info;
            }
        }
    },

    reset: function () {

        var tbody = document.getElementById('guests-table').getElementsByTagName('tbody')[0],
            tr = tbody.getElementsByTagName('tr');

        for (let i = tr.length; i > 0; i--) {
            tbody.removeChild(tr[0]);
        }
    }
}
//---------------------------------------------------------------------
//  GUESTS TABLE END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//   BEGIN
//---------------------------------------------------------------------
/* 
    TODO:
            update db table config
*/
//---------------------------------------------------------------------
//   END
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  DB BEGIN
//---------------------------------------------------------------------
const db = {

    initialize: function () {
        $.ajax({
            url: './php/db/init.php',
            /* 
            TODO:
                    SESSION ID
            */
            data: {
                sessionId: 'root'
            },
            dataType: 'json',
            success: function (data) {
                utils.setYear(data['year']);
                globals.month = data['month'];
                globals.rooms = data['rooms'];
                tableCalendar.reset();
                tableCalendar.addHead();
                tableCalendar.addBody();
                tableCalendar.setRoomsStatus([], data['guestList']);
                tableGuests.addGuest(data['guestList']);
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
                TODO:
                        session id
                */
                data: {
                    sessionId: 'root'
                },
                dataType: 'json',
                success: function (data) {
                    utils.setYear(data['year']);
                    utils.setMonth(data['month']);
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#ajax-msg").append(xhr.responseText);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
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
                    year: $('#year')[0].textContent,
                    month: globals.monthNames.indexOf($('#month')[0].textContent),
                    dayin: opts.dayin,
                    dayout: opts.dayout,
                    room: opts.room,
                    price: opts.price,
                    paid: opts.paid,
                    name: opts.name,
                    tel: opts.tel,
                    info: opts.info,
                    /* 
                    TODO:
                            sessionID    
                    */
                    sessionId: 'root'
                },
                dataType: 'json',
                success: function (data) {
                    tableGuests.addGuest(data);
                    tableCalendar.setRoomsStatus([], data);
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
                data: { /*"year=" + encodeURIComponent(year) + "&month=" + month*/
                    year: $('#year')[0].textContent,
                    month: globals.monthNames.indexOf($('#month')[0].textContent),
                },
                dataType: 'json',
                success: function (data) {
                    tableCalendar.reset();
                    tableGuests.reset();

                    tableCalendar.addHead();
                    tableCalendar.addBody();
                    tableCalendar.setRoomsStatus([], data.data);
                    tableGuests.addGuest(data.data);
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
                    tableGuests.modGuest(data.old.id, data.new);
                    tableCalendar.setRoomsStatus(data.old, data.new);
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
                    tableGuests.delGuest(data.id);
                    tableCalendar.setRoomsStatus(data.data, []);
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


//---------------------------------------------------------------------
//  GUEST DIALOG BEGIN
//---------------------------------------------------------------------
const guestDialog = {

    create: function () {

        /* 
        TODO:
                multi guest edit
        FIX:
                globals.newGuests -> globals.guestsProcessing
        */
        $("#dialog").dialog({
            dialogClass: "ui-dialog",
            autoOpen: false,
            modal: true,
            draggable: true,
            resizable: false,
            width: 'auto',
            height: 'auto',
            show: {
                effect: "drop",
                duration: 400
            },
            hide: {
                effect: "drop",
                duration: 400
            },
            buttons: [{
                id: "close",
                text: "Отменить",
                click: function (e) {
                    var val = guestDialog.getVal();
                    tableCalendar.removeSelection(val.room, val.dayin, val.dayout);
                    globals.newGuests.shift();
                    guestDialog.close();
                }
            }, {
                id: "save",
                text: "Сохранить",
                click: function (e) {
                    var val = guestDialog.getVal();
                    if (val.id == -1) {
                        db.gl001.insert(val);
                    } else {
                        db.gl001.modify(val);
                    }
                    guestDialog.close();

                    if (globals.newGuests.length != 0) {
                        val = {
                            id: -1,
                            dayin: globals.newGuests[0].dayin,
                            dayout: globals.newGuests[0].dayout,
                            room: globals.newGuests[0].room,
                            price: "",
                            paid: "",
                            name: "",
                            tel: "",
                            info: ""
                        }
                        guestDialog.setVal(val);
                        tableCalendar.removeSelection(val.room, val.dayin, val.dayout);
                        globals.newGuests.shift();
                        guestDialog.open();
                    }

                }
            }, ]
        });
    },

    open: function () {

        $("#dialog").dialog("open");
    },

    close: function () {

        $("#dialog").dialog("close");
    },

    getVal: function () {

        return {
            id: $("#id").val(),
            dayin: $("#dayin").val(),
            dayout: $("#dayout").val(),
            room: $("#room").val(),
            price: $("#price").val(),
            paid: $("#paid").val(),
            name: $("#name").val(),
            tel: $("#tel").val(),
            info: $("#info").val()
        }
    },

    setVal(opts) {

        if (opts == undefined) {
            $("#id").val("-1");
            $("#dayin").val("");
            $("#dayout").val("");
            $("#room").val("");
            $("#price").val("");
            $("#paid").val("");
            $("#name").val("");
            $("#tel").val("");
            $("#info").val("");
        } else {
            $("#id").val(opts.id);
            $("#dayin").val(opts.dayin);
            $("#dayout").val(opts.dayout);
            $("#room").val(opts.room);
            $("#price").val(opts.price);
            $("#paid").val(opts.paid);
            $("#name").val(opts.name);
            $("#tel").val(opts.tel);
            $("#info").val(opts.info);
        }
    }

}
//---------------------------------------------------------------------
//  GUEST DIALOG END
//---------------------------------------------------------------------