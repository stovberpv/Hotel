'use strict';
(function (window) {
    var $ = window.$,
        document = window.document,
        index;
    const guest = new Guest();

    $(document).ready(function () {
        $(function () {
            $("#dialog").dialog({
                dialogClass: "ui-dialog",
                autoOpen: false,
                modal: true,
                draggable: true,
                resizable: false,
                width: 'auto',
                height: 'auto',
                show: {
                    effect: "drop",
                    duration: 400
                },
                hide: {
                    effect: "drop",
                    duration: 400
                },
                buttons: [
                    {
                        id: "save",
                        text: "Добавить",
                        click: function (e) {
                            guest.guestAdd({
                                dayin: $("#dayin").val(),
                                dayout: $("#dayout").val(),
                                room: $("#room").val(),
                                price: $("#price").val(),
                                paid: $("#paid").val(),
                                name: $("#name").val(),
                                tel: $("#tel").val(),
                                text: $("#text").val()
                            });
                            close();
                            index++;
                            nextRoom();
                            // return true;
                        }
                    },
                    {
                        id: "close",
                        text: "Отменить",
                        click: function (e) {
                            close();
                            // return false;
                        }
                    },
                ]
            });
        });
    });

    $("#addGuest").on("click", function () {
        index = 0;
        init(index);
        open();
    });

    function open() {
        $("#dialog").dialog("open");
    }

    function close() {
        $("#dialog").dialog("close");
    }

    function nextRoom() {
        /*
        for (index; index < selectedRooms.length; index++) {
            init(index);
            open();
        }
        */
    }

    function init(i) {
        $("#dayin").val("");
        $("#dayout").val("");
        $("#room").val("");
        $("#price").val("");
        $("#paid").val("");
        $("#name").val("");
        $("#tel").val("");
        $("#text").val("");

        // TODO Dialog Selected Room
        /*
        if (selectedRooms.length == 0) {
            return;
        }
        $("#dayin").val(selectedRooms[i][1]);
        $("#dayout").val(selectedRooms[i][2]);
        $("#room").val(selectedRooms[i][3]);
        $("#price").val();
        */
    }

}(window));
