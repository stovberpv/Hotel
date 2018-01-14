'use strict';

/**
 * Группа обработки оберток данных, которые отображаются в
 * контейнере данных.
 * Формирование экземпляра класса для обертки.
 * Вызов методов формирования и заполнения данных для 
 * сформированных экземпляров, если они не были вызваны ранее.
 */
const WRAPPER = {

    /**
     * Создание инстанции класса для обертки
     */
    getInstance: function (dw) {

        const C = GL.CONST.VALUES.CORE.CHAINS;
        switch (dw) {
            case C[0].DATA_WRAPPER: return new Calendar();
            case C[1].DATA_WRAPPER: return new Contacts();
            case C[2].DATA_WRAPPER: return new Diagrams();
            case C[3].DATA_WRAPPER: return new Settings();
            case C[4].DATA_WRAPPER: return new InfoPage();
            case C[5].DATA_WRAPPER: return new SignOut(); 
            default: break;
        }
    },

    /**
     * Определение соответствующей обертки данных для
     * элемента навигации.
     */
    getWrapperId: function (navEl) {

        const C = GL.CONST.VALUES.CORE.CHAINS;
        for (let i in C) {
            const CHAIN = C[i];
            if (CHAIN.NAV_EL == navEl) return CHAIN.DATA_WRAPPER;
        }
    },

    /**
     * Определение была ли обертка заполнена.
     * 
     * Для первого вызова обертка будет пустой
     */
    isEmpty: function (wrapper) {
        return document.getElementById(wrapper).childElementCount ? false : true;
    },

    /**
     * Заполняем обертку данными, если она пустая
     */
    fill: function (navEl) {

        var dw = this.getWrapperId(navEl);
        if (this.isEmpty(dw)) {
            var inst = this.getInstance(dw);
            inst.bind(document.getElementById(dw));
            inst.init();
        }
    },

    /**
     * Отображает обертку
     */
    show: function (navEl) {

        const CL = GL.CONST.CSS.CORE.CLASS.VC_DW_SHOW;
        var dw = this.getWrapperId(navEl);
        document.getElementById(dw).classList.add(CL);
    },

    /**
     * Скрывает обертку
     */
    hide: function () {

        const CL = GL.CONST.CSS.CORE.CLASS.VC_DW_SHOW;
        var el = document.getElementById('view-container').getElementsByClassName(CL);
        for (let i = 0; i < el.length; i++) {
            const el = el[i];
            el.classList.remove(CL);
        }
    }
}

/**
 * Группа обработки контейнера.
 */
const CONTAINER = {

    /**
     * Скрывает контейнер.
     * Вызывает процедуру заполнения контейнера.
     * Выводит на экран обертку данных контейнера.
     * Выводит на экран уже сформированный контейнер.
     */
    toggle: function (el, isSelf) {

        this.hide();
        WRAPPER.hide();
        if (!isSelf) {
            WRAPPER.fill(el.parentNode.id);
            WRAPPER.show(el.parentNode.id);
            this.show();
        }
    },

    /**
     * Скрывает контейнер
     */
    hide: function () {

        document.getElementById('view-container').style.display = 'none';
    },

    /**
     * Отображает контейнер
     */
    show: function () {

        document.getElementById('view-container').style.display = 'initial';
    }

}

/**
 * Группа слушателей
 */
const LISTENERS = {

    /**
     * Определяет и формирует список элементов для которых необходимо добавить
     * обработчики событий.
     * Добавляется обработчик на нажатие в области навигационного меню.
     * Добавляется общий обработчик на навигацонные элементы внутри меню.
     * 
     */
    onLoad: function (e) {

        // Навигационное меню
        document.getElementById('nav-menu').addEventListener('click', LISTENERS.navMenuClick);

        const EL = GL.CONST.VALUES.CORE.NAV_El;
        const NAV_EL =
            [
                { el: EL[0], src: document.getElementById(EL[0]) },
                { el: EL[1], src: document.getElementById(EL[1]) },
                { el: EL[2], src: document.getElementById(EL[2]) },
                { el: EL[3], src: document.getElementById(EL[3]) },
                { el: EL[4], src: document.getElementById(EL[4]) },
                { el: EL[5], src: document.getElementById(EL[5]) }
            ];

        for (const EL of NAV_EL) {
            EL.src.addEventListener('click', LISTENERS.navElClick);
        }
    },

    /**
     * Обработка "Мышь отпущена" на странице
     */
    mouseUp: function (e) {

        GL.DATA.CORE.isMouseDown = false;
    },

    /**
     * Обработка ПКМ
     */
    ctmClick: function (e) {

        e.preventDefault();
        return;
    },

    /**
     * Обработка ЛКМ
     */
    windowClick: function (e) {

        EVENT_BUS.dispatch(GL.CONST.EVENTS.CORE.LEFT_CLICK);
    },

    /**
     * Навигационное меню.
     * ЛКМ в области.
     */
    navMenuClick: function (e) {

        const CL = GL.CONST.CSS.CORE.CLASS.NAV_EL_SEL;
        var el = document.getElementById('view-container').getElementsByClassName(CL);
        for (let i = 0; i < el.length; i++) {
            if (!e.target.closest('#' + el[i].parentNode.id)) {
                el[i].classList.remove(CL);
            }
        }
    },

    /**
     * Навигационное меню.
     * ЛКМ на элементе.
     * Нажатие на навигацонные элементы внутри меню. 
     * Переключает класс определяющий выделенный элемент.
     * Вызывает процедуры обработки контейнера.
     */
    navElClick: function (e) {

        const CL = GL.CONST.CSS.CORE.CLASS.NAV_EL_SEL;
        var svg = document.getElementById('nav-container').getElementsByTagName('svg'),
            el = svg[0],
            isSelf = !el.classList.toggle(CL);

        CONTAINER.toggle(el, isSelf);
    }
};

(function (window, document, undefined) {

    document.addEventListener('DOMContentLoaded', LISTENERS.onLoad);
    document.addEventListener('mouseup', LISTENERS.mouseUp);

    window.addEventListener('contextmenu', LISTENERS.ctmClick, false);
    window.addEventListener('click', LISTENERS.windowClick, false);

    EVENT_BUS.init();

})(window, document);