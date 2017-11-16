'use strict';
window.onload = function onload() {

    //-------------------------------------------------------------------------------------------------
        // VALUES DEFINITION BEGIN
    //-------------------------------------------------------------------------------------------------
    const createCalendarTable = function () {
        tableCalendar.reset();
        tableCalendar.addHead();
        tableCalendar.addBody();
    };
    //-------------------------------------------------------------------------------------------------
        // VALUES DEFINITION END
    //-------------------------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------------------------
        // CLICK LISTENERS BEGIN
    //-------------------------------------------------------------------------------------------------
    $('#month-button-left').click(function () {
        var month = globals.monthNames.indexOf($('#month')[0].textContent);
        if (month > 1) {
            month--;
        } else {
            month = 12;
        }
        utils.setMonth(month);
        createCalendarTable();
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
        createCalendarTable();
        db.gl001.select();
    });

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
    //-------------------------------------------------------------------------------------------------
        // CLICK LISTENERS END
    //-------------------------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------------------------
        // INITIALIZE BEGIN
    //-------------------------------------------------------------------------------------------------
    db.initialize();
    //-------------------------------------------------------------------------------------------------
        // INITIALIZE END
    //-------------------------------------------------------------------------------------------------
};
