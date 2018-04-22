const NAVIGATION = {

    navEl: [ 'nav-el-calendar', 'nav-el-contacts', 'nav-el-diagrams', 'nav-el-todolist', 'nav-el-settings', 'nav-el-signout' ],

    chains: [
        { dataWrapper: 'vc-dw-1', navEl: 'nav-el-calendar', haveView: true },
        { dataWrapper: 'vc-dw-2', navEl: 'nav-el-contacts', haveView: true },
        { dataWrapper: 'vc-dw-3', navEl: 'nav-el-diagrams', haveView: true },
        { dataWrapper: 'vc-dw-4', navEl: 'nav-el-todolist', haveView: true },
        { dataWrapper: 'vc-dw-5', navEl: 'nav-el-settings', haveView: true },
        { dataWrapper: 'vc-dw-6', navEl: 'nav-el-signout',  haveView: false }
    ],

    /**
     * Группа обработки оберток данных, которые отображаются в
     * контейнере данных.
     * Формирование экземпляра класса для обертки.
     * Вызов методов формирования и заполнения данных для
     * сформированных экземпляров, если они не были вызваны ранее.
     */
    wrapper: {

        /**
         * Создание инстанции класса для обертки
         */
        getInstance: function (dw) {

            switch (dw) {
                case this.chains.dataWrapper: return new Journal();
                case this.chains.dataWrapper: return new Contacts();
                case this.chains.dataWrapper: return new Diagrams();
                case this.chains.dataWrapper: return new ToDoList();
                case this.chains.dataWrapper: return new Settings();
                case this.chains.dataWrapper: return new SignOut();
                default: break;
            }
        },

        /**
         * Определение соответствующей обертки данных для
         * элемента навигации.
         */
        getWrapperId: function (navEl) { for (let chain of NAVIGATION.chains) { if (chain.navEl === navEl) return chain.dataWrapper; } },

        /**
         * 
         */
        haveView: function (navEl) { for (let chain of NAVIGATION.chains) { if (chain.navEl === navEl) return chain.haveView; } },

        /**
         * Определение была ли обертка заполнена.
         *
         * Для первого вызова обертка будет пустой
         */
        isEmpty: function (wrapper) { return document.getElementById(wrapper).childElementCount ? false : true; },

        /**
         * Заполняем обертку данными, если она пустая
         */
        fill: function (navEl) {

            var dw = this.getWrapperId(navEl);
            if (this.isEmpty(dw)) {
                var instance = this.getInstance(dw);
                instance.bind(document.getElementById(dw));
                instance.init();
            }
        },

        /**
         * Отображает обертку
         */
        show: function (navEl) { document.getElementById(this.getWrapperId(navEl)).classList.add('visible'); },

        /**
         * Скрывает обертку
         */
        hide: function () {

            var mapped = document.querySelectorAll(`#view-container .visible`);
            mapped != null && mapped.forEach(el => { el.classList.remove('visible'); });
        }
    },

    /**
     * Группа обработки контейнера.
     */
    container: {

        /**
         * Скрывает контейнер
         */
        hide: function () { document.getElementById('view-container').classList.remove('visible'); },

        /**
         * Отображает контейнер
         */
        show: function () { document.getElementById('view-container').classList.add('visible'); },

        /**
         * Скрывает контейнер.
         * Вызывает процедуру заполнения контейнера.
         * Выводит на экран обертку данных контейнера.
         * Выводит на экран уже сформированный контейнер.
         */
        toggle: function (navEl, isSelf) {

            this.hide();
            NAVIGATION.wrapper.hide();

            if (isSelf) return;

            NAVIGATION.wrapper.fill(navEl);
            NAVIGATION.wrapper.show(navEl);
            this.show();
        }
    },

    /**
     * Группа слушателей
     */
    listeners: {

        /**
         * Обработка "Мышь отпущена" на странице
         */
        mouseUp: function (e) { GL.DATA.CORE.isMouseDown = false; },

        /**
         * Обработка ПКМ
         */
        ctmClick: function (e) { e.preventDefault(); return; },

        /**
         * Обработка ЛКМ
         */
        windowClick: function (e) { EVENT_BUS.dispatch(GL.CONST.EVENTS.CORE.LEFT_CLICK); },

        /**
         * Навигационное меню.
         * ЛКМ в области.
         */
        navMenuClick: function (e) { },

        /**
         * Навигационное меню.
         * ЛКМ на элементе.
         * Нажатие на навигацонные элементы внутри меню.
         * Переключает класс определяющий выделенный элемент.
         * Вызывает процедуры обработки контейнера.
         */
        navElClick: function (e) {

            let itemId = e.currentTarget.id;

            if (NAVIGATION.wrapper.haveView(itemId)) {
                document.querySelectorAll(`#nav-menu .nav-el-sel`).forEach(el => { (el.id !== itemId) && el.classList.remove('nav-el-sel'); });
                let isSelf = !e.currentTarget.classList.toggle('nav-el-sel');
                NAVIGATION.container.toggle(itemId, isSelf);
            } else {
                NAVIGATION.wrapper.fill(itemId);
            }
        },

        /**
         * Определяет и формирует список элементов для которых необходимо добавить
         * обработчики событий.
         * Добавляется обработчик на нажатие в области навигационного меню.
         * Добавляется общий обработчик на навигацонные элементы внутри меню.
         *
         */
        onLoad: function (e) { NAVIGATION.navEl.forEach(navEl => { document.getElementById(navEl).addEventListener('click', this.navElClick); }); },
    }
};