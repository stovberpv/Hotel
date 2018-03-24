/*jshint esversion: 6 */
/*jshint -W030 */

(function () { 'use strict'; })();

const GL = {
    CONST: {
        CSS: { CORE: { CLASS: { NAV_EL_SEL: 'nav-el-sel', VC_DW_SHOW: 'vc-data-wrapper-show', } } },
        DATA_ATTR: {
            JOURNAL: {
                VIEW: { FIX: 'fix', HOV: 'hov' },
                STATUS: { SELECTED: 'selected', /*выделен*/ RESERVED: 'reserved', /*зарезервирован*/ ADJACENT: 'adjacent', /*смежный*/ REDEEMED: 'redeemed', /*выкуплен*/ }
            },
            CONTACT: { STATUS: { INITIAL: 'initial', EDITED: 'edited' } }
        },
        EVENTS: {
            CORE: { LEFT_CLICK: 'leftClick', },
            JOURNAL: { RC_MENU: { ADD: 'rcmItemAddClick', DEL: 'rcmItemDelClick', UPD: 'rcmItemUpdClick', }, },
            CONTACT: { NEW: 'contactSaved' }
        },
        VALUES: {
            CORE: {
                NAV_El: [ 'nav-el-calendar', 'nav-el-contacts', 'nav-el-diagrams', 'nav-el-settings', 'nav-el-infopage', 'nav-el-signout' ],
                CHAINS: [
                    { DATA_WRAPPER: 'vc-dw-1', NAV_EL: 'nav-el-calendar' },
                    { DATA_WRAPPER: 'vc-dw-2', NAV_EL: 'nav-el-contacts' },
                    { DATA_WRAPPER: 'vc-dw-3', NAV_EL: 'nav-el-diagrams' },
                    { DATA_WRAPPER: 'vc-dw-4', NAV_EL: 'nav-el-settings' },
                    { DATA_WRAPPER: 'vc-dw-5', NAV_EL: 'nav-el-infopage' },
                    { DATA_WRAPPER: 'vc-dw-6', NAV_EL: 'nav-el-signout' }
                ],
            },
            UTILS: { ONE_DAY: 86400000 }
        },
        PREFIX: {
            CONFIRM_DIALOG: 'confirm-dialog',
            PICK_PERIOD: 'pick-period',
            GUEST_CARD: 'guest-card',
            PERSON: { CELL: 'person-cell', FIELD: 'person-field' }
        },
        LOG: {
            LEVEL: { DEBUG: 'debug', ERROR: 'error', INFO: 'info', WARN: 'warn' },
            ID: {
                A000: { TITLE: 'Ошибка вызова функции', GIST: 'Отсутствуют входные данные' },
                A001: { TITLE: 'Ошибка работы функции', GIST: 'Данные не консистентны' },
                A003: { TITLE: 'Операция завершена', GIST: 'Данные обработаны' },
                A004: { TITLE: 'Операция запущена', GIST: 'Запрашиваем данные' },
                B000: { TITLE: 'Ответ БД', GIST: 'Запрос обрабатывается' },
                B001: { TITLE: 'Ответ БД', GIST: 'Запрос выполнен успешно' },
                B002: { TITLE: 'Ответ БД', GIST: 'Запрос отклонен' },
                C000: { TITLE: '', GIST: '' },
                C001: { TITLE: '', GIST: '' },
                D000: { TITLE: '', GIST: '' },
                D001: { TITLE: '', GIST: '' },
            }
        },
        LOCALIZABLE: {
            MSG000: '',
            MSG001: 'Вы действительно хотите удалить запись под номером {1}?\nДействие нельзя будет отменить!',
            VAR000: '',
            VAR001: {
                YEAR: 'Год',
                MNTH: 'Месяц',
                UNID: 'Идентиф',
                DBEG: 'Дата заезда',
                DEND: 'Дат выезда',
                DAYS: 'Дней отдыха',
                ROOM: 'Комната',
                BASE: 'Цена',
                ADJS: 'Коррекция',
                COST: 'Стоимость',
                PAID: 'Оплачено',
                NAME: 'ФИО',
                TELN: 'Телефон',
                FNOT: 'Примечание',
                CITY: 'Город'
            },
            VAR002: { OK: 'Подтвердить', NO: 'Отменить' },
            VAR003: { DELETE: 'Удалить', UPDATE: 'Изменить', ADD: 'Добавить' }
        },
        LOCALE: 'ru-Ru'
    },
    DATA: { CORE: { isMouseDown: false, } }
};

// UTILS.DEEPF_REEZE(GL.CONST);