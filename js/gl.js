/**
 * Область зла. Глоабльные перменные.
 */
const gl = {

    /*----------------------------------------------------------------------------------------
        Навигационное меню
    ----------------------------------------------------------------------------------------*/
    /** 
    * Клаасы-переключатели CSS стилей
    */
    class_navElSel: 'nav-el-sel',
    class_VCDWShow: 'vc-data-wrapper-show',

    /** 
    * Список ID всех элементов навигации
    */
    navEl: [
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
    chains: [
        { dataWrapper: 'vc-dw-1', navEl: 'nav-el-calendar' },
        { dataWrapper: 'vc-dw-2', navEl: 'nav-el-contacts' },
        { dataWrapper: 'vc-dw-3', navEl: 'nav-el-diagrams' },
        { dataWrapper: 'vc-dw-4', navEl: 'nav-el-settings' },
        { dataWrapper: 'vc-dw-5', navEl: 'nav-el-infopage' },
        { dataWrapper: 'vc-dw-6', navEl: 'nav-el-signout' }
    ],


    /*----------------------------------------------------------------------------------------
        Календарь 
    ----------------------------------------------------------------------------------------*/
    rooms: [],
    monthNames: ["", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    class_selected: "selected", //выделен
    class_reserved: "reserved", //зарезервирован
    class_adjacent: "adjacent", //смежный
    class_redeemed: "redeemed", //выкупленный
    class_view: "view", //предпросмотр
    class_viewfix: "view-fix", // выделен
    intent_add: 1,
    intent_upd: 0,
    intent_del: -1,

    /*----------------------------------------------------------------------------------------
        Календарь выделение
    ----------------------------------------------------------------------------------------*/
    isMouseDown: false,
    isSelected: false,

    //FIX: rename it
    events: {
        calendar: {
            DatePick: 'C-DP',
            DialogSave: 'inout-dialog-ok-button',
        },
        rcMenu: {
            RCMenu: 'rcmenu-in-calendar',
            RCMItemAddGuest: 'rcitem-add-guest',
            RCMItemDelGuest: 'rcitem-del-guest',
            RCMItemUpdGuest: 'rcitem-upd-guest',
        },
        lefClick: 'left-mouse-clicked',
        ajax: {
            calendar: {
                init: {
                    Success:'ACI-success'
                }
            }
        }
    }
}