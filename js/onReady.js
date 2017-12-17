'use strict';
(function (window) {

    $(document).ready(function () {

        db.initialize();

        $(function () {
            var isMouseDown = false,
                isSelected;
            
            const selGroup = {

                classId: undefined,

                free: function () {
                    this.classId = undefined;
                },

                gen: function () {
                    this.classId = 'sel-group-' + Math.ceil((Math.random() * 100000));
                },

                add: function (target) {
                    !this.classId && this.gen();
                    target.addClass(this.classId);
                    this.enum(this.classId);
                },

                get: function (target) {
                    var classId = target.prop("className").match(/\bsel-group-\d+/);
                    return classId ? classId[0] : '';
                },

                del: function (target) {
                    var classId = this.get(target);
                    if (classId) {
                        target.removeClass(classId);
                        target.empty();
                        this.enum(classId);
                    }
                },

                enum: function (classId) {
                    $('#calendar > tbody > tr > td.' + classId).each(function (i) {
                        $(this).text(i + 1);
                    })
                }
            }

            $("#calendar > tbody").on({

                mousedown: function (e) {
                    
                    switch (e.which) {
                        case 2:
                            return;
                            break;

                        case 3:
                            rcmenu_open(e, Array.from(e.target.classList));
                            return;
                            break;

                        default:
                            break;
                    }

                    /*-----------------------------------------------------------------------
                        PRESS AND HOVER BEGIN
                    -----------------------------------------------------------------------*/
                    isMouseDown = true;
                    if ($(this).hasClass("") || $(this).hasClass(globals.class_selected)) {
                        $(this).toggleClass(globals.class_selected);
                    }
                    isSelected = $(this).hasClass(globals.class_selected);
                    selGroup.del($(this));
                    isSelected ? selGroup.add($(this)) : selGroup.free();
                    /*-----------------------------------------------------------------------
                        PRESS AND HOVER END
                    -----------------------------------------------------------------------*/

                    /*-----------------------------------------------------------------------
                        VIEW TOGGLE BEGIN
                    -----------------------------------------------------------------------*/                    
                    let ids = getIDs($(this).attr('class'));
                    for (let i = 0; i < ids.length; i++) {
                        $("#calendar > tbody > tr > td." + ids[i]).each(function () {
                            $(this).toggleClass(ids[i] + '-' + globals.class_viewfix);
                            $(this).toggleClass(ids[i] + '-' + globals.class_view);
                        });
                        $(".book > tbody > tr#" + ids[i]).toggleClass(globals.class_viewfix);
                        $(".book > tbody > tr#" + ids[i]).toggleClass(globals.class_view);
                    }
                    /*-----------------------------------------------------------------------
                        VIEW TOGGLE END
                    -----------------------------------------------------------------------*/   
                },

                mouseover: function (e) {

                    /*-----------------------------------------------------------------------
                        PRESS AND HOVER BEGIN
                    -----------------------------------------------------------------------*/
                    if (isMouseDown) {
                        if ($(this).hasClass('') || $(this).hasClass(globals.class_selected)) {
                            $(this).toggleClass(globals.class_selected, isSelected);
                            selGroup.del($(this));
                            isSelected && selGroup.add($(this));
                        } else {
                            selGroup.free();
                        }
                    }
                    /*-----------------------------------------------------------------------
                        PRESS AND HOVER END
                    -----------------------------------------------------------------------*/

                    /*-----------------------------------------------------------------------
                        VIEW TOGGLE BEGIN
                    -----------------------------------------------------------------------*/    
                    let ids = getIDs($(this).attr('class'));
                    for (let i = 0; i < ids.length; i++) {
                        if (!$("#calendar > tbody > tr > td." + ids[i]).hasClass(ids[i] + '-' + globals.class_viewfix)) {
                            $("#calendar > tbody > tr > td." + ids[i]).each(function () {
                                $(this).addClass(ids[i] + '-' + globals.class_view);
                            });
                            $(".book > tbody > tr#" + ids[i]).addClass(globals.class_view);
                        }
                    }
                    let id = ($(this).attr('id')).substring(3);
                    $('#calendar thead tr:nth-child(2) th#' + id).addClass(globals.class_view);
                    /*-----------------------------------------------------------------------
                        VIEW TOGGLE END
                    -----------------------------------------------------------------------*/   
                },

                mouseleave: function (e) {

                    /*-----------------------------------------------------------------------
                        VIEW TOGGLE BEGIN
                    -----------------------------------------------------------------------*/   
                    let ids = getIDs($(this).attr('class'));
                    for (let i = 0; i < ids.length; i++) {
                        if (!$("#calendar > tbody > tr > td." + ids[i]).hasClass(ids[i] + '-' + globals.class_viewfix)) {
                            $("#calendar > tbody > tr > td." + ids[i]).each(function () {
                                $(this).removeClass(ids[i] + '-' + globals.class_view);
                            });
                            $(".book > tbody > tr#" + ids[i]).removeClass(globals.class_view);
                        }
                    }
                    let id = ($(this).attr('id')).substring(3);
                    $('#calendar > thead > tr:nth-child(2) > th#' + id).removeClass(globals.class_view);
                    /*-----------------------------------------------------------------------
                        VIEW TOGGLE END
                    -----------------------------------------------------------------------*/   
                },

                mouseup: function (e) {

                    selGroup.free();
                    isMouseDown = false;
                }

            }, 'td:not( #calendar > tbody > .hidden td )');

            $('#calendar > tbody').on({

                mousedown: function () {
                    $(this).toggleClass(globals.class_viewfix);
                    $('#' + this.innerHTML + '-book').toggle();
                }

            }, 'tr > th');

            $("#calendar > tbody").on({

                mousedown: function (e) {
                    
                    switch (e.which) {
                        case 2:
                            return;
                            break;

                        case 3:
                            rcmenu_open(e, null);
                            return;
                            break;

                        default:
                            break;
                    }

                    var source = $(this);
                    if (source.parents('.innerBook').length == 0) {
                        var id = source.attr('id');
                        source.toggleClass(globals.class_viewfix);
                        source.toggleClass(globals.class_view);
                        $("#calendar > tbody > tr > td." + id).each(function () {
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

                mouseover: function (e) {

                    if ($(this).parents('.innerBook').length == 0) {
                        var id = $(this).attr('id');
                        if (!$(this).hasClass(globals.class_viewfix)) {
                            $(this).addClass(globals.class_view);
                            $("#calendar > tbody > tr > td." + id).each(function () {
                                $(this).addClass(id + '-' + globals.class_view);
                            });
                        }
                    }
                },

                mouseleave: function (e) {

                    if ($(this).parents('.innerBook').length == 0) {
                        var id = $(this).attr('id');
                        if (!$(this).hasClass(globals.class_viewfix)) {
                            $(this).removeClass(globals.class_view);
                            $("#calendar > tbody > tr > td." + id).each(function () {
                                $(this).removeClass(id + '-' + globals.class_view);
                            });
                        }
                    }
                }
            }, '.book > tbody > tr');

            $(document).mouseup(function () {
                isMouseDown = false;
            });
        });

        var rcmenu;
        var rcmenu_open = function (e, classList) {
            var id, room, dayin, dayout,
                btn = {};

            rcmenu && rcmenu.unbind();

            if (classList) {
                if (classList.includes(globals.class_selected)) {
                    var row = (e.currentTarget.id).substring(0, 2),
                        groupId = e.currentTarget.className.match(/\bsel-group-\d+/g),
                        groupEl = $("#calendar > tbody > tr#" + row + " > td." + groupId),
                        begda = groupEl[0].id.split('-'),
                        endda = groupEl[groupEl.length - 1].id.split('-');

                    room = row;
                    dayin = begda[2] + '.' + begda[1];
                    dayout = endda[2] + '.' + endda[1];
                    btn = { upd: false, del: false, add: true }
                } else if (classList.includes(globals.class_redeemed) || classList.includes(globals.class_reserved)) {
                    id = getIDs(e.currentTarget.className)[0];
                    btn = { upd: true, del: true, add: false }
                } else {
                    return;
                }

            } else {
                id = [e.currentTarget.id];
                btn = { upd: true, del: true, add: false }
            }

            rcmenu = new RCMenu({
                id: id,
                begda: dayin,
                endda: dayout,
                room: room,
                btn: btn,
                x: e.pageX,
                y: e.pageY
            });

            rcmenu.bind();
            rcmenu.show();
        }

        var ctm = function (e) {
            e.preventDefault();
            return;
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
}