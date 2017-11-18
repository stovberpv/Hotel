//---------------------------------------------------------------------
//  INPUT YEAR BEGIN (bootstrap-popup)
//---------------------------------------------------------------------
(function (factory) {
        'use strict';
        if (typeof define === 'function' && define.amd) {
            define(['jquery', 'bootstrap'], factory);
        } else if (typeof exports === 'object') {
            factory(require('jquery'), require('bootstrap'));
        } else {
            if (typeof jQuery === 'undefined') {
                throw new Error('bootstrap-popup requires jQuery to be loaded first');
            } else if (typeof (jQuery.fn.modal) === 'undefined') {
                throw new Error('bootstrap-popup requires Bootstrap to be loaded first');
            }
            factory(jQuery, jQuery.fn.modal);
        }
    }

    (function ($, modal) {
        'use strict';
        $.bs = $.bs || {};
        var popup = function () {
            var that = {};
            var id, html,
                message,
                dialogE,
                dialogOk, dialogCancel;

            var randomNum = function (scope) {
                var scope = scope || 100000;
                return Math.floor(Math.random() * scope);
            };

            that.toast = function (opts, callback) {
                id = 'J_PopupToast' + randomNum();
                html = '<div id="' + id + '" class="modal "' + opts.animated + ' tabindex="-1">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                    '<h4 class="modal-title">' + opts.title + '</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<p>' + opts.info + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                var delay = arguments[2] ? arguments[2] : 3000;
                $('body').append(html);
                dialogE = $('#' + id);
                dialogE.find('.modal-dialog').css('width', opts.width);
                dialogE.on('shown.bs.modal', function () {
                    typeof (callback) === 'function' ? callback(dialogE): null;
                    var that = this,
                        t = setTimeout(function () {
                            $(that).modal('hide');
                        }, delay);
                }).modal('show');
                dialogE.on('hidden.bs.modal', function () {
                    $(this).remove();
                });
            };

            that.confirm = function (opts, callback) {
                id = 'J_PopupConfirm' + randomNum();
                html = '<div id="' + id + '" class="modal "' + opts.animated + ' tabindex="-1">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                    '<h4 class="modal-title">' + opts.title + '</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    '<p>' + opts.info + '</p>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-default J_Cancel">Отмена</button>' +
                    '<button type="button" class="btn btn-primary J_Ok">Ок</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $('body').append(html);
                dialogE = $('#' + id);
                dialogE.find('.modal-dialog').css('width', opts.width);
                dialogE.modal('show');
                dialogOk = dialogE.find('.J_Ok');
                dialogCancel = dialogE.find('.J_Cancel');
                dialogOk.on('click', function () {
                    typeof (callback) === 'function' ? callback(dialogE): null;
                });
                dialogCancel.on('click', function () {
                    dialogE.modal('hide');
                });
                dialogE.on('hidden.bs.modal', function () {
                    $(this).remove();
                });
            };

            that.prompt = function (opts, callback) {
                id = 'J_PopupPrompt' + randomNum();
                html = '<div id="' + id + '" class="modal "' + opts.animated + ' tabindex="-1">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content modal-own">' +
                    '<div class="modal-header">' +
                    //                '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                    '<h4 class="modal-title">' + opts.title + '</h4>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    //                '<p>' + opts.info + '</p>' +
                    '<input min="1900" max="9999"' +
                    'value="' + opts.value + '"' +
                    'type="number" class="form-control J_Message modal-own-input" placeholder="' + opts.info + '">' +
                    '</div>' +
                    '<div class="modal-footer modal-own-footer">' +
                    '<button type="button" class="btn btn-default J_Cancel modal-own-button-cancel">Отменить</button>' +
                    '<button type="button" class="btn btn-primary J_Ok modal-own-button-ok">Сохранить</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $('body').append(html);
                dialogE = $('#' + id);
                dialogE.find('.modal-dialog').css('width', opts.width);
                dialogE.modal('show');
                dialogOk = dialogE.find('.J_Ok');
                dialogCancel = dialogE.find('.J_Cancel');
                dialogOk.on('click', function () {
                    message = dialogE.find('.J_Message').eq(0).val();
                    typeof (callback) === 'function' ? callback(dialogE, message): null;
                });
                dialogCancel.on('click', function () {
                    dialogE.modal('hide');
                });
                dialogE.on('hidden.bs.modal', function () {
                    $(this).remove();
                });
            };

            that.custom = function (opts, callback) {
                id = 'J_PopupCustom' + randomNum();
                html = '<div id="' + id + '" class="modal "' + opts.animated + ' tabindex="-1">' +
                    '<div class="modal-dialog">' +
                    '<div class="modal-content">' +
                    '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal">&times;</button>' +
                    '<h4 class="modal-title">' + opts.title + '</h4>' +
                    '</div>' +
                    '<div class="modal-body">' + opts.dom + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                $('body').append(html);
                dialogE = $('#' + id);
                dialogE.find('.modal-dialog').css('width', opts.width);
                dialogE.modal('show');
                typeof (callback) === 'function' ? callback(dialogE): null;
                dialogE.on('hidden.bs.modal', function () {
                    $(this).remove();
                });
            };

            return that;
        };
        $.bs.popup = popup();
    }));
//---------------------------------------------------------------------
//  INPUT YEAR END (bootstrap-popup)
//---------------------------------------------------------------------


//---------------------------------------------------------------------
//  GUEST INPUT BEGIN
//---------------------------------------------------------------------

//---------------------------------------------------------------------
//  GUEST INPUT END
//---------------------------------------------------------------------