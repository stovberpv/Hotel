const db = {

    cf001: {

        select: function () {
            $.ajax({
                url: '../db/cf001/select.php',
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        update: function () {
            $.ajax({
                url: '../db/cf001/modify.php',
                data: {
                    year: document.getElementById('year').innerHTML,
                    month: utils.getMonthId(document.getElementById('month').innerHTML),
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    },

    rm001: {

        select: function () {
            $.ajax({
                url: '../db/rm001/select.php',
                data: {},
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        gl.rooms = data;
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    },

    gl001: {

        insert: function (opts) {
            $.ajax({
                url: '../db/gl001/insert.php',
                data: {
                    year: document.getElementById('year').innerHTML,
                    month: utils.getMonthId(document.getElementById('month').innerHTML),
                    dayin: opts.dayin,
                    dayout: opts.dayout,
                    room: opts.room,
                    price: opts.price,
                    paid: opts.paid,
                    name: opts.name,
                    tel: opts.tel,
                    fn: opts.fn,
                    city: opts.city
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        new Calendar().addGuest(data.year, data.month, data.data);
                        new Contacts().reset();
                        new Contacts().init();
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        select: function () {
            $.ajax({
                url: '../db/gl001/select.php',
                data: {
                    year: document.getElementById('year').innerHTML,
                    month: utils.getMonthId(document.getElementById('month').innerHTML),
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        data.data.sort(function (a, b) {
                            if (a.id > b.id) {
                                return 1;
                            } else if (a.id < b.id) {
                                return -1;
                            } else {
                                return 0;
                            }
                        });
                        new Calendar().setHeader(data.year, data.month);
                        new Calendar().addGuest(data.year, data.month, data.data);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        modify: function (opts) {
            $.ajax({
                url: '../db/gl001/modify.php',
                data: {
                    year: document.getElementById('year').innerHTML,
                    month: utils.getMonthId(document.getElementById('month').innerHTML),
                    id: opts.id,
                    dayin: opts.dayin,
                    dayout: opts.dayout,
                    room: opts.room,
                    price: opts.price,
                    paid: opts.paid,
                    name: opts.name,
                    tel: opts.tel,
                    fn: opts.fn,
                    city: opts.city
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        new Calendar().updGuest(data.old, data.new);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        delete: function (opts) {
            $.ajax({
                url: '../db/gl001/delete.php',
                data: {
                    id: opts
                },
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                        var redirectDialog = new RedirectDialog();
                        redirectDialog.bind();
                        redirectDialog.show();
                    } else {
                        new Calendar().delGuest(data.data);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    }
}