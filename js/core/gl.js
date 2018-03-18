/*jshint esversion: 6 */
/*jshint -W030 */

(function () { "use strict"; })();

const GL = {
    CONST: {
        CSS: { CORE: { CLASS: { NAV_EL_SEL: 'nav-el-sel', VC_DW_SHOW: 'vc-data-wrapper-show', } } },
        DATA_ATTR: {
            JOURNAL: {
                VIEW: { FIX: 'fix', HOV: 'hov' },
                STATUS: { SELECTED: "selected", /*выделен*/ RESERVED: "reserved", /*зарезервирован*/ ADJACENT: "adjacent", /*смежный*/ REDEEMED: "redeemed", /*выкуплен*/ }
            }
        },
        EVENTS: {
            CORE: { LEFT_CLICK: 'leftClick', },
            JOURNAL: { RC_MENU: { ADD: 'rcmItemAddClick', DEL: 'rcmItemDelClick', UPD: 'rcmItemUpdClick', }, },
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
            LEVEL: { DEBUG: "debug", ERROR: "error", INFO: "info", WARN: "warn" },
            ID: {
                A000: { TITLE: 'Invalid function call', GIST: 'Invalid function call' },
                A001: { TITLE: 'Error while obtaining data', GIST: '' },
                A002: { TITLE: 'No Id', GIST: '' },
                A003: { TITLE: 'Fields was updated', GIST: '' },
                B000: { TITLE: 'General fault', GIST: 'General fault' },
                B001: { TITLE: 'DB response', GIST: 'Successful' },
                B002: { TITLE: 'DB response', GIST: 'Error' },
                B003: { TITLE: 'DB response', GIST: 'Processing going on' },
                C000: { TITLE: '', GIST: '' },
                C001: { TITLE: '', GIST: '' },
                D000: { TITLE: '', GIST: '' },
                D001: { TITLE: '', GIST: '' },
            }
        },
        LOCALIZABLE: {
            MSG000: "",
            MSG001: "Вы действительно хотите удалить запись под номером {1}?\nДействие нельзя будет отменить!",
            VAR000: "",
            VAR001: {
                YEAR: "Год",
                MNTH: "Месяц",
                UNID: "Идентиф",
                DBEG: "ДатЗаез",
                DEND: "ДатВыез",
                DAYS: "ДнейОтд",
                ROOM: "Комната",
                BASE: "БазЦена",
                ADJS: "Коррект",
                COST: "Стоимос",
                PAID: "Оплачен",
                NAME: "ФИО",
                TELN: "Телефон",
                FNOT: "Примеча",
                CITY: "Город"
            },
            VAR002: { OK: "Подтвердить", NO: "Отменить" },
            VAR003: { DELETE: "Удалить", UPDATE: "Изменить", ADD: "Добавить" }
        },
        LOCALE: "ru-Ru"
    },
    DATA: { CORE: { isMouseDown: false, } }
};

// UTILS.DEEPF_REEZE(GL.CONST);