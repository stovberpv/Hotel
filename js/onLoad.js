'use strict';
window.onload = function onload() {

    const createCalendarTable = function () {
        calendarTable.del();
        calendarTable.addHead();
        calendarTable.addBody();
    };

    $('#month-button-left').click(function () {
        //TODO set month from html element
        if (globals.month > 1) {
            globals.month--;
        } else {
            globals.month = 12;
        }
        utils.getGuestsList();
        createCalendarTable();
    });

    $('#month-button-right').click(function () {
        //TODO set month from html element
        if (globals.month > 11) {
            globals.month = 1;
        } else {
            globals.month++;
        }
        utils.getGuestsList();
        createCalendarTable();
    });

    $('#year-button-pick').click(function () {
        $.bs.popup.prompt({
            title: 'Новая выборка',
            info: 'Год выборки',
            width: '220px',
            value: globals.year
        }, function (dialogE, value) {
            var infoMsg = "";
            var beg = 1900, end = 9999;
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
                globals.year = value;
                utils.setYear(globals.year);
                utils.getGuestsList();
                dialogE.modal('hide');
            });
        });
    });

    //TODO initialize get and set year and month
    utils.initialize();
    //createCalendarTable();
    //document.getElementById('year').textContent = globals.year;
};
