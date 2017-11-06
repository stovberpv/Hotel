var clickListener_select = (function (e) {
    if (e.currentTarget.hasAttribute('class')) {
        if (e.currentTarget.getAttribute('class') === globals.class_selected) {
            e.currentTarget.removeAttribute('class');
        } else {
            // do nothing!
        }
    } else {
        e.currentTarget.setAttribute('class', globals.class_selected);
    }
});

var utils = {

    overlay: function (val, char, len) {
        var overlayedVal = val + "";
        while (overlayedVal.length < len) overlayedVal = char + "" + overlayedVal;
        return overlayedVal;
    },

    getDaysInMonth: function (m, y) {
        return m === 2 ? y & 3 || !(y % 25) && y & 15 ? 28 : 29 : 30 + (m + (m >> 3) & 1);
    },

    getKeyValue: function (data, index) {
        switch (index) {
            case 0:
                return data.id;
                break;
            case 1:
                return data.dayin;
                break;
            case 2:
                return data.dayout;
                break;
            case 3:
                return data.room;
                break;
            case 4:
                return data.price;
                break;
            case 5:
                return data.paid;
                break;
            case 6:
                return data.name;
                break;
            case 7:
                return data.tel;
                break;
            case 8:
                return data.info;
                break;
            default:
                break;
        }
        /*
    var iteration = 0;
    for (var propName in data) {
        if (iteration == index) {
            if (data.hasOwnProperty(propName)) {
                return data[propName];
            }
        } else if(iteration> index) {
            return "";
        }
        iteration += 1;
    }
    */
    }

}
