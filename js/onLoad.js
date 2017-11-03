'use strict';
window.onload = function onload() {

    var createCalendarTable = function () {
        deleteCalendarTableHead();
        createCalendarTableHead();
        createCalendarTableBody();
    };

    $('#month-button-left').click(function () {
        if (month > 1) {
            month--;
        } else {
            month = 12;
        }

        createCalendarTable();
    });

    $('#month-button-right').click(function () {
        if (month > 11) {
            month = 1;
        } else {
            month++;
        }

        createCalendarTable();
    });

    createCalendarTable();

    /* Input year dialog begin */
    $('#year-button-pick').click(function () {
        $.bs.popup.prompt({
            title: 'Новая выборка',
            info: 'Год выборки',
            width: '220px',
            value: year
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
                year = value;
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
    document.getElementById('year').textContent = year;
};
