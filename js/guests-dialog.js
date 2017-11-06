var index;

$(document).ready(function () {
    $(function () {
        createDialog();
    });
});

$("#addGuest").on("click", function () {
    index = 0;
    setDialogVal(index);
    dialogOpen();
});

function createDialog() {
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
        buttons: [{
            id: "close",
            text: "Отменить",
            click: function (e) {
                closeDialog();
            }
        }, {
            id: "save",
            text: "Сохранить",
            click: function (e) {
                //TODO
                getDialogVal(); // todo rename
                ajax.insert();
                closeDialog();
                /*
                index++;
                nextRoom();
                */
            }
        }, ]
    });
}

function nextRoom() {
    for (index; index < selectedRooms.length; index++) {
        setDialogVal(index);
        dialogOpen();
    }
}

function setDialogVal(i) {
    $("#dayin").val("");
    $("#dayout").val("");
    $("#room").val("");
    $("#price").val("");
    $("#paid").val("");
    $("#name").val("");
    $("#tel").val("");
    $("#text").val("");
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

function getDialogVal() {
    var dayin = $("#dayin").val();
    var dayout = $("#dayout").val();
    var room = $("#room").val();
    var price = $("#price").val();
    var paid = $("#paid").val();
    var name = $("#name").val();
    var tel = $("#tel").val();
    var info = $("#text").val();
    globals.newGuest = [{
        id: -1,
        dayin: dayin,
        dayout: dayout,
        room: room,
        price: price,
        paid: paid,
        name: name,
        tel: tel,
        info: info
    }];
}

function dialogOpen() {
    $("#dialog").dialog("open");
}

function closeDialog() {
    $("#dialog").dialog("close");
}
