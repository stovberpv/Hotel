'use strict';
(function (window) {

    $(document).ready(function () {

        db.initialize();

        //---------------------------------------------------------------------
        //  TRANSITION EFFECT BEGIN
        //---------------------------------------------------------------------
        /* var movementStrength = 25;
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
        //  FIX:
        //  Тут полный ПЭ с присовением классов. Пересмотреть весь алгоритм
        //  на свежую голову и переделать все нормально, что бы было прозрачно
        //  и предсказуемо.
        //---------------------------------------------------------------------
        $(function () {
            var isMouseDown = false,
                isSelected,
                bookSelector = "#book tbody tr#",
                calendarSelector = "#calendar tbody tr td.";  
            
            //---------------------------------------------------------------------
                // CALENDAR TABLE BEGIN
            //---------------------------------------------------------------------
            $("#calendar tbody").on({

                mousedown: function (e) {

                    // press + hover begin
                    isMouseDown = true;
                    if ($(this).hasClass("") || $(this).hasClass(globals.class_selected)) {
                        $(this).toggleClass(globals.class_selected);
                    }
                    isSelected = $(this).hasClass(globals.class_selected);
                    // press + hover end

                    let ids = getIDs($(this).attr('class'));
                    for (let i = 0; i < ids.length; i++) {
                        $(calendarSelector + ids[i]).each(function () {
                            $(this).toggleClass(ids[i] + '-' + globals.class_viewfix);
                            $(this).toggleClass(ids[i] + '-' + globals.class_view);
                        });
                        $(bookSelector + ids[i]).toggleClass(globals.class_viewfix);
                        $(bookSelector + ids[i]).toggleClass(globals.class_view);
                    }

                    return false;
                },

                mouseover: function (e) {

                    // press + hover begin
                    if (isMouseDown && ($(this).hasClass("") || $(this).hasClass(globals.class_selected))) {
                        $(this).toggleClass(globals.class_selected, isSelected); /* INFO: Вариант работы алгоритма №1 */
                        // $(this).toggleClass(globals.class_selected); /* INFO: Вариант работы алгоритма №2 */
                    }
                    // press + hover end
                    
                    let ids = getIDs($(this).attr('class'));
                    for (let i = 0; i < ids.length; i++) {
                        if (!$(calendarSelector + ids[i]).hasClass(ids[i] + '-' + globals.class_viewfix)) {
                            $(calendarSelector + ids[i]).each(function () {
                                $(this).addClass(ids[i] + '-' + globals.class_view);
                            });
                            $(bookSelector + ids[i]).addClass(globals.class_view);
                        }
                    }
                },

                mouseleave: function (e) {
                    
                    let ids = getIDs($(this).attr('class'));
                    for (let i = 0; i < ids.length; i++) {
                        if (!$(calendarSelector + ids[i]).hasClass(ids[i] + '-' + globals.class_viewfix)) {
                            $(calendarSelector + ids[i]).each(function () {
                                $(this).removeClass(ids[i] + '-' + globals.class_view);
                            });
                            $(bookSelector + ids[i]).removeClass(globals.class_view);
                        }
                    }
                },

                mouseup: function (e) {

                    isMouseDown = false;
                } 

            }, 'td');
            //---------------------------------------------------------------------
                //  CALENDAR TABLE END
            //---------------------------------------------------------------------


            //---------------------------------------------------------------------
                //  BOOK TABLE BEGIN
            //---------------------------------------------------------------------
            $("#book tbody").on({

                mousedown: function (e) {
                    
                    var source = $(this);
                    if (source.parents('tr').length == 0) {
                        var id = source.attr('id');
                        source.toggleClass(globals.class_viewfix);
                        source.toggleClass(globals.class_view);
                        $(calendarSelector + id).each(function () {
                            if (source.hasClass(globals.class_viewfix)) {
                                $(this).addClass(id + '-' + globals.class_viewfix);
                                $(this).removeClass(id + '-' + globals.class_view);
                            } else {
                                $(this).addClass(id + '-' + globals.class_view);
                                $(this).removeClass(id + '-' + globals.class_viewfix);
                            }
                        });
                    }
                },

                mouseover: function (e) { // мышь наведена
                    
                    if ($(this).parents('tr').length == 0) {
                        var id = $(this).attr('id');
                        if (!$(this).hasClass(globals.class_viewfix)) {
                            $(this).addClass(globals.class_view);
                            $(calendarSelector + id).each(function () {
                                $(this).addClass(id + '-' + globals.class_view);
                            });
                        }    
                    }    
                },

                mouseleave: function (e) {

                    if ($(this).parents('tr').length == 0) {
                        var id = $(this).attr('id');
                        if (!$(this).hasClass(globals.class_viewfix)) {
                            $(this).removeClass(globals.class_view);
                            $(calendarSelector + id).each(function () {
                                $(this).removeClass(id + '-' + globals.class_view);
                            });
                        }
                    }
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

function getIDs(string) {
    var result = [];
    var classList = string != undefined ? string.split(' ') : []; 
    for (let i = 0; i < classList.length; i++) {
        if (classList[i].match(/^N\d+$/g)) result.push(classList[i].match(/^N\d+$/g));
    }
    return result;
    // return string != undefined ? string.match(/^N\d+$/g) ? string.match(/^N\d+$/g) : [] : [];
}