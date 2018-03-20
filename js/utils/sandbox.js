/*jshint esversion: 6 */
/*jshint -W061 */
(function () { "use strict"; })();
const UTILS = {

    /**
     * @return {string}
     */
    OVERLAY: function (val, char, len) {
        let overlayedVal = val + "";
        while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
        return overlayedVal;
    },

    GET_DAYS_IN_MONTH: function (m, y) {
        m--;
        let isLeap = ((y % 4) == 0 && ((y % 100) != 0 || (y % 400) == 0));
        return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
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

    DEEP_FREEZE: function deepFreeze(obj) {

        if (true) return;

        let propNames = Object.getOwnPropertyNames(obj);

        propNames.forEach(function (name) {
            let prop = obj[name];
            if (typeof prop == 'object' && prop !== null)
                deepFreeze(prop);
        });

        return Object.freeze(obj);
    },

    LOG: function (id = "info", src = "", msg = "", srcColor = 'black', msgColor = "black") {
        eval(`console.${id}('%c${src}::%c${msg}', 'color:${srcColor}', 'color:${msgColor}')`);
    },

    /**
     * @return {string}
     */
    FORMAT: function (text, values = {}) {
        return Object.keys(values).map(function (key, i) { return text.replace(`{${i + 1}}`, values[key]); });
    },

    CONVERT_MS: function(milliseconds) {
        let day, hour, minute, seconds;
        seconds = Math.floor(milliseconds / 1000);
        minute = Math.floor(seconds / 60);
        seconds = seconds % 60;
        hour = Math.floor(minute / 60);
        minute = minute % 60;
        day = Math.floor(hour / 24);
        hour = hour % 24;
        return {
            day: day,
            hour: hour,
            minute: minute,
            seconds: seconds
        };
    },

    IS_DOM: function(obj) { return !!(obj && obj.nodeType === 1); },

    GET_COOKIE: function(name = '') {
        let result = {},
            cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            let cookiePair = cookie.split('='),
                key = cookiePair[0].trim();
                val = cookiePair[1];
            if (key === name) return val;
            result[key] = val;
        }
        return result;
    }
};

UTILS.DEEP_FREEZE(UTILS);