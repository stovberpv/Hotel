'use strict';
(function (window) {

    $(document).ready(function () {

        db.initialize();

        $(function () {
            var isMouseDown = false,
                isSelected,
                selectedCounter = 1,
                bookSelector = "#book tbody tr#",
                calendarSelector = "#calendar tbody tr td.";

            // CALENDAR TABLE BEGIN
            $("#calendar tbody").on({

                mousedown: function (e) {
                    switch (e.which) {
                        case 2:
                            return;
                            break;

                        case 3:
                            return;
                            break;

                        default:
                            break;
                    }

                    // press + hover begin
                    isMouseDown = true;
                    if ($(this).hasClass("") || $(this).hasClass(globals.class_selected)) {
                        $(this).toggleClass(globals.class_selected);
                    }
                    isSelected = $(this).hasClass(globals.class_selected);

                    isSelected ? $(this).text(selectedCounter++) : $(this).text('');
                    // press + hover end

                    // toggle view begin
                    let ids = getIDs($(this).attr('class'));
                    for (let i = 0; i < ids.length; i++) {
                        $(calendarSelector + ids[i]).each(function () {
                            $(this).toggleClass(ids[i] + '-' + globals.class_viewfix);
                            $(this).toggleClass(ids[i] + '-' + globals.class_view);
                        });
                        $(bookSelector + ids[i]).toggleClass(globals.class_viewfix);
                        $(bookSelector + ids[i]).toggleClass(globals.class_view);
                    }
                    // toggle view end

                    // hide rows begin TODO:
                    /*                     var classList = [];
                                        $('#calendar tbody tr td[class*=' + globals.class_viewfix + ']').each(function () {
                                            classList.push($(this).attr('class'));
                                        });
                                        var uniqueItems = classList.filter((x, i, a) => a.indexOf(x) == i);
                                        for (let i = 0; i < uniqueItems.length; i++) {
                                            var id = getIDs(uniqueItems[i]);
                                        } */
                    // $('#book > tbody > tr').not('.' + globals.class_viewfix).each(function () {
                    //     $(this).toggleClass();
                    // });

                    // hide rows end

                    return false;
                },

                mouseover: function (e) {

                    // press + hover begin
                    if (isMouseDown) {
                        if ($(this).hasClass("") || $(this).hasClass(globals.class_selected)) {
                            $(this).toggleClass(globals.class_selected, isSelected); /* INFO: Вариант работы алгоритма №1 */
                            // $(this).toggleClass(globals.class_selected); /* INFO: Вариант работы алгоритма №2 */
                            isSelected ? $(this).text().length == 0 && $(this).text(selectedCounter++) : $(this).text('');
                        } else {
                            selectedCounter = 1;
                        }
                    }
                    // press + hover end

                    // toggle view begin
                    let ids = getIDs($(this).attr('class'));
                    for (let i = 0; i < ids.length; i++) {
                        if (!$(calendarSelector + ids[i]).hasClass(ids[i] + '-' + globals.class_viewfix)) {
                            $(calendarSelector + ids[i]).each(function () {
                                $(this).addClass(ids[i] + '-' + globals.class_view);
                            });
                            $(bookSelector + ids[i]).addClass(globals.class_view);
                        }
                    }
                    let id = ($(this).attr('id')).substring(3);
                    $('#calendar thead tr:nth-child(2) th#' + id).addClass(globals.class_view);
                    // toggle view end

                },

                mouseleave: function (e) {

                    // toggle view begin
                    let ids = getIDs($(this).attr('class'));
                    for (let i = 0; i < ids.length; i++) {
                        if (!$(calendarSelector + ids[i]).hasClass(ids[i] + '-' + globals.class_viewfix)) {
                            $(calendarSelector + ids[i]).each(function () {
                                $(this).removeClass(ids[i] + '-' + globals.class_view);
                            });
                            $(bookSelector + ids[i]).removeClass(globals.class_view);
                        }
                    }
                    let id = ($(this).attr('id')).substring(3);
                    $('#calendar thead tr:nth-child(2) th#' + id).removeClass(globals.class_view);
                    // toggle view end
                },

                mouseup: function (e) {
                    selectedCounter = 1;
                    isMouseDown = false;
                }

            }, 'td');
            //  CALENDAR TABLE END


            //  BOOK TABLE BEGIN
            $("#book tbody").on({

                mousedown: function (e) {
                    switch (e.which) {
                        case 2:
                            return;
                            break;

                        case 3:
                            return;
                            break;

                        default:
                            break;
                    }

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
            //  BOOK TABLE END

            $(document).mouseup(function () {
                isMouseDown = false;
            });
        });

        var rcmenu;

        var ctm = function (e) {
            e.preventDefault();
            if (rcmenu != undefined) {
                rcmenu.unbind();
            }
            var classList = Array.from(e.target.classList);
            if (classList.length != 0) {
                var btn = {};
                if (classList.includes(globals.class_selected)) {
                    btn = {
                        upd: false,
                        del: false,
                        add: true
                    }

                    var room = (e.target.id).substring(0, 2),
                        limiter = (e.target.id).substring(3, 10),
                        startDay = (e.target.id).substring(11),
                        minDay = 1,
                        maxDay = ($('#calendar thead tr:eq( 1 ) th').length) - 1,
                        begda = 0,
                        endda = 0,
                        i;
                    
                    // find begda
                    i = startDay;
                    while (i >= minDay) {
                        let id = room + '_' + limiter + '-' + utils.overlay(i, 0, 2),
                            cell = $('#calendar tbody tr#' + room + ' td#' + id);
                        if (cell.hasClass(globals.class_selected)) {
                            begda = i;
                        } else {
                            break;
                        }
                        i--;
                    }
                    
                    // find endda
                    i = startDay;
                    while (i <= maxDay) {
                        let id = room + '_' + limiter + '-' + utils.overlay(i, 0, 2),
                            cell = $('#calendar tbody tr#' + room + ' td#' + id);
                        if (cell.hasClass(globals.class_selected)) {
                            endda = i;
                        } else {
                            break;
                        }
                        i++;
                    }                    

                } else if(classList.includes(globals.class_redeemed || globals.class_reserved)) {
                    btn = {
                        upd: true,
                        del: true,
                        add: false
                    }
                } else {
                    return;
                }
                rcmenu = new RCMenu({
                    id: getIDs(e.target.className)[0],
                    begda: begda,
                    endda: endda,
                    room: room,
                    btn: btn,
                    source: document,
                    x: e.pageX,
                    y: e.pageY
                });
                rcmenu.bind();
                rcmenu.show();
            }
        }

        var click = function () {
            if (rcmenu != undefined) {
                rcmenu.unbind();
                rcmenu = undefined;
            }
        }

        window.addEventListener('contextmenu', ctm, false);
        window.addEventListener('click', click, false);

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