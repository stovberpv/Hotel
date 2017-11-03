var ajax = {

    insert: function (opts) {
        console.log(opts.id);
    },

    select: function () {
        $.ajax({
            url: './php/db_api/db-select.php',
            data: { year: year, month: month }, /*"year=" + encodeURIComponent(year) + "&month=" + month*/
            dataType: 'json',
            success: function (data) {
                guestsList = data.data;
                createGuestListTableBody();
                coloringSelectedDay();
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
