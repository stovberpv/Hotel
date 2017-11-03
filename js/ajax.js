var ajax = {

    insert: function (opts) {
        console.log(opts.id);
    },

    select: function () {
        $.ajax({
            url: './php/db_api.php',
            data: "year=" + year + "&month=" + month,
            dataType: 'json',
            success: function (data) {
                guests.addGuest() = [{dayin: 1, dayout: 2, room: 3, price: 4, paid: 5, name: 6, tel: 7, info: data }];
                console.log(data);
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
