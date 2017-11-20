'use strict';

//---------------------------------------------------------------------
//  GLOBALS BEGIN
//---------------------------------------------------------------------
const globals = {
    year: "",
    month: "",
    guestsTableColumns: 9,
    rooms: [],
    guestsProcessing: [],
    monthNames: ["", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    class_selected: "selected",
    class_reserver: "reserver",
    class_adjacent: "adjacent",
    class_redeemed: "redeemed",
    intent_add: 'add',
    intent_edit: 'edit',
    intent_del: 'del'
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
const clickListener_select = function (e) {
    $(this).toggleClass(globals.class_selected);
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
    //  чистим список на добавление перед добавлением новых записей
    globals.guestsProcessing = globals.guestsProcessing.filter(e => e.intent != globals.intent_add);

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

    // ициализируем поля диалога
    var initVal = globals.guestsProcessing.filter(e => e.intent == globals.intent_add);

    if (initVal.length != 0) {
        tableCalendar.removeSelection(initVal[0].room, initVal[0].dayin, initVal[0].dayout);
        globals.guestsProcessing.splice(globals.guestsProcessing.indexOf(initVal[0]), 1);
        guestDialog.setVal(initVal[0]);
        guestDialog.open(initVal[0].intent);
    } else {
        guestDialog.setVal();
        guestDialog.open(globals.intent_add);
    }

});

$('#editGuest').on('click', function (e) {

    //  чистим список на редактирование перед добавлением новых записей
    globals.guestsProcessing = globals.guestsProcessing.filter(e => e.intent != globals.intent_edit);

    $('#guests-table tbody tr.' + globals.class_selected).each(function () {
        var fulldayin = $(this).children('td')[1].textContent,
            fulldayout = $(this).children('td')[2].textContent;

        globals.guestsProcessing.push({
            intent: globals.intent_edit,
            id: $(this).children('td')[0].textContent,
            dayin: $(this).children('td')[1].textContent, //fulldayin.substring(8) + "." + fulldayin.substring(5, 7),
            dayout: $(this).children('td')[2].textContent, //fulldayout.substring(8) + "." + fulldayout.substring(5, 7),
            room: $(this).children('td')[3].textContent,
            price: $(this).children('td')[4].textContent,
            paid: $(this).children('td')[5].textContent,
            name: $(this).children('td')[6].textContent,
            tel: $(this).children('td')[7].textContent,
            info: $(this).children('td')[8].textContent
        });
    });

    // ициализируем поля диалога
    var initVal = globals.guestsProcessing.filter(e => e.intent == globals.intent_edit);

    if (initVal.length != 0) {
        tableGuests.removeSelection(initVal[0].id);
        globals.guestsProcessing.splice(globals.guestsProcessing.indexOf(initVal[0]), 1);
        guestDialog.setVal(initVal[0]);
        guestDialog.open(initVal[0].intent);
    }
});

$("#delGuest").on("click", function (e) {

    var intentList = [];

    $('#guests-table tbody tr.' + globals.class_selected).each(function () {
        intentList.push($(this).children('td')[0].textContent);
    });

    if (intentList.length != 0) {
        /* 
        FIX:
        Непонятно как вызывать окно вручную.
        Непонятно как передать функцию в кнопку отмены.
        Переделать на свою версию вызова
        Хотя с другой стороны в целях надежности и безопасности
        надо для каждого гостя в отдельности нажимать кнопку удалить
        */
        $.bs.popup.confirm({
            title: 'Удаление записей',
            info: 'Удалить запись гостя под номером "' + intentList[0] + '" из гостевой книги? <br> Это действие нельзя будет отменить!'
        }, function (e) {
            db.gl001.delete(intentList[0]);
            e.modal('hide');
        });
    }
});
//---------------------------------------------------------------------
//  CLICK LISTENERS END
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

                    if (tbody.children[row].id == room) {
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
        for (let i = 0; i < addList.length; i++) {

            var dayin = Date.parse(addList[i].dayin),
                dayout = Date.parse(addList[i].dayout),
                room = addList[i].room,
                rows = tbody.children.length,
                childRow = -1;

            for (let row = 0; row < rows; row++) {

                if (tbody.children[row].id == room) {
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

                    var td = tbody.children[childRow].children[childCell];
                    if (td.hasAttribute('class')) {
                        var cellClassName = td.getAttribute('class');
                        if (cellClassName != "" && cellClassName != globals.class_selected) {
                            newAttr = globals.class_adjacent; /*смежный*/
                        }
                    }

                    td.setAttribute('class', newAttr);

                    // добавление высплывающей подсказки при наведении на заняту комнату

                }
                dayin += oneDay;
            }
        }
    },

    setHint: function () {

        $('#calendar-table tbody tr td div').each(function () {
            $(this).remove();
        });

        var list = $('#guests-table tbody tr');
        for (let i = 0; i < list.length; i++) {
            var id = list[i].children[0].innerText,
                dayin = list[i].children[1].innerText,
                dayout = list[i].children[2].innerText,
                room = list[i].children[3].innerText,
                name = list[i].children[6].innerText,
                year = $('#year')[0].textContent,
                month = globals.monthNames.indexOf($('#month')[0].textContent),
                begda = new Date(year, (dayin.split('.')[1] - 1), dayin.split('.')[0]).getTime(),
                endda = new Date(year, (dayout.split('.')[1] - 1), dayout.split('.')[0]).getTime(),
                oneDay = 86400000;
            
            while (begda <= endda) {

                if (month == (new Date(begda).getMonth() + 1)) {
                    
                    var hintText = name + " (с " + dayin + " по " + dayout + ")",
                        td = $('#calendar-table tbody tr#' + room + ' td#' + room + '-' + (new Date(begda).getDate())),
                        div = td.children('div');
                    
                    if (div.length == 0) {
                        var span = document.createElement('span');
                        span.setAttribute('class', 'hintText');
                        span.id = id;
                        span.appendChild(document.createTextNode(hintText));

                        div = document.createElement('div');
                        div.setAttribute('class', 'hint');
                        div.appendChild(span);

                        td.append(div);
                    } else {
                        var oldId = div.children('span').attr('id');
                        div.children('span').attr('id', oldId + '/' + id);
                        div.children('span').append('<br>' + hintText);
                    }
                }
                    
                begda += oneDay;
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
            tr.setAttribute('id', data[i].id)
            tr.addEventListener('click', clickListener_select);

            for (let j = 0; j < globals.guestsTableColumns; j++) {
                var td = document.createElement('td');
                if (j == 6 || j == 8) {
                    td.setAttribute('class', 'alignLeft');
                } else if (j == 7) {
                    td.setAttribute('class', 'alignRight');
                }
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

    editGuest: function (id, newVal) {

        var row = $('#guests-table tbody tr')
            .filter(function () {
                return $(this).children()[0].textContent == id;
            });

        row[0].children[1].textContent = utils.getKeyValue(newVal, 1);
        row[0].children[2].textContent = utils.getKeyValue(newVal, 2);
        row[0].children[3].textContent = newVal.room;
        row[0].children[4].textContent = newVal.price;
        row[0].children[5].textContent = newVal.paid;
        row[0].children[6].textContent = newVal.name;
        row[0].children[7].textContent = newVal.tel;
        row[0].children[8].textContent = newVal.info;
    },

    reset: function () {

        var tbody = document.getElementById('guests-table').getElementsByTagName('tbody')[0],
            tr = tbody.getElementsByTagName('tr');

        for (let i = tr.length; i > 0; i--) {
            tbody.removeChild(tr[0]);
        }
    },

    removeSelection: function (id) {

        $('#guests-table tbody tr.' + globals.class_selected + ' td:first-child')
            .filter(function () {
                return $(this)[0].textContent == id;
            }).parent().toggleClass(globals.class_selected);
    }
}
//---------------------------------------------------------------------
//  GUESTS TABLE END
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
                data['guestList'].sort(function (a, b) {
                    if (a.id > b.id) {
                        return 1;
                    } else if (a.id < b.id) {
                        return -1;
                    } else {
                        return 0;
                    }
                });

                utils.setYear(data['year']);
                globals.month = data['month'];
                globals.rooms = data['rooms'];
                tableGuests.addGuest(data['guestList']);
                tableCalendar.reset();
                tableCalendar.addHead();
                tableCalendar.addBody();
                tableCalendar.setRoomsStatus([], data['guestList']);
                tableCalendar.setHint();
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

        /* 
        TODO:
                update db table config
        */
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
                    tableCalendar.setHint();
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
                    data.data.sort(function (a, b) {
                        if (a.id > b.id) {
                            return 1;
                        } else if (a.id < b.id) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    tableGuests.reset();
                    tableGuests.addGuest(data.data);
                    tableCalendar.reset();
                    tableCalendar.addHead();
                    tableCalendar.addBody();
                    tableCalendar.setRoomsStatus([], data.data);
                    tableCalendar.setHint();
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
                    tableGuests.editGuest(data['old'][0].id, data['new'][0]);
                    tableCalendar.setRoomsStatus(data['old'], data['new']);
                    tableCalendar.setHint();
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
                    tableCalendar.setHint();
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
        INFO:
        При отработке событий "Закрыть" и "Сохранить" - окно должно
        открываться снова для следующей записи в таблице 
        globals.guestsProcessing по тому же самому намерению, по 
        которому было открыто в прошлый раз. Тобишь, если окно было
        открыто через кнопку "Исправить" и в списке гостей было выбрано
        несколько строк то оно должно открыться для исправления
        следущей записи, а не для добавление нового гостя, если
        в это же самое время было выбрано несколько ячеек в календаре.
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
                    var intent = $("#dialog").data('intent');
                    var intentList = globals.guestsProcessing.filter(e => e.intent == intent);
                    if (intentList.length != 0) {
                        tableGuests.removeSelection(intentList[0].id);
                        tableCalendar.removeSelection(intentList[0].room, intentList[0].dayin, intentList[0].dayout);
                        globals.guestsProcessing.splice(globals.guestsProcessing.indexOf(intentList[0]), 1);
                    }
                    guestDialog.setVal();
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

                    var intent = $("#dialog").data('intent');
                    var intentList = globals.guestsProcessing.filter(e => e.intent == intent);
                    if (intentList.length != 0) {
                        guestDialog.setVal(intentList[0]);
                        tableGuests.removeSelection(intentList[0].id);
                        tableCalendar.removeSelection(intentList[0].room, intentList[0].dayin, intentList[0].dayout);
                        globals.guestsProcessing.splice(globals.guestsProcessing.indexOf(intentList[0]), 1);
                        guestDialog.open(intent);
                    }
                }
            }, ]
        });
    },

    open: function (intent) {

        $("#dialog").data('intent', intent);
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