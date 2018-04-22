/*jshint esversion: 6 */
/*jshint -W030 */

'use strict';

const GL = {
    CONST: {
        EVENTS: {
            CORE: { LEFT_CLICK: 'leftClick', },
            JOURNAL: { NEW: 'newGuest', RC_MENU: { ADD: 'rcmItemAddClick', DEL: 'rcmItemDelClick', UPD: 'rcmItemUpdClick', }, },
            CONTACT: { NEW: 'newContact' },
            DIAGRAM: { UPD: 'updateDiagram' },
            TODOLIST: { FINISH: 'finish', DELAY: 'delay', DELETE: 'delete' }
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
            }
        },
        LOCALIZABLE: {
            MSG000: 'Выйти из системы?\n\rВсе не сохраненные данные будут утеряны',
            MSG001: 'Вы действительно хотите удалить запись под номером {1}?\n\rДействие нельзя будет отменить!',
            VAR001: {
                YEAR: 'Год',
                MNTH: 'Месяц',
                UNID: 'Идентиф',
                DBEG: 'ЗАЕЗД',
                DEND: 'ВЫЕЗД',
                DAYS: 'ДНЕЙ',
                ROOM: 'НОМЕР',
                BASE: 'ЦЕНА',
                ADJS: 'КОРРЕКЦИЯ',
                COST: 'СТОИМОСТЬ',
                PAID: 'ОПЛАЧЕНО',
                NAME: 'ФИО',
                TELN: 'ТЕЛЕФОН',
                FNOT: 'ПРИМЕЧАНИЕ',
                CITY: 'ГОРОД'
            },
            VAR002: { OK: 'Подтвердить', NO: 'Отменить' },
            VAR003: { DELETE: 'Удалить', UPDATE: 'Изменить', ADD: 'Добавить' }
        },
        LOCALE: 'ru-Ru'
    },
    DATA: { CORE: { isMouseDown: false, } }
};