/*jshint esversion: 6 */
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
    
                LEFT_CLICK: 'onLeftClick',
            },
    
            CALENDAR: {
    
                NEW_MONTH: {
                    SUCCESS: 'onMonthChangeSuccess'
                },

                DIALOG_SAVE: 'onSaveClick',
    
                RC_MENU: {//TODO: rename for using in global scope

                    RC_MENU_OPEN: 'onrightclickmenu',
                    RCM_ITEM_ADD_GUEST: 'onRCMitemAddClick',
                    RCM_ITEM_DEL_GUEST: 'onRCMitemDelClick',
                    RCM_ITEM_UPD_GUEST: 'onRCMitemUpdClick',
                },

                DB: {
                    
                    INITIALIZATION: {
                        SUCCESS: 'onDBinitializationSuccess'
                    },

                    CF001: {
                        SELECT: {
                            SUCCESS: 'onDBcf001SelectSuccess',
                            ERROR: 'onDBcf001SelectError'
                        },
                        UPDATE: {
                            SUCCESS: 'onDBcf001SelectSuccess',
                            ERROR: 'onDBcf001SelectError'
                        }
                    },
                    RM001: {
                        SELECT: {
                            SUCCESS: 'onDBrm001SelectSuccess',
                            ERROR: 'onDBrm001SelectError'
                        }
                    },
                    GL001: {
                        INSERT: {
                            SUCCESS: 'onDBgl001InsertSuccess',
                            ERROR: 'onDBgl001InsertError'
                        },
                        SELECT: {
                            SUCCESS: 'onDBgl001SelectSuccess',
                            ERROR: 'onDBgl001SelectError'
                        },
                        UPDATE: {
                            SUCCESS: 'onDBgl001UpdateSuccess',
                            ERROR: 'onDBgl001UpdateError'
                        },
                        DELETE: {
                            SUCCESS: 'onDBgl001DeleteSuccess',
                            ERROR: 'onDBgl001DeleteError'
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
                MONT: { key: 'mont', txt: 'Месяц' }, // 'person-cell-month',
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

UTILS.DEEPF_REEZE(GL.CONST);