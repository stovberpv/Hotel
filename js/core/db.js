/*jshint esversion: 6 */
/*jshint -W030 */
(function () { "use strict"; })();
const DB = {

    CF001: {

        SELECT: function (data, eventId = '') {
            const E = GL.CONST.EVENTS.CALENDAR.DB.CF001.SELECT;
            $.ajax({ url: '../db/cf001/select.php', data: data, dataType: 'json',
                success: function (data) { EVENT_BUS.dispatch(E.SUCCESS + eventId, data); },
                error: function (xhr, textStatus) { EVENT_BUS.dispatch(E.ERROR + eventId, { xhr, textStatus }); }
            });
        },

        UPDATE: function (data, eventId = '') {
            const E = GL.CONST.EVENTS.CALENDAR.DB.CF001.UPDATE;
            $.ajax({ url: '../db/cf001/modify.php', data: data, dataType: 'json',
                success: function (data) { EVENT_BUS.dispatch(E.SUCCESS + eventId, data); },
                error: function (xhr, textStatus) { EVENT_BUS.dispatch(E.ERROR + eventId, { xhr, textStatus }); }
            });
        }
    },

    RM001: {

        SELECT: function (data, eventId = '') {
            const E = GL.CONST.EVENTS.CALENDAR.DB.RM001.SELECT;
            $.ajax({ url: '../db/rm001/select.php', data: data, dataType: 'json',
                success: function (data) { EVENT_BUS.dispatch(E.SUCCESS + eventId, data); },
                error: function (xhr, textStatus) { EVENT_BUS.dispatch(E.ERROR + eventId, { xhr, textStatus }); }
            });
        }
    },

    GL001: {

        INSERT: function (data, eventId = '') {
            const E = GL.CONST.EVENTS.CALENDAR.DB.GL001.INSERT;
            $.ajax({ url: '../db/gl001/insert.php', data: data, dataType: 'json',
                success: function (data) { EVENT_BUS.dispatch(E.SUCCESS + eventId, data); },
                error: function (xhr, textStatus) { EVENT_BUS.dispatch(E.ERROR + eventId, { xhr, textStatus }); }
            });
        },

        SELECT: function (data, eventId = '') {
            const E = GL.CONST.EVENTS.CALENDAR.DB.GL001.SELECT;
            $.ajax({ url: '../db/gl001/select.php', data: data, dataType: 'json',
                success: function (data) { EVENT_BUS.dispatch(E.SUCCESS + eventId, data); },
                error: function (xhr, textStatus) { EVENT_BUS.dispatch(E.ERROR + eventId, { xhr, textStatus }); }
            });
        },

        UPDATE: function (data, eventId = '') {
            const E = GL.CONST.EVENTS.CALENDAR.DB.GL001.UPDATE;
            $.ajax({ url: '../db/gl001/modify.php', data: data, dataType: 'json',
                success: function (data) { EVENT_BUS.dispatch(E.SUCCESS + eventId, data); },
                error: function (xhr, textStatus) { EVENT_BUS.dispatch(E.ERROR + eventId, { xhr, textStatus }); }
            });
        },

        DELETE: function (data, eventId = '') {
            const E = GL.CONST.EVENTS.CALENDAR.DB.GL001.DELETE;
            $.ajax({ url: '../db/gl001/delete.php', data: data, dataType: 'json',
                success: function (data) { EVENT_BUS.dispatch(E.SUCCESS + eventId, data); },
                error: function (xhr, textStatus) { EVENT_BUS.dispatch(E.ERROR + eventId, { xhr, textStatus }); }
            });
        }
    }
};

// UTILS.DEEPF_REEZE(DB);