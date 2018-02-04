/*jshint esversion: 6 */
/*jshint -W030 */
(function () { "use strict";})();
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
    
                RC_MENU: {

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
                    ADD: { key: 'add', txt: 'Добавить' },
                    UPD: { key: 'upd', txt: 'Изменить' },
                    DEL: { key: 'del', txt: 'Удалить' },
                    EXT: { key: 'ext', txt: '' },
                    PICK_PERIOD: 'pick-period'
                },
            },

            UTILS: {
                ONE_DAY: 86400000
            }
        },

        PREFIX: {
            SELECTION_GROUP: 'sel-group',
            CONFIRM_DIALOG: 'confirm-dialog',
            PICK_PERIOD: 'pick-period',
            GUEST_CARD: 'guest-card',
            PERSON: {
                CELL: 'percon-cell',
                FIELD: 'person-field'
            }
        },

        LOG: {
            LEVEL: {
                DEBUG: "debug",
                ERROR: "error",
                INFO: "info",
                WARN: "warn"
            },
            ID: { // TODO correct grammar
                A000: { TITLE: 'Invalid function call', GIST: 'Invalid function call' },
                A001: { TITLE: 'Error while obtaining data', GIST: '' },
                A002: { TITLE: 'No Id', GIST: '' },
                A003: { TITLE: 'Data was updated', GIST: '' },
                B000: { TITLE: '', GIST: '' },
                B001: { TITLE: 'Data from DB was fetched', GIST: '' },
                B002: { TITLE: 'Data from DB was not fetched', GIST: '' },
                B003: { TITLE: 'Data in DB was updated', GIST: '' },
                B004: { TITLE: 'Data in DB was not updated', GIST: '' },
                B005: { TITLE: 'Data was inserted in DB', GIST: '' },
                B006: { TITLE: 'Data was not inserted in DB', GIST: '' },
                B007: { TITLE: 'Data was deleted from DB', GIST: '' },
                B008: { TITLE: 'Data was not deleted from DB', GIST: '' },
                C000: { TITLE: '', GIST: '' },
                C001: { TITLE: '', GIST: '' },
                D000: { TITLE: '', GIST: '' },
                D001: { TITLE: '', GIST: '' },
            }
        },

        LOCALIZABLE: { // TODO rename MSG
            MSG001: "Вы действительно хотите удалить запись под номером {1}?\nДействие нельзя будет отменить!",
            MSG002: {
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
            MSG003: {
                OK: "Подтвердить",
                NO: "Отменить"
            },
            MSG004: {
                DELETE: "Удалить",
                UPDATE: "Изменить",
                ADD: "Добавить"
            },
            MSG005: "",
            MSG006: "",
            MSG007: "",
            MSG008: "",
            MSG009: "",
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