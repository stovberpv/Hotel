'use strict';

/**
 * Группа обработки оберток данных, которые отображаются в
 * контейнере данных.
 * Формирование экземпляра класса для обертки.
 * Вызов методов формирования и заполнения данных для 
 * сформированных экземпляров, если они не были вызваны ранее.
 */
const wrapper = {

    /**
     * Создание инстанции класса для обертки
     */
    getInstance: function (dw) {

        switch (dw) {
            case gl.chains[0].dataWrapper:
                return new Calendar();
            case gl.chains[1].dataWrapper:
                return new Contacts();
            case gl.chains[2].dataWrapper:
                return new Diagrams();
            case gl.chains[3].dataWrapper:
                return new Settings();
            case gl.chains[4].dataWrapper:
                return new InfoPage();
            case gl.chains[5].dataWrapper:
                return new SignOut();
            default:
                break;
        }
    },

    /**
     * Определение соответствующей обертки данных для
     * элемента навигации.
     */
    getWrapperId: function (navEl) {
        for (let i in gl.chains) {
            const chain = gl.chains[i];
            if (chain.navEl == navEl) return chain.dataWrapper;
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

        var dw = this.getWrapperId(navEl);
        document.getElementById(dw).classList.add(gl.class_VCDWShow);
    },

    /**
     * Скрывает обертку
     */
    hide: function () {

        var class_VCDWShow = document.getElementById('view-container').getElementsByClassName(gl.class_VCDWShow);
        for (let i = 0; i < class_VCDWShow.length; i++) {
            const el = class_VCDWShow[i];
            el.classList.remove(gl.class_VCDWShow);
        }
    }
}

/**
 * Группа обработки контейнера.
 */
const container = {

    /**
     * Скрывает контейнер.
     * Вызывает процедуру заполнения контейнера.
     * Выводит на экран обертку данных контейнера.
     * Выводит на экран уже сформированный контейнер.
     */
    toggle: function (el, isSelf) {

        this.hide();
        wrapper.hide();
        if (!isSelf) {
            wrapper.fill(el.parentNode.id);
            wrapper.show(el.parentNode.id);
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
const listeners = {

    /**
     * Определяет и формирует список элементов для которых необходимо добавить
     * обработчики событий.
     * Добавляется обработчик на нажатие в области навигационного меню.
     * Добавляется общий обработчик на навигацонные элементы внутри меню.
     * 
     */
    onLoad: function (e) {

        // Навигационное меню
        document.getElementById('nav-menu').addEventListener('click', listeners.navMenuClick);

        const navEl = [{
                el: gl.navEl[0],
                src: document.getElementById(gl.navEl[0])
            },
            {
                el: gl.navEl[1],
                src: document.getElementById(gl.navEl[1])
            },
            {
                el: gl.navEl[2],
                src: document.getElementById(gl.navEl[2])
            },
            {
                el: gl.navEl[3],
                src: document.getElementById(gl.navEl[3])
            },
            {
                el: gl.navEl[4],
                src: document.getElementById(gl.navEl[4])
            },
            {
                el: gl.navEl[5],
                src: document.getElementById(gl.navEl[5])
            }
        ]

        for (let i = 0; i < navEl.length; i++) {
            navEl[i].src.addEventListener('click', listeners.navElClick);
        }
    },

    /**
     * Обработка "Мышь отпущена" на странице
     */
    mouseUp: function (e) {

        gl.isMouseDown = false;
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

        EventBus.dispatch(gl.events.lefClick);
        // var rcmenu = document.getElementById('rcmenu');
        // if (rcmenu) rcmenu.unbind();
    },

    /**
     * Навигационное меню.
     * ЛКМ в области.
     */
    navMenuClick: function (e) {

        var class_navElSel = this.getElementsByClassName(gl.class_navElSel);
        for (let i = 0; i < class_navElSel.length; i++) {
            if (!e.target.closest('#' + class_navElSel[i].parentNode.id)) {
                class_navElSel[i].classList.remove(gl.class_navElSel);
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

        var svg = this.getElementsByTagName('svg'),
            el = svg[0],
            isSelf = !el.classList.toggle(gl.class_navElSel);

        container.toggle(el, isSelf);
    }
};

(function (window, document, undefined) {

    document.addEventListener('DOMContentLoaded', listeners.onLoad);
    document.addEventListener('mouseup', listeners.mouseUp);

    window.addEventListener('contextmenu', listeners.ctmClick, false);
    window.addEventListener('click', listeners.windowClick, false);

    EventBus.init();

})(window, document);