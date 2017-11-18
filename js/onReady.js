'use strict';
(function (window) {

    $(document).ready(function () {

        //---------------------------------------------------------------------
        //  TRANSITION EFFECT BEGIN
        //---------------------------------------------------------------------
        var movementStrength = 25;
        var height = movementStrength / $(window).height();
        var width = movementStrength / $(window).width();
        $("body").mousemove(function (e) {
            var pageX = e.pageX - ($(window).width() / 2);
            var pageY = e.pageY - ($(window).height() / 2);
            var newvalueX = width * pageX * -1 - 25;
            var newvalueY = height * pageY * -1 - 50;
            $('body').css("background-position", newvalueX + "px " + newvalueY + "px");
        });
        //---------------------------------------------------------------------
        //  TRANSITION EFFECT END
        //---------------------------------------------------------------------


        //---------------------------------------------------------------------
        //  INFO:
        //  Судя по тому что я нашел - jQuery получает для парсинга исходный
        //  текст страницы. Из-за этого невозможно добавить слушателя на
        //  динамически формирующийся элемент. Единственный выход - это 
        //  использовать Delegate events.
        //  Но и здесь возникают трудности. При попытке обработки одиночного
        //  нажатия на элемент - это событие не обрабатывается корректно.
        //  В результате получается, что  одиночное нажатие не работает. :(
        //  FIX: 
        //  когда-нибудь добавить одиночное нажатие
        //---------------------------------------------------------------------
        $(function () {
            var isMouseDown = false,
                isSelected; // одиночное нажатие         
            $("#calendar-table tbody").on({
                mousedown: function (e) { // мышь нажата
                    isMouseDown = true;
                    $(this).toggleClass(globals.class_selected);
                    isSelected = $(this).hasClass(globals.class_selected);
                    return false;
                },
                mouseover: function (e) { // мышь наведена
                    if (isMouseDown) {
                        $(this).toggleClass(globals.class_selected, isSelected);
                    }
                }
            }, 'td');
            $(document).mouseup(function () {
                isMouseDown = false;
            });
        });
        //---------------------------------------------------------------------
        //  
        //---------------------------------------------------------------------

    });

    //---------------------------------------------------------------------
    //  GUEST INPUT DIALOG BEGIN
    //---------------------------------------------------------------------
    $(function () {
        guestDialog.create();
    });
    //---------------------------------------------------------------------
    //  GUEST INPUT DIALOG END
    //---------------------------------------------------------------------

}(window));