/*jshint esversion: 6 */
(function () {
    "use strict";
})();
const UTILS = {

    OVERLAY: function (val, char, len) {
        var overlayedVal = val + "";
        while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
        return overlayedVal;
    },

    GET_MONTH_NAME: function (id) {
        return gl.monthNames[parseInt(id)];
    },

    GET_MONTH_ID: function (month) {
        return this.overlay(gl.monthNames.indexOf(month), '0', 2);
    },

    GET_DAYS_IN_MONTH: function (m, y) {
        m--;
        var isLeap = ((y % 4) == 0 && ((y % 100) != 0 || (y % 400) == 0));
        return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
    },

    GET_GUEST_KEY_VALUE: function (guest, key) {
        const E = GL.CONST.SCHEMA.GUEST;
        switch (key) {
            case E.UNID.key: return guest[key];
            case E.DBEG.key: return new Date(guest[key]).format('dd.mm');
            case E.DEND.key: return new Date(guest[key]).format('dd.mm');
            case E.DAYS.key: return guest[key];
            case E.ROOM.key: return guest[key];
            case E.BASE.key: return guest[key];
            case E.ADJS.key: return guest[key];
            case E.COST.key: return guest[key];
            case E.PAID.key: return guest[key];
            case E.NAME.key: return guest[key];
            case E.TELN.key: return guest[key];
            case E.FNOT.key: return guest[key];
            case E.CITY.key: return guest[key];
            default: return null;
        }
    },

    GROUP_BY: function (list, keyGetter) {
        const map = new Map();
        list.forEach((item) => {
            const key = keyGetter(item);
            if (!map.has(key)) {
                map.set(key, [item]);
            } else {
                map.get(key).push(item);
            }
        });
        return map;
    },

    CLONE(source) {
        var obj = {};
        for (let key in source) {
            obj[key.toLowerCase()] = '';
        }
        return obj;
    },

    DEEP_FREEZE: function deepFreeze(obj) {

        if (true) return;

        var propNames = Object.getOwnPropertyNames(obj);
      
        propNames.forEach(function (name) {
            var prop = obj[name];
            if (typeof prop == 'object' && prop !== null)
                deepFreeze(prop);
        });
      
        return Object.freeze(obj);
    },

    //TODO: console log format
    LOG: function(id, src, msg) {
        console.log();
    }
};

UTILS.DEEP_FREEZE(UTILS);