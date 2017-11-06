'use strict';
var globals = {
    month: (new Date()).getMonth() + 1,
    year: (new Date()).getFullYear(),
    guestsTableColumns: 9,
    guestsList: [],
    newGuest: [],
    selectedRooms: [],
    rooms: [11, 12, 13, 21, 22, 23, 31, 32, 33, 34],
    monthNames: [
                    ["", 0],
                    ["Январь", 1],
                    ["Февраль", 2],
                    ["Март", 3],
                    ["Апрель", 4],
                    ["Май", 5],
                    ["Июнь", 6],
                    ["Июль", 7],
                    ["Август", 8],
                    ["Сентябрь", 9],
                    ["Октябрь", 10],
                    ["Ноябрь", 11],
                    ["Декабрь", 12]
                 ],

    class_selected: "selected",
    class_reserver: "reserver",
    class_adjacent: "adjacent",
    class_redeemed: "redeemed"
}
