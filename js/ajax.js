var ajax = {

    insert: function (opts) {
        $.ajax({
            url: './php/db_api/db-insert.php',
            data: {
                year: globals.year,
                month: globals.month,
                dayin: globals.newGuest[0].dayin,
                dayout: globals.newGuest[0].dayout,
                room: globals.newGuest[0].room,
                price: globals.newGuest[0].price,
                paid: globals.newGuest[0].paid,
                name: globals.newGuest[0].name,
                tel: globals.newGuest[0].tel,
                info: globals.newGuest[0].info
            },
            /*"year=" + encodeURIComponent(year) + "&month=" + month*/
            dataType: 'json',
            success: function (data) {
                globals.newGuest[0].id = data.id;
                guestsList.addGuest();
                calendar.coloringCalendar(globals.newGuest);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },

    select: function () {
        $.ajax({
            url: './php/db_api/db-select.php',
            data: {
                year: globals.year,
                month: globals.month
            },
            /*"year=" + encodeURIComponent(year) + "&month=" + month*/
            dataType: 'json',
            success: function (data) {
                calendar.resetCalendarColors();
                globals.guestsList = data.data;
                guestsList.createGuestListTableBody();
                calendar.coloringCalendar(globals.guestsList);
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log(xhr);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    },

    update: function (opts) {
        console.log(opts.id);
    },

    delete: function (opts) {
        console.log(opts.id);
    }

};
