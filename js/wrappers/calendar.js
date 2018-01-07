/**
 * Группа работы с CSS классом позволяющим идентифицровать выделенные ячейки.
 * Формирование, Добавление, Удаление класса. Пересчет кол-ва ячеек в классе.
 * FIX: при переходе на новую строку начинать отсчет заново
 */
const selGroup = {

    /** 
     * ID обрабатываемого класса 
     */
    classId: undefined,

    /**
     * Очистка ID текущего обрабатываемого класса
     */
    free: function () {

        this.classId = undefined;
    },

    /**
     * Формирование ID нового класса
     */
    gen: function () {

        this.classId = 'sel-group-' + Math.ceil((Math.random() * 100000));
    },

    /**
     * Добавление класса к объекту.
     * Если ID класса не сформирован то перед добавление будет вызван метод формирующий ID класса
     */
    add: function (target) {

        !this.classId && this.gen();
        target.classList.add(this.classId);
        this.enum(this.classId);
    },

    /**
     * Поиск ID класса присвоенного объекту с последующим удалением и пересчетом оставшихся элементов 
     * которым присвоей этот ID
     */
    del: function (target) {

        if (target.className === '') return;
        var classId = target.className.split(' ').filter(function (el) {
            return el.match(/\bsel-group-\d+/);
        }).toString();
        if (classId !== '') {
            var group = document.getElementsByClassName(classId);
            //FIX: inner html memory leak
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
            this.enum(classId);
        }
    },

    /**
     * Пересчет кол-ва объектов класса по ID класса 
     */
    enum: function (classId) {

        var group = document.getElementsByClassName(classId);
        for (let i = 0; i < group.length; i++) {
            //FIX: inner html memory leak
            group[i].innerHTML = (i + 1);
        }
    }
}

class Calendar extends DataWrapper {

    constructor() {
        super();

        this._listeners = {

            // external called events

            datePick: function datePick(e) {
                var year = document.getElementById('year'),
                    month = document.getElementById('month');

                var newYear = e.detail.year,
                    newMonth = e.detail.month;

                if (newYear < 1900) return;

                //FIX: innerhtml memory leak
                month.innerHTML = newMonth;
                year.innerHTML = newYear;
                db.gl001.select();
                db.cf001.update();
            },

            RCMenu: function RCMenu(e) {

                if (!e.detail.EventBus) {
                    console.log('Invalid function call.');
                    return;
                };

                var rcmenu = new RCMenu({
                    data: e.detail.data,
                    btn: {
                        upd: e.detail.btn.upd,
                        del: e.detail.btn.del,
                        add: e.detail.btn.add
                    },
                    x: e.pageX,
                    y: e.pageY
                });

                rcmenu.bind();
                rcmenu.show();
            },

            RCMItemAddGuest: function RCMItemAddGuest(e) {

                var initVal = {
                    intent = gl.intent_add,
                    month = gl.monthNames.indexOf(document.getElementById('month').value),
                    year = document.getElementById('year').value,
                    rooms = gl.rooms
                }

                var inOutDialog = new InOutDialog({ data: initVal });
                inOutDialog.bind();

                var data = e.detail.data;
                data.intent = initVal.intent;
                inOutDialog.setVal(data);

                inOutDialog.show();
            },

            RCMItemDelGuest: function RCMItemDelGuest(e) {

                var id = this.id.substring(1);

                var confirmDialog = new ConfirmDialog({ data: { id: id } });
                confirmDialog.bind();
                confirmDialog.show();
            },

            RCMItemUpdGuest: function RCMItemUpdGuest(e) {

                var initVal = {
                    intent = gl.intent_upd,
                    month = gl.monthNames.indexOf(document.getElementById('month').value),
                    year = document.getElementById('year').value,
                    rooms = gl.rooms
                }
                
                var inOutDialog = new InOutDialog({ data: initVal });
                inOutDialog.bind();

                var data = e.detail.data;
                data.intent = initVal.intent;
                inOutDialog.setVal(val);

                inOutDialog.show();
            },

            inOutDialogSave: function inOutDialogSave(e) {

                switch (e.detail.intent) {
                    case gl.intent_add:
                        db.gl001.insert(e.detail);
                        break;

                    case gl.intent_upd:
                        db.gl001.modify(e.detail);
                        break;

                    case gl.intent_del:
                        db.gl001.delete(e.detail.id);
                        break;

                    default: break;
                }
            },

            // predefined event listeners

            prevMonth: function prevMonth(e) {

                var month = document.getElementById('month'),
                    monthNum = gl.monthNames.indexOf(month.innerHTML);
                if (monthNum > 1) {
                    monthNum--;
                } else {
                    monthNum = 12;
                }
                var monthName = gl.monthNames[monthNum];
                //FIX: innerhtml memory leak
                month.innerHTML = monthName;
                db.gl001.select();
            },

            pickCalendar: function pickCalendar(e) {

                var year = document.getElementById('year').innerHTML,
                    month = gl.monthNames.indexOf(document.getElementById('month').innerHTML),
                    month = utils.overlay(month, '0', 2),
                    pickCalendar = new PickCalendar();

                pickCalendar.bind();
                pickCalendar.setVal({
                    year: year,
                    month: month
                });
                pickCalendar.show();
            },

            nextMonth: function nextMonth(e) {

                var month = document.getElementById('month'),
                    monthNum = gl.monthNames.indexOf(month.innerHTML);
                if (monthNum > 11) {
                    monthNum = 1;
                } else {
                    monthNum++;
                }
                var monthName = gl.monthNames[monthNum];
                //FIX: innerhtml memory leak
                month.innerHTML = monthName;
                db.gl001.select();
            },

            // delegate event listeners

            calendarTDmouseDown: function mousedown(e) {

                if (e.which == 2) return;

                var data = {
                        id: '',
                        dayin: '',
                        dayout: '',
                        days: '',
                        room: '',
                        baseline: '',
                        adjustment: '',
                        cost: '',
                        paid: '',
                        name: '',
                        city: '',
                        tel: '',
                        fn: ''
                    },
                    clList = e.target.classList,
                    isAvailableBtn;

                if (e.which == 3) {

                    if (clList.contains(gl.class_selected)) {

                        let filterGroupId = function (el) {
                            return el.match(/\bsel-group-\d+/g);
                        }
                        var groupId = e.target.className.split(' ').filter(filterGroupId).toString(),
                            groupEl = document.querySelectorAll('#calendar > tbody > tr#R' + row + ' > td.' + groupId),
                            begda = groupEl[0].id.split('-'),
                            endda = groupEl[groupEl.length - 1].id.split('-');

                        data.id = '-1';
                        data.room = (e.target.id).substring(2, 4);
                        data.dayin = begda[2] + '.' + begda[1];
                        data.dayout = endda[2] + '.' + endda[1];
                        isAvailableBtn = true;

                    } else if (clList.contains(gl.class_redeemed) || clList.contains(gl.class_reserved)) {

                        let filterId = function (el) {
                            return el.match(/^N\d+$/);
                        }
                        data.id = e.target.className.split(' ').filter(filterId).toString();
                        isAvailableBtn = false;

                    } else if (!clList) {

                        var guest = e.target.closest('.book').querySelector('.book tbody');
                        if (!guest) return;

                        data.id = guest.querySelector('.person-id').value;
                        data.dayin = guest.querySelector('.person-dayin').value.substring(3);
                        data.dayout = guest.querySelector('.person-dayout').valuesubstring(3);
                        data.days = guest.querySelector('.person-days').value;
                        data.room = guest.querySelector('.person-room-num').value;
                        data.baseline = guest.querySelector('.person-baseline').value;
                        data.adjustment = guest.querySelector('.person-adjustment').value;
                        data.cost = guest.querySelector('.person-room-cost').value;
                        data.paid = guest.querySelector('.person-room-paid').value;
                        data.name = guest.querySelector('.person-name').value;
                        data.city = guest.querySelector('.person-city').value;
                        data.tel = guest.querySelector('.person-tel').value;
                        data.fn = guest.querySelector('.person-fn').value;

                        isAvailableBtn = false;

                    } else {
                        return;
                    }

                    EventBus.dispatch(gl.events.rcmenu, {
                        btn: {
                            upd: !isAvailableBtn,
                            del: !isAvailableBtn,
                            add: isAvailableBtn
                        },
                        x: e.pageX,
                        y: e.pageY,
                        data: data
                    });

                    return;
                }

                // Выделение при зажатой мыши
                gl.isMouseDown = true;
                if (e.target.classList.length == 0 || e.target.classList.contains(gl.class_selected)) {
                    e.target.classList.toggle(gl.class_selected);
                }
                gl.isSelected = e.target.classList.contains(gl.class_selected);
                selGroup.del(this);
                gl.isSelected ? selGroup.add(this) : selGroup.free();

                // Переключения CSS класса опредляющего подсвеченный элемент
                let ids = e.target.className.split(' ').filter(function (el) {
                    return el.match(/^N\d+$/g);
                });
                for (let i = 0; i < ids.length; i++) {
                    document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]).forEach(function (el) {
                        el.classList.toggle(ids[i] + '-' + gl.class_viewfix);
                        el.classList.toggle(ids[i] + '-' + gl.class_view);
                    });
                    document.querySelector('.book > tbody > tr#' + ids[i]).classList.toggle(gl.class_viewfix);
                    document.querySelector('.book > tbody > tr#' + ids[i]).classList.toggle(gl.class_view);
                }
            },

            calendarTDmouseOver: function mouseover(e) {

                // Выделение при зажатой мыши
                if (gl.isMouseDown) {
                    if (e.target.classList.length == 0 || e.target.classList.contains(gl.class_selected)) {
                        selGroup.del(this);
                        gl.isSelected && selGroup.add(this);
                        e.target.classList.toggle(gl.class_selected, gl.isSelected);
                    } else {
                        selGroup.free();
                    }
                }

                // Переключения CSS класса опредляющего подсвеченный элемент
                let ids = e.target.className.split(' ').filter(function (el) {
                    return el.match(/^N\d+$/g);
                });
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

            calendarTDmouseOut: function mouseout(e) {

                // Выделение при зажатой мыши
                let ids = e.target.className.split(' ').filter(function (el) {
                    return el.match(/^N\d+$/g);
                });
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

            calendarTDmouseUp: function mouseup(e) {

                selGroup.free();
                gl.isMouseDown = false;
            },

            calendarTHmouseDown: function mousedown(e) {

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
            },

            bookTRmouseDown: function mousedown(e) {

                if (e.which == 2) return;

                if (e.which == 3) {
                    EventBus.dispatch(gl.events.rcmenu, []);
                    return;
                };

                var that = this;
                if (!that.closest('.inner-book')) {
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

            bookTRmouseOver: function mouseover(e) {

                if (!this.closest('.inner-book')) {
                    var id = this.id;
                    if (!this.classList.contains(gl.class_viewfix)) {
                        this.classList.add(gl.class_view);
                        document.querySelectorAll('#calendar > tbody > tr > td.' + id).forEach(function (el) {
                            el.classList.add(id + '-' + gl.class_view);
                        });
                    }
                }
            },

            bookTRmouseOut: function mouseout(e) {

                if (!this.closest('.inner-book')) {
                    var id = this.id;
                    if (!this.classList.contains(gl.class_viewfix)) {
                        this.classList.remove(gl.class_view);
                        document.querySelectorAll('#calendar > tbody > tr > td.' + id).forEach(function (el) {
                            el.classList.remove(id + '-' + gl.class_view);
                        });
                    }
                }
            },

            //

            ajaxInitialDataSuccess: function (data) {
                if (!data.status) {
                    console.log(data.msg);
                } else {
                    data.data.sort(function (a, b) {
                        if (a.id > b.id) {
                            return 1;
                        } else if (a.id < b.id) {
                            return -1;
                        } else {
                            return 0;
                        }
                    });
                    //FIX: innerHTML memory leak
                    document.getElementById('year').innerHTML = data.year;
                    gl.rooms = data.rooms;

                    setHeader(data.year, data.month);
                    addEntry(data.year, data.month, data.data);
                }
            },

            ajaxInitialDataError: function (xhr, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }
        }
    }

    bind(target) {

        var label, span, td, tr, tbody, thead, table;
        if (true) {
            table = document.createElement('table');
            table.setAttribute('id', 'calendar');
            table.classList.add('my-table');
            if (true) {
                thead = document.createElement('thead');
                if (true) {
                    tr = document.createElement('tr');
                    tr.setAttribute('id', 'calendar-row-buttons');
                    if (true) {
                        td = document.createElement('td');
                        if (true) {
                            table = document.createElement('table');
                            if (true) {
                                tbody = document.createElement('tbody');
                                if (true) {
                                    tr = document.createElement('tr');
                                    if (true) {
                                        td = document.createElement('td');
                                        if (true) {
                                            span = document.createElement('span');
                                            span.setAttribute('id', 'button-prev-month');
                                            span.classList.add('month-button');
                                            span.addEventListener('click', this._listeners.prevMonth);
                                            td.appendChild(span);
                                        }
                                        tr.appendChild(td);
                                    }
                                    if (true) {
                                        td = document.createElement('td');
                                        if (true) {
                                            span = document.createElement('span');
                                            span.setAttribute('id', 'button-pick-calendar');
                                            span.addEventListener('click', this._listeners.pickCalendar);
                                            setListener('click', span);

                                            label = document.createElement('label');
                                            label.setAttribute('id', 'month');
                                            span.appendChild(label);

                                            label = document.createElement('label');
                                            label.setAttribute('id', 'year');
                                            span.appendChild(label);

                                            td.appendChild(span);
                                        }
                                        tr.appendChild(td);
                                    }
                                    if (true) {
                                        td = document.createElement('td');
                                        if (true) {
                                            span = document.createElement('span');
                                            span.setAttribute('id', 'button-next-month');
                                            span.classList.add('month-button');
                                            span.addEventListener('click', this._listeners.nextMonth);
                                            td.appendChild(span);
                                        }
                                        tr.appendChild(td);
                                    }
                                    tbody.appendChild(tr);
                                }
                                table.appendChild(tbody);
                            }
                            td.appendChild(table);
                        }
                        tr.appendChild(td);
                    }
                    thead.appendChild(tr);
                }
                if (true) {
                    tr = document.createElement('tr');
                    tr.setAttribute('id', 'calendar-row-days');
                    thead.appendChild(tr);
                }
                table.appendChild(thead);
            }
            if (true) {
                tbody = document.createElement('tbody');
                table.appendChild(tbody);
            }
            target.appendChild(table);
        }

        /** 
         * Регистрация отложенных событий, которые должны быть вызваны на элементах, 
         * которые еще не существуют
         */
        var qsParent, qsChild, qsParentExcl;

        qsParent = '#calendar > tbody';
        qsChild = 'td', qsParentExcl = '.book-row';
        _setDelegate('', 'mousedown', qsParent, qsChild, qsParentExcl, this._listeners.calendarTDmouseDown);
        _setDelegate('', 'mouseover', qsParent, qsChild, qsParentExcl, this._listeners.calendarTDmouseOver);
        _setDelegate('', 'mouseout', qsParent, qsChild, qsParentExcl, this._listeners.calendarTDmouseOut);
        _setDelegate('', 'mouseup', qsParent, qsChild, qsParentExcl, this._listeners.calendarTDmouseUp);

        qsParent = '#calendar > tbody';
        qsChild = 'tr > th', qsParentExcl = '';
        _setDelegate('', 'mousedown', qsParent, qsChild, qsParentExcl, this._listeners.calendarTHmouseDown);

        qsParent = '#calendar > tbody';
        qsChild = '.book > tbody > tr', qsParentExcl = '';
        _setDelegate('', 'mousedown', qsParent, qsChild, qsParentExcl, this._listeners.bookTRmouseDown);
        _setDelegate('', 'mouseover', qsParent, qsChild, qsParentExcl, this._listeners.bookTRmouseOver);
        _setDelegate('', 'mouseout', qsParent, qsChild, qsParentExcl, this._listeners.bookTRmouseOut);

        /** 
         * Регистрация событий которые будут вызываться асинхронно
         */
        EventBus.register(gl.events.rcmenu, this._listeners.RCMenu);
        EventBus.register(gl.events.datePick, this._listeners.datePick);
        EventBus.register(gl.events.RCMItemAddGuest, this._listeners.RCMItemAddGuest);
        EventBus.register(gl.events.RCMItemDelGuest, this._listeners.RCMItemDelGuest);
        EventBus.register(gl.events.RCMItemUpdGuest, this._listeners.RCMItemUpdGuest);
        EventBus.register(gl.events.inOutDialogSave, this._listeners.inOutDialogSave);
    }


    init() {
        //FIX: sort after select
        $.ajax({
            url: '../db/init.php',
            dataType: 'json',
            success: this._listeners.ajaxInitialDataSuccess(data),
            error: this._listeners.ajaxInitialDataError(xhr, textStatus, errorThrown)
        });
    }

    _setHeader(year, month) {

        var monthName = utils.getMonthName(month),
            days = new Date(year, month, 0).getDate();

        // thead begin
        //  --- чистим
        //  --- --- тело
        document.querySelector('#calendar > tbody').innerHTML = "";
        // дни месяца
        var trdays = document.getElementById('calendar-row-days'),
            childs = trdays.children.length;
        for (let i = 0; i < childs; i++) {
            try {
                trdays.deleteCell(0);
            } catch (e) {}
        }
        //  --- --- название месяца
        document.getElementById('month').innerHTML = "";
        //  --- --- год
        document.getElementById('year').innerHTML = "";

        //  --- добавляем
        //  --- --- год
        document.getElementById('year').innerHTML = year;
        //  --- --- название месяца
        var td = document.getElementById('calendar-row-buttons').getElementsByTagName('td')[0];
        td.setAttribute('colspan', days + 1);
        document.getElementById('month').innerHTML = monthName;
        document.getElementById('month').value = monthName;
        //  --- --- дни месяца
        for (let i = 0; i <= days; i++) {
            var th = document.createElement('th');
            if (i == 0) {
                th.classList.add('blank-cell');
            } else {
                let day = utils.overlay(i, '0', 2),
                    date = year + '-' + utils.overlay(month, '0', 2) + '-' + day;
                th.setAttribute('id', 'D' + date)
                th.appendChild(document.createTextNode(i));
            }
            trdays.appendChild(th);
        }

        //  tbody begin
        var tbody = document.querySelector('#calendar > tbody');
        for (let i = 0; i < gl.rooms.length; i++) {
            var room = gl.rooms[i].room,
                tr = document.createElement('tr');
            tr.setAttribute('id', 'R' + room);
            for (let j = 0; j < days + 1; j++) {
                var node;
                if (0 == j) {
                    node = document.createElement('th');
                    node.appendChild(document.createTextNode(room));
                } else {
                    let day = utils.overlay(j, '0', 2),
                        date = year + '-' + utils.overlay(month, '0', 2) + '-' + day;
                    node = document.createElement('td');
                    node.setAttribute('id', 'RD' + room + '_' + date);
                    node.appendChild(document.createTextNode(""));
                }
                tr.appendChild(node);
            }
            tbody.append(tr);
        }
    }

    _isEmptyBook(room) {
        return !document.querySelector('#R' + room + '-book tbody').childElementCount;
    }

    _setDelegate(eventName, qsParent, qsChild, qsClosestExcl, callback) {

        const delegateListener = function delegateListener(e) {

            var childs = this.parent.querySelectorAll(this.qsChild);
            for (let i = 0, l = childs.length; i < l; i++) {
                if (!qsClosestExcl) {
                    if (childs[i].closest(this.qsClosestExcl)) continue;
                }
                var el = e.target;
                while (el && el !== this.parent) {
                    if (el === childs[i]) return callback.call(childs[i], e);
                    el = el.parentNode;
                }
            }
        }

        var parent = document.querySelector(qsParent);
        parent.addEventListener(eventName, delegateListener.bind({
            parent: parent,
            qsChild: qsChild,
            qsClosestExcl: qsClosestExcl
        }));
    }

    addEntry(year, month, list) {

        var list = (list === undefined) ? [] : list;

        for (let i = 0; i < list.length; i++) {
            var wa = list[i];

            // calendar begin
            var begda = new Date(wa.dayin),
                endda = new Date(wa.dayout),
                curda = new Date(),
                tmpda = begda;

            while (tmpda <= endda) {
                if (tmpda.format('yyyy-mm') == (year + '-' + month)) {

                    //FIX: replace innerHTML (memory leak)
                    var td = document.querySelector('#calendar tbody tr#R' + wa.room + ' td#RD' + wa.room + '_' + tmpda.format('yyyy-mm-dd'));
                    td.innerHTML = '';

                    // добавляем класс
                    if (td.classList.contains(gl.class_redeemed) || td.classList.contains(gl.class_reserved)) {
                        td.classList.remove(gl.class_redeemed);
                        td.classList.remove(gl.class_reserved);
                        td.classList.add(gl.class_adjacent);
                    } else {
                        td.classList.remove(gl.class_selected);
                        if (tmpda < curda) {
                            td.classList.add(gl.class_redeemed);
                        } else {
                            td.classList.add(gl.class_reserved);
                        }
                    }
                    td.classList.add('N' + wa.id);

                    // добавляем подсказку  
                    var div = td.getElementsByTagName('div'),
                        hintText = '№' + wa.id + ' ' + wa.name + ' с ' + begda.format('dd.mm') + ' по ' + endda.format('dd.mm');
                    if (div.length == 0) {
                        var span = document.createElement('span');
                        span.setAttribute('class', 'hint-text');
                        span.appendChild(document.createTextNode(hintText));
                        div = document.createElement('div');
                        div.setAttribute('class', 'hint');
                        div.appendChild(span);
                        td.append(div);
                    } else {
                        div.children('span').append('<br>' + hintText);
                    }
                }

                begda.setDate(begda.getDate() + 1);
            }
            // calendar end

            // book begin
            var hiddenRow = document.getElementById('R' + wa.room + '-book');
            if (!hiddenRow) {
                hiddenRow = document.createElement('tr');
                hiddenRow.setAttribute('id', 'R' + wa.room + '-book');
                hiddenRow.classList.add('hidden');
                hiddenRow.classList.add('book-row');
                var td = document.createElement('td'),
                    days = new Date(year, month, 0).getDate();
                td.setAttribute('colspan', days + 1);
                var table = document.createElement('table');
                table.classList.add('book');
                table.appendChild(document.createElement('tbody'));
                td.appendChild(table);
                hiddenRow.appendChild(td);
                var tr = document.querySelector('#calendar tbody tr#R' + wa.room);
                tr.parentNode.insertBefore(hiddenRow, tr.nextSibling);
                hiddenRow = document.getElementById('R' + wa.room + '-book');
            }

            var rTable = hiddenRow.querySelector('table'),
                rBody = rTable.querySelector('tbody'),
                tr, rTR, td, a;

            //------------------------------------------------------------
            td = document.createElement('td');
            td.setAttribute('class', 'person-id');
            td.appendChild(document.createTextNode(wa.id));

            rTR = document.createElement('tr');
            rTR.setAttribute('class', 'person-row');
            rTR.setAttribute('id', 'N' + wa.id);
            rTR.appendChild(td);
            //------------------------------------------------------------

            //------------------------------------------------------------
            td = document.createElement('td');
            td.setAttribute('class', 'person-base-info');

            a = document.createElement('a');
            a.setAttribute('class', 'person-name');
            a.appendChild(document.createTextNode(wa.name));
            td.appendChild(a);

            if (wa.tel.length > 0) {
                a = document.createElement('a');
                a.setAttribute('class', 'person-tel');
                a.appendChild(document.createTextNode(wa.tel));
                td.appendChild(a);
            }

            tr = document.createElement('tr');
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-dates');
            td.classList.add('person-dayin');
            td.appendChild(document.createTextNode('с  ' + (new Date(wa.dayin).format('dd.mm'))));
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-room-num');
            td.setAttribute('rowspan', '2');
            td.appendChild(document.createTextNode(wa.room));
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-room-cost');
            td.appendChild(document.createTextNode(wa.cost));
            tr.appendChild(td);

            var tbody = document.createElement('tbody')
            tbody.appendChild(tr);
            //------------------------------------------------------------

            //------------------------------------------------------------
            tr = document.createElement('tr');

            td = document.createElement('td');
            td.setAttribute('class', 'person-additional-info');

            a = document.createElement('a');
            a.setAttribute('class', 'person-city');
            a.appendChild(document.createTextNode(wa.city));
            td.appendChild(a);

            a = document.createElement('a');
            a.setAttribute('class', 'person-fn');
            a.appendChild(document.createTextNode(wa.fn));
            td.appendChild(a);

            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-dates');
            td.classList.add('person-dayout');
            td.appendChild(document.createTextNode('по ' + (new Date(wa.dayout).format('dd.mm'))));
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-room-paid');
            td.appendChild(document.createTextNode(wa.paid));
            tr.appendChild(td);

            tbody.appendChild(tr);
            //------------------------------------------------------------

            //------------------------------------------------------------
            tr = document.createElement('tr');
            tr.setAttribute('style', "display:none;");

            td = document.createElement('td');
            td.setAttribute('class', 'person-days');
            td.appendChild(document.createTextNode(wa.days));
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-baseline');
            td.appendChild(document.createTextNode(wa.baseline));
            tr.appendChild(td);

            td = document.createElement('td');
            td.setAttribute('class', 'person-adjustment');
            td.appendChild(document.createTextNode(wa.adjustment));
            tr.appendChild(td);

            td = document.createElement('td');
            td.appendChild(document.createTextNode(''));
            tr.appendChild(td);

            tbody.appendChild(tr);
            //------------------------------------------------------------

            //------------------------------------------------------------
            var iTable = document.createElement('table');
            iTable.setAttribute('class', 'inner-book');
            iTable.appendChild(tbody);
            //------------------------------------------------------------

            //------------------------------------------------------------
            td = document.createElement('td');
            td.appendChild(iTable);
            //------------------------------------------------------------

            //------------------------------------------------------------
            rTR.appendChild(td);
            //------------------------------------------------------------

            //------------------------------------------------------------
            rBody.appendChild(rTR);
            //------------------------------------------------------------
            // book end
        }
    }

    delEntry(list) {

        for (let i = 0; i < list.length; i++) {
            var wa = list[i];

            // calendar begin
            var room = wa.room,
                begda = new Date(wa.dayin),
                endda = new Date(wa.dayout),
                curda = new Date();

            while (begda <= endda) {
                var date = begda.format('yyyy-mm-dd'),
                    td = document.querySelector('#calendar tbody tr#R' + room + ' td#RD' + room + '_' + date);
                if (!td) {
                    begda.setDate(begda.getDate() + 1);
                    continue;
                }
                td.classList.remove('N' + wa.id);
                td.classList.remove('N' + wa.id + '-' + gl.class_viewfix);
                td.classList.remove('N' + wa.id + '-' + gl.class_view);
                if (td.classList.contains(gl.class_adjacent)) {
                    td.classList.remove(gl.class_adjacent);
                    if (begda < curda) {
                        td.classList.add(gl.class_redeemed);
                    } else {
                        td.classList.add(gl.class_reserved);
                    }
                } else {
                    td.classList.remove(gl.class_redeemed);
                    td.classList.remove(gl.class_reserved);
                }
                td.innerHTML = ''; //FIX: memory leak
                begda.setDate(begda.getDate() + 1);
            }
            // calendar end

            // book begin
            var tr = document.querySelector('.book > tbody > tr#N' + wa.id);
            tr.parentNode.removeChild(tr);
            if (this.isEmptyBook(wa.room)) {
                tr = document.querySelector('#calendar > tbody > tr#R' + wa.room + '-book');
                tr.parentNode.removeChild(tr);
            }
            // book end
        }
    }

    updEntry(oldData, newData) {

        this.delGuest(oldData);
        var year = document.getElementById('year').innerHTML,
            monthName = document.getElementById('month').innerHTML,
            month = gl.monthNames.indexOf(monthName);
        this.addGuest(year, month, newData)

        // book sort begin
        var tr = document.querySelectorAll('#R' + newData[0].room + '-book > td > .book > tbody > tr'),
            pos = [];
        for (let i = 0; i < tr.length; i++) {
            pos.push({
                id: parseInt(tr[i].children[0].innerHTML, 10),
                pos: i
            });
        }

        pos.sort(function (a, b) {
            return a.id - b.id;
        });

        var prevRow = document.querySelector('#R' + newData[0].room + '-book tr#N' + pos[0].id);
        for (let i = 0; i < (pos.length - 1); i++) {
            if (pos[i].pos > pos[i + 1].pos) {
                var curRow = document.querySelector('#R' + newData[0].room + '-book tr#N' + pos[i].id),
                    nextRow = document.querySelector('#R' + newData[0].room + '-book tr#N' + pos[i + 1].id);
                nextRow.parentNode.insertBefore(nextRow, curRow);
            }
            prevRow = document.querySelector('#R' + newData[0].room + '-book tbody tr#N' + pos[i].id);
        }
        // book sort end
    }
}