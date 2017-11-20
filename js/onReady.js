'use strict';
(function (window) {

    $(document).ready(function () {

        //---------------------------------------------------------------------
        //  TRANSITION EFFECT BEGIN
        //---------------------------------------------------------------------
/*         var movementStrength = 25;
        var height = movementStrength / $(window).height();
        var width = movementStrength / $(window).width();
        $("body").mousemove(function (e) {
            var pageX = e.pageX - ($(window).width() / 2);
            var pageY = e.pageY - ($(window).height() / 2);
            var newvalueX = width * pageX * -1 - 25;
            var newvalueY = height * pageY * -1 - 50;
            $('body').css("background-position", newvalueX + "px " + newvalueY + "px");
        }); */
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
            
            //---------------------------------------------------------------------
                // CALENDAR TABLE BEGIN
            //---------------------------------------------------------------------
            $("#calendar-table tbody").on({

                mousedown: function (e) { // мышь нажата

                    isMouseDown = true;
                    var has = $(this).hasClass(globals.class_selected)
                    var isEpmty = $(this).hasClass("")
                    if (isEpmty || has) {
                        $(this).toggleClass(globals.class_selected);
                    }
                    isSelected = $(this).hasClass(globals.class_selected);
                    return false;
                },

                mouseover: function (e) { // мышь наведена

                    if (isMouseDown) {
                        $(this).toggleClass(globals.class_selected, isSelected);
                    }

                    if ($(this).children('div').length > 0) {
                        var ids = this.children[0].children[0].id.split('/');
                        for (let i = 0; i < ids.length; i++) {
                            $('#calendar-table tbody tr td div span#' + ids[i]).parents('td').addClass('viewed');
                            $('#guests-table tbody tr#' + ids[i]).addClass('viewed');
                        }
                    }
                },

                mouseleave: function (e) {

                    if ($(this).children('div').length > 0) {
                        var ids = this.children[0].children[0].id.split('/');
                        for (let i = 0; i < ids.length; i++) {
                            $('#calendar-table tbody tr td div span#' + ids[i]).parents('td').removeClass('viewed');
                            $('#guests-table tbody tr#' + ids[i]).removeClass('viewed');
                        }
                    }
                }
            }, 'td');
            //---------------------------------------------------------------------
                //  CALENDAR TABLE END
            //---------------------------------------------------------------------


            //---------------------------------------------------------------------
                //  GUESTS TABLE BEGIN
            //---------------------------------------------------------------------
            $("#guests-table tbody").on({

                mouseover: function (e) { // мышь наведена

                    var id = $(this).attr('id');
                    $(this).addClass('viewed');
                    var span = $('#calendar-table tbody tr td div span').filter(function () {
                        var regex = new RegExp('(^.*\/' + id + '$)|(^' + id + '\/.*$)|(^' + id + '$)');
                        if (regex.test($(this).attr('id'))) {
                            $(this).parents('td').addClass('viewed');
                        }
                    });

                },

                mouseleave: function (e) {

                    var id = $(this).attr('id');
                    $(this).removeClass('viewed');
                    var span = $('#calendar-table tbody tr td div span').filter(function () {
                        var regex = new RegExp('(^.*\/' + id + '$)|(^' + id + '\/.*$)|(^' + id + '$)');
                        if (regex.test($(this).attr('id'))) {
                            $(this).parents('td').removeClass('viewed');
                        }
                    });
                }
            }, 'tr');
            //---------------------------------------------------------------------
                //  GUESTS TABLE END
            //---------------------------------------------------------------------

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