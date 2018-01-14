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

    GET_GUEST_KEY_VALUE: function (data, index) {
        switch (index) {
            case 0:
                return data.id;
                break;
            case 1:
                return data.dayin.substring(8) + '.' + data.dayin.substring(5, 7);
                break;
            case 2:
                return data.dayout.substring(8) + '.' + data.dayout.substring(5, 7);
                break;
            case 3:
                return data.days;
                break;    
            case 4:
                return data.room;
                break;
            case 5:
                return data.baseline;
                break;
            case 6:
                return data.adjustment;
                break;                  
            case 7:
                return data.cost;
                break;
            case 8:
                return data.paid;
                break;
            case 9:
                return data.name;
                break;
            case 10:
                return data.tel;
                break;
            case 11:
                return data.fn;
                break;
            case 12:
                return data.city;
                break;
            default:
                break;
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

    DEEPF_REEZE: function deepFreeze(obj) {

        var propNames = Object.getOwnPropertyNames(obj);
      
        propNames.forEach(function(name) {
          var prop = obj[name];
          if (typeof prop == 'object' && prop !== null)
            deepFreeze(prop);
        });
      
        return Object.freeze(obj);
      }
}

UTILS.DEEPF_REEZE(UTILS);