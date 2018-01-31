/*jshint esversion: 6 */
/*jshint -W030 */
(function () {
    "use strict";
})();
/**
 * Область извечного зла...
 */
const GL = {

    CONST: {

        CSS: {

            CORE: {
                CLASS: {
                    NAV_EL_SEL: 'nav-el-sel',
                    VC_DW_SHOW: 'vc-data-wrapper-show',
                }
            },
    
            CALENDAR: {
                CLASS: {
                    SELECTED: "selected", //выделен
                    RESERVED: "reserved", //зарезервирован
                    ADJACENT: "adjacent", //смежный
                    REDEEMED: "redeemed", //выкупленный
                    VIEW_FIX: "view-fix", // выделен
                    VIEW: "view", //предпросмотр
                }
            },
        },

        EVENTS: {

            CORE: {
    
                LEFT_CLICK: 'leftClick',
            },
    
            CALENDAR: {
    
                NEW_MONTH: {
                    SUCCESS: 'monthChangeSuccess'
                },

                DIALOG_SAVE: 'saveClick',
    
                RC_MENU: {//TODO: rename for using in global scope

                    RC_MENU_OPEN: 'rcmClick',
                    RCM_ITEM_ADD_GUEST: 'rcmItemAddClick',
                    RCM_ITEM_DEL_GUEST: 'rcmItemDelClick',
                    RCM_ITEM_UPD_GUEST: 'rcmItemUpdClick',
                },

                DB: {
                    
                    INITIALIZATION: {
                        SUCCESS: 'dbInitializationSuccess'
                    },

                    CF001: {
                        SELECT: {
                            SUCCESS: 'dbCf001SelectSuccess',
                            ERROR: 'dbCf001SelectError'
                        },
                        UPDATE: {
                            SUCCESS: 'dbCf001SelectSuccess',
                            ERROR: 'dbCf001SelectError'
                        }
                    },
                    RM001: {
                        SELECT: {
                            SUCCESS: 'dbRm001SelectSuccess',
                            ERROR: 'DBRm001SelectError'
                        }
                    },
                    GL001: {
                        INSERT: {
                            SUCCESS: 'dbGl001InsertSuccess',
                            ERROR: 'dbGl001InsertError'
                        },
                        SELECT: {
                            SUCCESS: 'dbGl001SelectSuccess',
                            ERROR: 'dbGl001SelectError'
                        },
                        UPDATE: {
                            SUCCESS: 'dbGl001UpdateSuccess',
                            ERROR: 'dbGl001UpdateError'
                        },
                        DELETE: {
                            SUCCESS: 'dbGl001DeleteSuccess',
                            ERROR: 'dbGl001DeleteError'
                        },
                    },
                }
            },
        },

        VALUES: {

            CORE: {
                /** 
                * Список ID всех элементов навигации
                */
                NAV_El: [
                    'nav-el-calendar',
                    'nav-el-contacts',
                    'nav-el-diagrams',
                    'nav-el-settings',
                    'nav-el-infopage',
                    'nav-el-signout'
                ],
    
                /** 
                * Соответствие обертки данных своему элементу навигации
                */
                CHAINS: [
                    { DATA_WRAPPER: 'vc-dw-1', NAV_EL: 'nav-el-calendar' },
                    { DATA_WRAPPER: 'vc-dw-2', NAV_EL: 'nav-el-contacts' },
                    { DATA_WRAPPER: 'vc-dw-3', NAV_EL: 'nav-el-diagrams' },
                    { DATA_WRAPPER: 'vc-dw-4', NAV_EL: 'nav-el-settings' },
                    { DATA_WRAPPER: 'vc-dw-5', NAV_EL: 'nav-el-infopage' },
                    { DATA_WRAPPER: 'vc-dw-6', NAV_EL: 'nav-el-signout' }
                ],
            },
    
            CALENDAR: {
    
                MONTH_NAMES: ["", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    
                INTENT: {
                    ADD: { key: 'add', txt: 'Добавить', toString: function() { return this.txt; }},
                    UPD: { key: 'upd', txt: 'Изменить', toString: function() { return this.txt; }},
                    DEL: { key: 'del', txt: 'Удалить', toString: function() { return this.txt; }},
                    EXT: { key: 'ext', txt: '', toString: function() { return this.txt; }},
                    PICK_PERIOD: 'pick-period',
                    toString: function () { return 'intent'; }
                },
            },
        },

        SCHEMA: {
            GUEST: {//FIX: rename values + CSS
                YEAR: { key: 'year', txt: 'Год' }, // 'person-cell-year',
                MNTH: { key: 'mnth', txt: 'Месяц' }, // 'person-cell-month',
                UNID: { key: 'unid', txt: 'Идентиф' }, // 'person-cell-id',
                DBEG: { key: 'dbeg', txt: 'ДатЗаез' }, // 'person-cell-checkin', 
                DEND: { key: 'dend', txt: 'ДатВыез' }, // 'person-cell-checkout', 
                DAYS: { key: 'days', txt: 'ДнейОтд' }, // 'person-cell-rest-days', 
                ROOM: { key: 'room', txt: 'Комната' }, // 'person-cell-room-number', 
                BASE: { key: 'base', txt: 'БазЦена' }, // 'person-cell-room-baseline', 
                ADJS: { key: 'adjs', txt: 'Коррект' }, // 'person-cell-room-adjustment', 
                COST: { key: 'cost', txt: 'Стоимос' }, // 'person-cell-room-cost', 
                PAID: { key: 'paid', txt: 'Оплачен' }, // 'person-cell-room-paid', 
                NAME: { key: 'name', txt: 'ФИО' }, // 'person-cell-name', 
                TELN: { key: 'teln', txt: 'Телефон' }, // 'person-cell-telephone-number', 
                FNOT: { key: 'fnot', txt: 'Примеча' }, // 'person-cell-footnote', 
                CITY: { key: 'city', txt: 'Город' } // 'person-cell-city', 
            }
        },

        PREFIX: {
            PICK_PERIOD: 'pick-period',
            CONFIRM_DIALOG: 'confirm-dialog',
            GUEST_CARD: 'guest-card'
        },

        ERROR: {
            LEVEL: {
                ERROR: 0,
                WARN: 1,
                INFO: 2,
                VERBOSE: 3,
                DEBUG: 4,
                SILLY: 5
            },
            ID: {
                A000: '',
                A001: '',
                A002: '',
                B000: '',
                B001: '',
                B002: '',
                C000: '',
                C001: '',
                C002: ''
            }
        }
    },

    DATA: {

        CORE: {
            isMouseDown: false,
        },

        CALENDAR: {

            rooms: [],
            isSelected: false,
        },
    },
};

// UTILS.DEEPF_REEZE(GL.CONST);