'use strict';
(function (window) {

    $(document).ready(function () {

        db.initialize();

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
        //  
        //---------------------------------------------------------------------
        $(function () {
            var isMouseDown = false,
                isSelected; // одиночное нажатие   
            
            //---------------------------------------------------------------------
                // CALENDAR TABLE BEGIN
            //---------------------------------------------------------------------
            $("#calendar tbody").on({

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
                    var cl = $(this).attr('class');
                    if (cl != undefined) {
                        let ids = cl.match(/N\d+/g) ? cl.match(/N\d+/g) : [];
                        for (let i = 0; i < ids.length; i++) {
                            $('#calendar tbody tr td.' + ids[i]).each(function () {
                                $(this).addClass('viewed');
                            });
                            $('#book tbody tr#' + ids[i]).addClass('viewed');
                        }
                    }
                },

                mouseleave: function (e) {
                    var cl = $(this).attr('class');
                    if (cl != undefined) { 
                        let ids = cl.match(/N\d+/g) ? cl.match(/N\d+/g) : [];
                        for (let i = 0; i < ids.length; i++) { 
                            $('#calendar tbody tr td.' + ids[i]).each(function () {
                                $(this).removeClass('viewed');
                            });
                            $('#book tbody tr#' + ids[i]).removeClass('viewed');
                        }
                    }
                }
            }, 'td');
            //---------------------------------------------------------------------
                //  CALENDAR TABLE END
            //---------------------------------------------------------------------


            //---------------------------------------------------------------------
                //  BOOK TABLE BEGIN
            //---------------------------------------------------------------------
            $("#book").on({

                mouseover: function (e) { // мышь наведена
                    
                    var id = $(this).attr('id');
                    $(this).parents('tr').addClass('viewed');
                    $('#calendar tbody tr td.' + id).each(function () {
                        $(this).addClass('viewed');
                    });
                },

                mouseleave: function (e) {

                    var id = $(this).attr('id');
                    $(this).parents('tr').removeClass('viewed');
                    $('#calendar tbody tr td.' + id).each(function () {
                        $(this).removeClass('viewed');
                    });
                },

                mousedown: function (e) {

                    $(this).parents('tr').toggleClass(globals.class_selected);
                }
            }, 'tr');
            //---------------------------------------------------------------------
                //  BOOK TABLE END
            //---------------------------------------------------------------------

            $(document).mouseup(function () {
                isMouseDown = false;
            });
        });
        //---------------------------------------------------------------------
        //  
        //---------------------------------------------------------------------

    });

}(window));