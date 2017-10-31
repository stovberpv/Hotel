var createTable = (function (obj) {
    obj.deleteRowDays();
    obj.createRowDays();
    obj.createRowsByRooms();
    obj.coloringSelectedDay();
});

window.onload = function onload() {
    'use strict';
    const calendar = new Calendar();

    calendar.createMonthSelection();
    calendar.updateYear();
    calendar.updateMonth();
    createTable(calendar);

    var clickListener_changeMonth = (function () {
        calendar.parseYear();
        calendar.parseMonth();
        createTable(calendar);
    });

    document.getElementById('selectMonth').addEventListener('change', clickListener_changeMonth);
};
