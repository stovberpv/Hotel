$(document).ready(function() {
    $(function() {
        $("#dialog").dialog({
            autoOpen: false,
            buttons: [{
                text: "Save",
                click: function(e) {
                    getDialogVal(e);
                }
            }],
            modal: true,
            draggable: true,
            resizable: false,
            width: 280,
            height: 400,
            show: {
                effect: "fade",
                duration: 500
            },
            hide: {
                effect: "fade",
                duration: 500
            },
            dialogClass: "ui-dialog"
        });
        $("#addGuest").on("click", function() {
            setDialogValue();
            $("#dialog").dialog("open");
        });
    });
});

function setDialogValue() {
    $("#dayin").val(selected[0][2]);
    $("#dayout").val(selected[selected.length - 1][2]);
    $("#room").val(selected[0][3]);
    $("#price").val();
}

function getDialogVal(e) {
    var dayin = $("#dayin").val();
    var dayout = $("#dayout").val();
    var room = $("#room").val();
    var price = $("#price").val();
    var paid = $("#paid").val();
    var name = $("#name").val();
    var tel = $("#tel").val();
    var text = $("#text").val();
    guestList.push(["dayin:", dayin, "dayout:", dayout, "room:", room, "price:", price, "paid:", paid, "name:", name, "tel:", tel, "text:", text]);
    $("#dialog").dialog("close");
}