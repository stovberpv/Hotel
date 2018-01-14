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
    
                RC_MENU: {

                    RC_MENU_OPEN: 'rcmenuOpen',
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
                    ADD: 1,
                    UPD: 0,
                    DEL: -1,
                    PICK_CALENDAR: 666,
                },
            },
        },

        SCHEMA: {
            GUEST: {//FIX: rename values + CSS
                YEAR: 'person-cell-year',
                MONT: 'person-cell-month',
                UNID: 'person-cell-id',
                DBEG: 'person-cell-checkin', 
                DEND: 'person-cell-checkout', 
                DAYS: 'person-cell-rest-days', 
                ROOM: 'person-cell-room-number', 
                BASE: 'person-cell-room-baseline', 
                ADJS: 'person-cell-room-adjustment', 
                COST: 'person-cell-room-cost', 
                PAID: 'person-cell-room-paid', 
                NAME: 'person-cell-name', 
                TELN: 'person-cell-telephone-number', 
                FNOT: 'person-cell-footnote', 
                CITY: 'person-cell-city', 
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
}

UTILS.DEEPF_REEZE(GL.CONST);