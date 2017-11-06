'use strict';
window.onload = function onload() {

    var createCalendarTable = function () {
        calendar.deleteCalendarTableHead();
        calendar.createCalendarTableHead();
        calendar.createCalendarTableBody();
    };

    $('#month-button-left').click(function () {
        if (globals.month > 1) {
            globals.month--;
        } else {
            globals.month = 12;
        }
        ajax.select();
        createCalendarTable();
    });

    $('#month-button-right').click(function () {
        if (globals.month > 11) {
            globals.month = 1;
        } else {
            globals.month++;
        }
        ajax.select();
        createCalendarTable();
    });

    createCalendarTable();

    /* Input year dialog begin */
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
                calendar.setYear(globals.year);
                ajax.select();
                dialogE.modal('hide');
            });
        });
    });
    /* Input year dialog end */
/*
    $('#debug').click(function () {
        console.log("debug:" + guestsList.length);
    });
*/
    document.getElementById('year').textContent = globals.year;
    ajax.select();
};
