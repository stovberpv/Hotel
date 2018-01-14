/**
 * Область извечного зла...
 */
const GL = {

    CONST: {

        CSS: {

            CORE: {
                CLASS_NAV_EL_SEL: 'nav-el-sel',
                CLASS_VC_DW_SHOW: 'vc-data-wrapper-show',
            },
    
            CALENDAR: {
                CLASS_SELECTED: "selected", //выделен
                CLASS_RESERVED: "reserved", //зарезервирован
                CLASS_ADJACENT: "adjacent", //смежный
                CLASS_REDEEMED: "redeemed", //выкупленный
                CLASS_VIEWFIX: "view-fix", // выделен
                CLASS_VIEW: "view", //предпросмотр
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

                PICK_CALENDAR: {
                    SUCCESS: 'onPickCalendarSuccess'
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
                },
            },
        },
    },

    DATA: {

        CORE: { },

        CALENDAR: {

            rooms: [],
            isMouseDown: false,
            isSelected: false,
        },
    },
}

UTILS.DEEPF_REEZE(GL.CONST);
Object.freeze(GL.DATA.CORE);
Object.freeze(GL.DATA.CALENDAR);