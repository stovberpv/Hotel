'use strict';

const gl = {

    /*----------------------------------------------------------------------------------------
    НАЧАЛО --- Навигационное меню
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
        КОНЕЦ --- Навигационное меню
    ----------------------------------------------------------------------------------------*/


    /*----------------------------------------------------------------------------------------
        НАЧАЛО --- Меню по правой кнопке мыши 
    ----------------------------------------------------------------------------------------*/
    rcmenu: undefined,
    /*----------------------------------------------------------------------------------------
        КОНЕЦ --- Меню по правой кнопке мыши
    ----------------------------------------------------------------------------------------*/


    /*----------------------------------------------------------------------------------------
        НАЧАЛО --- Календарь 
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
    intent_edit: 0,
    intent_del: -1,
    /*----------------------------------------------------------------------------------------
        КОНЕЦ --- Календарь
    ----------------------------------------------------------------------------------------*/

    /*----------------------------------------------------------------------------------------
        НАЧАЛО --- Календарь выделение
    ----------------------------------------------------------------------------------------*/
    isMouseDown: false,
    isSelected: false,
    /*----------------------------------------------------------------------------------------
        НАЧАЛО --- Календарь выделение
    ----------------------------------------------------------------------------------------*/
}

const selGroup = {

    classId: undefined,

    free: function () {
        this.classId = undefined;
    },

    gen: function () {
        this.classId = 'sel-group-' + Math.ceil((Math.random() * 100000));
    },

    add: function (target) {
        !this.classId && this.gen();
        if (target instanceof jQuery) {
            target.addClass(this.classId);
        } else {
            target.classList.add(this.classId);
        }
        this.enum(this.classId);
    },

    get: function (target) {
        if (target instanceof jQuery) {
            var classId = target.prop("className").match(/\bsel-group-\d+/);
            return classId ? classId[0] : '';
        } else {
            return target.className.match(/\bsel-group-\d+/);
        }
    },

    del: function (target) {
        var classId = this.get(target);
        if (classId) {
            if (target instanceof jQuery) {
                //TODO: del for jQuery
                target.removeClass(classId);
                target.empty();
            } else {
                //FIX: someday do more beautifully
                var group = document.getElementsByClassName(classId);
                for (let i = group.length; i > 0; i--) {
                    if (group[0].id == target.id) {
                        group[0].innerHTML = '';
                        group[0].classList.remove(gl.class_selected);
                        group[0].classList.remove(classId);
                        break;
                    } else {
                        group[0].innerHTML = '';
                        group[0].classList.remove(gl.class_selected);
                        group[0].classList.remove(classId);
                    }
                }
                target.classList.remove(classId);
                target.innerHTML = '';
            }
            this.enum(classId);
        }
    },

    enum: function (classId) {
        var group = document.getElementsByClassName(classId);
        for (let i = 0; i < group.length; i++) {
            group[i].innerHTML = (i + 1);
        }
    }
}

const wrapper = {

    /**
     * Создание инстанции класса для обертки
     */
    getInstance: function (dw) {

        switch (dw) {
            case gl.chains[0].dataWrapper: return new Calendar();
            case gl.chains[1].dataWrapper: return new Contacts();
            case gl.chains[2].dataWrapper: return new Diagrams();
            case gl.chains[3].dataWrapper: return new Settings();
            case gl.chains[4].dataWrapper: return new InfoPage();
            case gl.chains[5].dataWrapper: return new SignOut();
            default: break;
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

const container = {

    /**
     * Процедура обработки контейнера.
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

const listeners = {

    /*----------------------------------------------------------------------------------------
        delegate events 
    ----------------------------------------------------------------------------------------*/
    delegate: function (elSelector, eventName, selector, callback) {
        var element = document.querySelector(elSelector);

        element.addEventListener(eventName, function (event) {
            var possibleTargets = element.querySelectorAll(selector);
            var target = event.target;

            for (var i = 0, l = possibleTargets.length; i < l; i++) {
                var el = target;
                var p = possibleTargets[i];

                while (el && el !== element) {
                    if (el === p) {
                        return callback.call(p, event);
                    }

                    el = el.parentNode;
                }
            }
        });
    },

    
    /** 
     * Отложенное событие на child с возможностью ислючения предков по связке TAG+ID с применением
     * регулярного выражения.
     */
    delegateWithExclude: function (elSelector, eventName, selector, notTag, notSelector, callback) {
        //1. На elSelector вешается обработчик события eventName
        var element = document.querySelector(elSelector);
        element.addEventListener(eventName, function (event) {
                // 2. В котором по selector вытягивабтся все подходящие субэлементы в allTargets
            var allTargets = element.querySelectorAll(selector),
                // 3. Откуда они потом фильтруются функцией excludeClosest в onlyTargets
                onlyTargets = Array.from(allTargets).filter(function (target) {
                    var excludeClosest = function (el, tag, selector) {
                        var parent = el.parentNode.closest(tag);
                        if (!parent) return true;
                        if (parent.id === '') {
                            return excludeClosest(parent, tag, selector);
                        } else if (parent.id.match(selector)) {
                            return false;
                        } else {
                            return excludeClosest(parent, tag, selector);
                        }
                    }
                    return excludeClosest(target, notTag, notSelector);
                });

            // 4. После чего для каждого субэлемента(исключая предка) вызывается событие
            for (let i = 0; i < onlyTargets.length; i++) {
                var el = event.target,
                    p = onlyTargets[i];

                while (el && el !== element) {
                    if (el === p) return callback.call(p, event);
                    el = el.parentNode;
                }
            }
        });
    },

    /*----------------------------------------------------------------------------------------
        document events 
    ----------------------------------------------------------------------------------------*/
    /**
     * Основной слушать. Вызывается при загрузке страницы.
     * 
     * Определяется и формируется список элементов для которых
     * необходимо добавить обработчики событий.
     * Добавляется обработчик на нажатие в области навигационного меню.
     * Добавляется общий обработчик на навигацонные элементы внутри меню.
     * 
     */
    onLoad: function (e) {

        // Навигационное меню
        document.getElementById('nav-menu').addEventListener('click', listeners.navMenuClick);

        const navEl = [
            { el: gl.navEl[0], src: document.getElementById(gl.navEl[0]) },
            { el: gl.navEl[1], src: document.getElementById(gl.navEl[1]) },
            { el: gl.navEl[2], src: document.getElementById(gl.navEl[2]) },
            { el: gl.navEl[3], src: document.getElementById(gl.navEl[3]) },
            { el: gl.navEl[4], src: document.getElementById(gl.navEl[4]) },
            { el: gl.navEl[5], src: document.getElementById(gl.navEl[5]) }
        ]

        for (let i = 0; i < navEl.length; i++) {
            navEl[i].src.addEventListener('click', listeners.navElClick);
        }
    },

    /**
     * 
     */
    mouseUp: function (e) {
        gl.isMouseDown = false;
    },

    /*----------------------------------------------------------------------------------------
        Window events 
    ----------------------------------------------------------------------------------------*/
    ctmClick: function (e) {
        e.preventDefault();
        return;
    },

    windowClick: function (e) {
        if (gl.rcmenu != undefined) {
            gl.rcmenu.unbind();
            gl.rcmenu = undefined;
        }
    },

    /*----------------------------------------------------------------------------------------
        Навигационное меню
    ----------------------------------------------------------------------------------------*/
    /**
     * Нажатие в области навигационного меню. Убирает класс определяющий выделенный элемент.
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
     * Нажатие на навигацонные элементы внутри меню. Переключает класс определяющий выделенный 
     * элемент. Вызывает процедуры обработки контейнера.
     */
    navElClick: function (e) {

        var svg = this.getElementsByTagName('svg'),
            el = svg[0],
            isSelf = !el.classList.toggle(gl.class_navElSel);

        container.toggle(el, isSelf);
    },

    /*----------------------------------------------------------------------------------------
        Календарь
    ----------------------------------------------------------------------------------------*/

    pickCalendarClick: function (e) {

        var pickCalendar = new PickCalendar({
            buttons: {
                ok: function () {

                    var year = document.getElementById('year'),
                        month = document.getElementById('month');
                    var res = pickCalendar.getVal();
                    if (res.year < 1900) {
                        return;
                    }

                    if (year.innerHTML == res.year) {
                        if (month.innerHTML == res.monthName) {
                            pickCalendar.unbind();
                            return;
                        }
                    }

                    pickCalendar.unbind();

                    month.innerHTML = res.monthName;
                    year.innerHTML = res.year;
                    db.gl001.select();
                    db.cf001.update();
                },
                no: function () {
                    pickCalendar.unbind();
                }
            }
        });

        pickCalendar.bind();
        var month = document.getElementById('month'),
            month = gl.monthNames.indexOf(month.innerHTML);
        pickCalendar.setVal({
            year: document.getElementById('year').innerHTML,
            month: utils.overlay(month, '0', 2)
        });

        pickCalendar.show();
    },

    monthLeftClick: function (e) {

        var month = document.getElementById('month'),
            monthNum = gl.monthNames.indexOf(month.innerHTML);
        if (monthNum > 1) {
            monthNum--;
        } else {
            monthNum = 12;
        }
        var monthName = gl.monthNames[monthNum];
        month.innerHTML = monthName;
        db.gl001.select();
    },

    monthRightClick: function (e) {

        var month = document.getElementById('month'),
            monthNum = gl.monthNames.indexOf(month.innerHTML);
        if (monthNum > 11) {
            monthNum = 1;
        } else {
            monthNum++;
        }
        var monthName = gl.monthNames[monthNum];
        month.innerHTML = monthName;
        db.gl001.select();
    },

    addGuestClick: function (e) {

        //  чистим список на добавление перед добавлением новых записей
        var val = {
            intent: gl.intent_add,
            id: -1,
            dayin: this.dayin,
            dayout: this.dayout,
            room: this.room,
            price: "",
            paid: "",
            name: "",
            tel: "",
            fn: "",
            city: ""
        };

        var inOutDialog = new InOutDialog({
            source: document,
            flag: gl.intent_add,
            buttons: {
                btnOk: function () {
                    val = inOutDialog.getVal();
                    db.gl001.insert(val);
                    inOutDialog.unbind();
                },
                btnNo: function () {
                    inOutDialog.unbind();
                }
            }
        });
        inOutDialog.bind();
        inOutDialog.setVal(val);
        inOutDialog.show();
    },

    delGuestClick: function (e) { 

        var intentList = [];
        intentList.push((this.id[0]).substring(1));

        if (intentList.length != 0) {
            var confirmDialog = new ConfirmDialog({
                source: document,
                flag: gl.intent_del,
                dialog: {
                    title: 'Удаление',
                    body: 'Удалить запись под номером №' + intentList[0] + ' из гостевой книги?\r\nДействие нельзя будет отменить!'
                },
                buttons: {
                    btnOk: function () {
                        db.gl001.delete(intentList[0]);
                        confirmDialog.unbind();
                    },
                    btnNo: function () {
                        confirmDialog.unbind();
                    }
                }
            });
            confirmDialog.bind();
            confirmDialog.show();
        }
    },

    updGuestClick: function (e) { 

        var getInnerHTML = function (src, selector) {
            var target = src.querySelector(selector);
            if (target.length == 0) {
                console.log('Error. No elements by selector: ' + selector + ' in ' + src);
                return '';
            } else {
                return target.innerHTML;
            }
        }

        //  чистим список на редактирование перед добавлением новых записей
        var guest = document.querySelector('.book tbody tr#' + this.id[0]);
        if (!guest) {
            console.log('Error. No Id:' + this.id[0]);
            return;
        }

        var val = {
            intent: gl.intent_edit,
            id:     getInnerHTML(guest, '.person-id'),
            dayin:  getInnerHTML(guest, '.person-dayin').substring(3),
            dayout: getInnerHTML(guest, '.person-dayout').substring(3),
            room:   getInnerHTML(guest, '.person-room-num'),  
            price:  getInnerHTML(guest, '.person-room-price'),
            paid:   getInnerHTML(guest, '.person-room-paid'), 
            name:   getInnerHTML(guest, '.person-name'),      
            tel:    getInnerHTML(guest, '.person-tel'),       
            fn:     getInnerHTML(guest, '.person-fn'),        
            city:   getInnerHTML(guest, '.person-city')      
        }

        var inOutDialog = new InOutDialog({
            source: document,
            flag: gl.intent_edit,
            buttons: {
                btnOk: function () {
                    db.gl001.modify(inOutDialog.getVal());
                    inOutDialog.unbind();
                },
                btnNo: function () {
                    inOutDialog.unbind();
                }
            }
        });
        inOutDialog.bind();
        inOutDialog.setVal(val);
        inOutDialog.show();
    },

    calendarTDs: {

        mousedown: function (e) {

            switch (e.which) {
                case 2: return;
                case 3: listeners.RCMenuOpenClick(e, Array.from(e.target.classList)); return;
                default: break;
            }

            // PRESS AND HOVER
            gl.isMouseDown = true;
            if (e.target.classList.length == 0 || e.target.classList.contains(gl.class_selected)) {
                e.target.classList.toggle(gl.class_selected);
            }
            gl.isSelected = e.target.classList.contains(gl.class_selected);
            selGroup.del(this);
            gl.isSelected ? selGroup.add(this) : selGroup.free();

            //VIEW TOGGLE
            let ids = e.target.className.split(' ').filter(function(el) { return el.match(/^N\d+$/g); });
            for (let i = 0; i < ids.length; i++) {
                document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]).forEach(function (el) {
                    el.classList.toggle(ids[i] + '-' + gl.class_viewfix);
                    el.classList.toggle(ids[i] + '-' + gl.class_view);
                });
                document.querySelector('.book > tbody > tr#' + ids[i]).classList.toggle(gl.class_viewfix);
                document.querySelector('.book > tbody > tr#' + ids[i]).classList.toggle(gl.class_view);
            }
        },

        mouseover: function (e) {

            // PRESS AND HOVER
            if (gl.isMouseDown) {
                if (e.target.classList.length == 0 || e.target.classList.contains(gl.class_selected)) {
                    selGroup.del(this);
                    gl.isSelected && selGroup.add(this);
                    e.target.classList.toggle(gl.class_selected, gl.isSelected);
                } else {
                    selGroup.free();
                }
            }

            // VIEW TOGGLE
            let ids = e.target.className.split(' ').filter(function(el) { return el.match(/^N\d+$/g); });
            for (let i = 0; i < ids.length; i++) {
                var els = document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]),
                    viewfix = ids[i] + '-' + gl.class_viewfix,
                    view = ids[i] + '-' + gl.class_view;
                for (let i = 0; i < els.length; i++) {
                    if (!els[i].classList.contains(view)) {
                        els[i].classList.add(view);
                    }
                }
                document.querySelector('.book > tbody > tr#' + ids[i]).classList.add(ids[i] + '-' + gl.class_view);   
            }
            let id = this.id.substring(5);
            document.querySelector('#calendar thead tr:nth-child(2) th#D' + id).classList.add(gl.class_view);
        },

        mouseout: function (e) {

            // VIEW TOGGLE
            //TODO: ????
            let ids = e.target.className.split(' ').filter(function(el) { return el.match(/^N\d+$/g); });
            for (let i = 0; i < ids.length; i++) {
                var els = document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]),
                    viewfix = ids[i] + '-' + gl.class_viewfix,
                    view = ids[i] + '-' + gl.class_view;
                for (let i = 0; i < els.length; i++) {
                    if (els[i].classList.contains(view)) {
                        els[i].classList.remove(view);
                    }
                }
                document.querySelector('.book > tbody > tr#' + ids[i]).classList.remove(ids[i] + '-' + gl.class_view);
            }
            let id = this.id.substring(5);
            document.querySelector('#calendar thead tr:nth-child(2) th#D' + id).classList.remove(gl.class_view);
        },

        mouseup: function (e) {

            selGroup.free();
            gl.isMouseDown = false;
        }
    },

    calendarTHs: {

        mousedown: function (e) {

            this.classList.toggle(gl.class_viewfix);
            var book = document.querySelector('#' + this.parentNode.id + '-book');
            if (!book) {
                console.log('Error. No book with id: ' + this.parentNode.id + '-book');
                return;
            }

            var stDisplay = window.getComputedStyle(book).getPropertyValue('display');
            if (book.style.display == 'none' || stDisplay == 'none') {
                book.style.display = 'table-row';
            } else {
                book.style.display = 'none';
            }
        }
    },

    bookTRs: {

        mousedown: function (e) {

            switch (e.which) {
                case 2: return;
                case 3: listeners.RCMenuOpenClick(e, null); return;
                default: break;
            }

            var that = this;
            if (!that.closest('.innerBook')) {
                var id = that.id;
                that.classList.toggle(gl.class_viewfix);
                that.classList.toggle(gl.class_view);
                document.querySelectorAll('#calendar > tbody > tr > td.' + id).forEach(function (el) {
                    if (that.classList.contains(gl.class_viewfix)) {
                        el.classList.add(id + '-' + gl.class_viewfix);
                        el.classList.remove(id + '-' + gl.class_view);
                    } else {
                        el.classList.add(id + '-' + gl.class_view);
                        el.classList.remove(id + '-' + gl.class_viewfix);
                    }
                });
            }
        },

        mouseover: function (e) {

            if (!this.closest('.innerBook')) {
                var id = this.id;
                if (!this.classList.contains(gl.class_viewfix)) {
                    this.classList.add(gl.class_view);
                    document.querySelectorAll('#calendar > tbody > tr > td.' + id).forEach(function (el) {
                        el.classList.add(id + '-' + gl.class_view);
                    });
                }
            }
        },

        mouseout: function (e) {

            if (!this.closest('.innerBook')) {
                var id = this.id;
                if (!this.classList.contains(gl.class_viewfix)) {
                    this.classList.remove(gl.class_view);
                    document.querySelectorAll('#calendar > tbody > tr > td.' + id).forEach(function (el) {
                        el.classList.remove(id + '-' + gl.class_view);
                    });
                }
            }
        }
    },

    /*----------------------------------------------------------------------------------------
        Меню правой кнокпи мыши
    ----------------------------------------------------------------------------------------*/
    RCMenuOpenClick: function (e, classList) {

        var id, room, dayin, dayout,
            btn = {};

        gl.rcmenu && gl.rcmenu.unbind();

        if (classList) {
            if (classList.includes(gl.class_selected)) {
                var row = (e.target.id).substring(2, 4),
                    groupId = e.target.className.split(' ').filter(function(el) { return el.match(/\bsel-group-\d+/g); }),
                    groupEl = $("#calendar > tbody > tr#R" + row + " > td." + groupId),
                    begda = groupEl[0].id.split('-'),
                    endda = groupEl[groupEl.length - 1].id.split('-');

                room = row;
                dayin = begda[2] + '.' + begda[1];
                dayout = endda[2] + '.' + endda[1];
                btn = { upd: false, del: false, add: true }
            } else if (classList.includes(gl.class_redeemed) || classList.includes(gl.class_reserved)) {
                id = getIDs(e.currentTarget.className)[0];
                btn = { upd: true, del: true, add: false }
            } else {
                return;
            }

        } else {
            id = [e.target.id];
            btn = { upd: true, del: true, add: false }
        }

        gl.rcmenu = new RCMenu({
            id: id,
            begda: dayin,
            endda: dayout,
            room: room,
            btn: btn,
            x: e.pageX,
            y: e.pageY
        });

        gl.rcmenu.bind();
        gl.rcmenu.show();
    }

    /*----------------------------------------------------------------------------------------
         
    ----------------------------------------------------------------------------------------*/

};

(function (window, document, undefined) {

    document.addEventListener('DOMContentLoaded', listeners.onLoad);
    document.addEventListener('mouseup', listeners.mouseUp);

    window.addEventListener('contextmenu', listeners.ctmClick, false);
    window.addEventListener('click', listeners.windowClick, false);

})(window, document);

/*
var viewContainer = document.getElementById('view-container'),
    style = window.getComputedStyle(viewContainer),
    stDisplay = style.getPropertyValue('display');

function getIDs(string) {
    var result = [];
    var classList = string != undefined ? string.split(' ') : [];
    for (let i = 0; i < classList.length; i++) {
        if (classList[i].match(/^N\d+$/g)) result.push(classList[i].match(/^N\d+$/g));
    }
    return result;
}
*/