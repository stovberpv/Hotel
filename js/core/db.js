const DB = {

    CF001: {

        SELECT: function () {
            $.ajax({
                url: '../db/cf001/select.php',
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        },

        UPDATE: function () {
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
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });
        }
    },

    RM001: {

        SELECT: function () {
            $.ajax({
                url: '../db/rm001/select.php',
                data: {},
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
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

    GL001: {

        INSERT: function (opts) {
            //FIX: php opts.dayin ... 
            $.ajax({
                url: '../db/gl001/insert.php',
                data: opts,
                dataType: 'json',
                success: function (data) {
                    EVENT_BUS.dispatch(L.CONST.EVENTS.CALENDAR.DB.GL001.INSERT.SUCCESS, data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    EVENT_BUS.dispatch(L.CONST.EVENTS.CALENDAR.DB.GL001.INSERT.ERROR, { xhr, textStatus, errorThrown });
                }
            });
        },

        SELECT: function (year, month, callbackSuccess, callbackError) {
            $.ajax({
                url: '../db/gl001/select.php',
                data: {
                    year: year,
                    month: month,
                },
                dataType: 'json',
                success: callbackSuccess,
                error: callbackError
            });
        },

        UPDATE: function (opts) {
            //FIX: php opts.dayin ... 
            $.ajax({
                url: '../db/gl001/modify.php',
                data: opts,
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
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

        DELETE: function (opts) {
            //FIX: php opts.id 
            $.ajax({
                url: '../db/gl001/delete.php',
                data: opts,
                dataType: 'json',
                success: function (data) {
                    if (!data.status) {
                        console.log(data.msg);
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

UTILS.DEEPF_REEZE(DB);