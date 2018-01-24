class Calendar extends DataWrapper {

    constructor () {
        super();

        this.eventId = 'calendar';
        this.year;
        this.month;
        this.entries;
        /** 
         * ID обрабатываемого класса 
         * FIX: при переходе на новую строку начинать отсчет заново
         */
        this.classId;

        this.cb = {

            rcm: {

                open: function RCMenuOpen (e) {

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

                items: {

                    add: function RCMItemAddGuest (e) {
    
                        var data = e.detail.data;
                        data.intent = GL.CONST.VALUES.CALENDAR.INTENT.ADD;
    
                        var inOutDialog = new InOutDialog({
                            data: {
                                intent: data.intent,
                                month: this._getMonth().num,
                                year: this._getYear(),
                                rooms: GL.DATA.CALENDAR.rooms
                            }
                        });
                        inOutDialog.bind();
                        inOutDialog.setVal(data);
                        inOutDialog.show();
                    },
        
                    del: function RCMItemDelGuest(e) {
        
                        var confirmDialog = new ConfirmDialog({
                            data: {
                                id: e.detail.data.id.substring(1),
                            }
                        });
                        confirmDialog.bind();
                        confirmDialog.show();
                    },
        
                    upd: function RCMItemUpdGuest(e) {
        
                        var data = e.detail.data;
                        data.intent = GL.CONST.VALUES.CALENDAR.INTENT.UPD;
    
                        var inOutDialog = new InOutDialog({
                            data: {
                                intent: data.intent,
                                month: this._getMonth().num,
                                year: this._getYear(),
                                rooms: GL.DATA.CALENDAR.rooms
                            }
                        });
                        inOutDialog.bind();
                        inOutDialog.setVal(data);
                        inOutDialog.show();
                    },
                },
            },

            calendar: {

                td: {

                    mouseDown: function mousedown(e) {

                        if (e.which == 2) return;
        
                        const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;

                        if (e.which == 3) {

                            var guest = UTILS.CLONE(GL.CONST.SCHEMA.GUEST),
                                isAvailableBtn;
                            
                            guest.year = this._getYear();
                            guest.mont = this._getMonth().num;

                            var bookEntry = e.target.closest('.book');
                            if (bookEntry) {

                                const SCHEMA = GL.CONST.SCHEMA.GUEST;                                      
                                guest.unid = bookEntry.querySelector('.' + SCHEMA.UNID).value;
                                guest.dbeg = bookEntry.querySelector('.' + SCHEMA.DBEG).value.substring(3);
                                guest.dend = bookEntry.querySelector('.' + SCHEMA.DEND).value.substring(3);
                                guest.days = bookEntry.querySelector('.' + SCHEMA.DAYS).value;
                                guest.room = bookEntry.querySelector('.' + SCHEMA.ROOM).value;
                                guest.base = bookEntry.querySelector('.' + SCHEMA.BASE).value;
                                guest.adjs = bookEntry.querySelector('.' + SCHEMA.ADJS).value;
                                guest.cost = bookEntry.querySelector('.' + SCHEMA.COST).value;
                                guest.paid = bookEntry.querySelector('.' + SCHEMA.PAID).value;
                                guest.name = bookEntry.querySelector('.' + SCHEMA.NAME).value;
                                guest.teln = bookEntry.querySelector('.' + SCHEMA.TELN).value;
                                guest.fnot = bookEntry.querySelector('.' + SCHEMA.FNOT).value;
                                guest.city = bookEntry.querySelector('.' + SCHEMA.CITY).value;
        
                                isAvailableBtn = false;

                            } else {

                                var target = e.target.classList;

                                if (target.contains(CLASS_LIST.SELECTED)) {
        
                                    let idGroupFilter = function (el) { return el.match(/\bsel-group-\d+/g); }
                                    var idGroup = e.target.className.split(' ').filter(idGroupFilter).toString(),
                                        //FIX: dump row????    
                                        group = document.querySelectorAll('#calendar > tbody > tr#R' + row + ' > td.' + idGroup),
                                        begda = group[0].id.split('-'),
                                        endda = group[group.length - 1].id.split('-');
            
                                    guest.unid = '-1';
                                    guest.room = (e.target.id).substring(2, 4);
                                    guest.dbeg = begda[2] + '.' + begda[1];
                                    guest.dend = endda[2] + '.' + endda[1];
                                    isAvailableBtn = true;
            
                                } else if (target.contains(CLASS_LIST.REDEEMED) || target.contains(CLASS_LIST.RESERVED)) {
            
                                    let idFilter = function (el) { return el.match(/^N\d+$/); }
                                    guest.unid = e.target.className.split(' ').filter(idFilter).toString();
                                    isAvailableBtn = false;
            
                                } else {
                                    return;
                                }
                            }
                            
                            EventBus.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU, {
                                btn: {
                                    upd: !isAvailableBtn,
                                    del: !isAvailableBtn,
                                    add: isAvailableBtn
                                },
                                x: e.pageX,
                                y: e.pageY,
                                guest
                            });
        
                            return;
                        }
        
                        // Выделение при зажатой мыши
                        GL.DATA.CORE.isMouseDown = true;
                        if (e.target.classList.length == 0 || e.target.classList.contains(CLASS_LIST.SELECTED)) {
                            e.target.classList.toggle(CLASS_LIST.SELECTED);
                        }
                        GL.DATA.CALENDAR.isSelected = e.target.classList.contains(CLASS_LIST.SELECTED);
                        SelectionGroup.del(e.target);
                        GL.DATA.CALENDAR.isSelected ? SelectionGroup.add(e) : SelectionGroup.free();
        
                        // Переключения CSS класса опредляющего подсвеченный элемент
                        let ids = e.target.className.split(' ').filter(function (el) {
                            return el.match(/^N\d+$/g);
                        });
                        for (let i = 0; i < ids.length; i++) {
                            document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]).forEach(function (el) {
                                el.classList.toggle(ids[i] + '-' + CLASS_LIST.VIEW_FIX);
                                el.classList.toggle(ids[i] + '-' + CLASS_LIST.VIEW);
                            });
                            document.querySelector('.book > tbody > tr#' + ids[i]).classList.toggle(CLASS_LIST.VIEW_FIX);
                            document.querySelector('.book > tbody > tr#' + ids[i]).classList.toggle(CLASS_LIST.VIEW);
                        }
                    },
        
                    mouseOver: function mouseover(e) {
        
                        // Выделение при зажатой мыши
                        const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
                        if (GL.DATA.CORE.isMouseDown) {
                            if (e.target.classList.length == 0 || e.target.classList.contains(CLASS_LIST.SELECTED)) {
                                SelectionGroup.del(e);
                                GL.DATA.CALENDAR.isSelected && SelectionGroup.add(e);
                                e.target.classList.toggle(CLASS_LIST.SELECTED, GL.DATA.CALENDAR.isSelected);
                            } else {
                                SelectionGroup.free();
                            }
                        }
        
                        // Переключения CSS класса опредляющего подсвеченный элемент
                        let ids = e.target.className.split(' ').filter(function (el) {
                            return el.match(/^N\d+$/g);
                        });
                        for (let i = 0; i < ids.length; i++) {
                            var els = document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]),
                                viewfix = ids[i] + '-' + CLASS_LIST.VIEW_FIX,
                                view = ids[i] + '-' + CLASS_LIST.VIEW;
                            for (let i = 0; i < els.length; i++) {
                                if (!els[i].classList.contains(view)) {
                                    els[i].classList.add(view);
                                }
                            }
                            document.querySelector('.book > tbody > tr#' + ids[i]).classList.add(ids[i] + '-' + CLASS_LIST.VIEW);
                        }
                        let id = e.target.id.substring(5);
                        document.querySelector('#calendar thead tr:nth-child(2) th#D' + id).classList.add(CLASS_LIST.VIEW);
                    },
        
                    mouseOut: function mouseout(e) {
        
                        // Выделение при зажатой мыши
                        const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
                        let ids = e.target.className.split(' ').filter(function (el) {
                            return el.match(/^N\d+$/g);
                        });
                        for (let i = 0; i < ids.length; i++) {
                            var els = document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]),
                                viewfix = ids[i] + '-' + CLASS_LIST.VIEW_FIX,
                                view = ids[i] + '-' + CLASS_LIST.VIEW;
                            for (let i = 0; i < els.length; i++) {
                                if (els[i].classList.contains(view)) {
                                    els[i].classList.remove(view);
                                }
                            }
                            document.querySelector('.book > tbody > tr#' + ids[i]).classList.remove(ids[i] + '-' + CLASS_LIST.VIEW);
                        }
                        let id = e.target.id.substring(5);
                        document.querySelector('#calendar thead tr:nth-child(2) th#D' + id).classList.remove(CLASS_LIST.VIEW);
                    },
        
                    mouseUp: function mouseup(e) {
        
                        SelectionGroup.free();
                        GL.DATA.CORE.isMouseDown = false;
                    },
                },

                th: {

                    mouseDown: function mousedown(e) {
    
                        e.target.classList.toggle(GL.CONST.CSS.CALENDAR.CLASS.VIEW_FIX);
                        var book = document.querySelector('#' + e.target.parentNode.id + '-book');
                        if (!book) {
                            console.log('Error. No book with id: ' + e.target.parentNode.id + '-book');
                            return;
                        }
        
                        var stDisplay = window.getComputedStyle(book).getPropertyValue('display');
                        if (book.style.display == 'none' || stDisplay == 'none') {
                            book.style.display = 'table-row';
                        } else {
                            book.style.display = 'none';
                        }
                    },
                },

            },

            book: {

                tr: {

                    mouseDown: function mousedown(e) {

                        if (e.which == 2) return;
        
                        if (e.which == 3) {

                            var guest = UTILS.CLONE(GL.CONST.SCHEMA.GUEST);
                            guest.year = this._getYear();
                            guest.mont = this._getMonth().num;
                                
                            var isAvailableBtn = true;

                            EventBus.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU, {
                                btn: {
                                    upd: isAvailableBtn,
                                    del: isAvailableBtn,
                                    add: !isAvailableBtn
                                },
                                x: e.pageX,
                                y: e.pageY,
                                guest
                            });
                            return;
                        };
        
                        const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
                        if (!e.target.closest('.inner-book')) {
                            var personRow = e.target.querySelector('.person-row');
                            personRow.classList.toggle(CLASS_LIST.VIEW_FIX);
                            personRow.classList.toggle(CLASS_LIST.VIEW);
                            document.querySelectorAll('#calendar > tbody > tr > td.' + personRow.id).forEach(function (el) {
                                if (that.classList.contains(CLASS_LIST.VIEW_FIX)) {
                                    el.classList.add(id + '-' + CLASS_LIST.VIEW_FIX);
                                    el.classList.remove(id + '-' + CLASS_LIST.VIEW);
                                } else {
                                    el.classList.add(id + '-' + CLASS_LIST.VIEW);
                                    el.classList.remove(id + '-' +CLASS_LIST.VIEW_FIX);
                                }
                            });
                        }
                    },
        
                    mouseOver: function mouseover(e) {

                        const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
                        var innerBook = e.target.closest('.book');
                        if (innerBook) {
                            var personRow = innerBook.querySelector('.person-row');
                            if (!personRow.classList.contains(CLASS_LIST.VIEW_FIX)) {
                                personRow.classList.add(CLASS_LIST.VIEW);
                                document.querySelectorAll('#calendar > tbody > tr > td.' + personRow.id).forEach(function (el) {
                                    el.classList.add(personRow.id + '-' + CLASS_LIST.VIEW);
                                });
                            }
                        }
                    },
        
                    mouseOut: function mouseout(e) {

                        const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
                        var innerBook = e.target.closest('.book');
                        if (innerBook) {
                            var personRow = innerBook.querySelector('.person-row');
                            if (!personRow.classList.contains(CLASS_LIST.VIEW_FIX)) {
                                personRow.classList.remove(CLASS_LIST.VIEW);
                                document.querySelectorAll('#calendar > tbody > tr > td.' + personRow.id).forEach(function (el) {
                                    el.classList.remove(personRow.id + '-' + CLASS_LIST.VIEW);
                                });
                            }
                        }
                    },
                },
            },

            control: {

                month: {

                    prev: function prevMonth(e) {

                        var monthNum = this._getMonth().num;
                        monthNum > 1 ? monthNum-- : monthNum = 12;
                        
                        var data = {
                            year: this._getYear(),
                            month: monthNum
                        }

                        DB.GL001.SELECT(data, this.eventId);
                    },

                    next: function nextMonth(e) {

                        var monthNum = this._getMonth().num;
                        monthNum > 11 ? monthNum = 1 : monthNum++;

                        var data = {
                            year: this._getYear(),
                            month: monthNum
                        }

                        DB.GL001.SELECT(data, this.eventId);
                    }
                },

                pickCalendar: function pickCalendar(e) {

                    var pickCalendar = new PickCalendar({
                        data: {
                            intent: GL.CONST.VALUES.CALENDAR.INTENT.PICK_CALENDAR,
                        },
                    });
                    pickCalendar.bind();
                    pickCalendar.setVal({
                        year: this._getYear(),
                        month: this._getMonth().num
                    });
                    pickCalendar.show();    
                }
            },

            dialog: {

                save: function (e) {

                    const E = GL.CONST.VALUES.CALENDAR.INTENT;
                    const GL001 = DB.GL001;
                    var data = e.detail.data;

                    switch (data.intent) {
                        case E.ADD: GL001.INSERT(data, this.eventId); break;
                        case E.UPD: GL001.UPDATE(data, this.eventId); break;
                        case E.DEL: GL001.DELETE(data, this.eventId); break;
                        case E.PICK_CALENDAR: pickCalendar(); break;    
                        default: break;
                    }

                    function pickCalendar() {
                        if (data.year < 1900) return;
                        GL001.SELECT(data, this.eventId);
                        DB.CF001.UPDATE(data, this.eventId);
                    }
                }
            },

            db: {
                cf001: {
                    select: {
                        success: function (e) { console.log(e.detail.data.msg); },
                        error: function (e) { }
                    },
                    update: {
                        success: function (e) { console.log(e.detail.data.msg); },
                        error: function (e) { }
                    },
                },
                rm001: {
                    select: {
                        success: function (e) {
                            const D = e.detail.data;
                            D.status && (GL.DATA.CALENDAR.rooms = D.data);
                        },
                        error: function (e) { }
                    },
                },
                gl001: {
                    insert: {
                        success: function (e) {
                            const D = e.detail.data;
                            if (!D.status) return;
                            this.addEntry(D.year, D.month, D.data);

                        },
                        error: function (e) { }
                    },
                    select: {
                        success: function (e) {
                            const D = e.detail.data;
                            if (!D.status) return;
                            this._setYear(D.year);
                            this._setMonth(D.month);
                            this._setEntries(D.data);
                            this._prepare();
                            this.addEntry(this._getEntries());
                        },
                        error: function (e) { }
                    },
                    update: {
                        success: function (e) {
                            const D = e.detail.data;
                            D.status && this.updEntry(D.old, D.new);
                        },
                        error: function (e) { }
                    },
                    delete: {
                        success: function (e) { 
                            const D = e.detail.data;
                            D.status && this.delEntry(D.data);
                        },
                        error: function (e) { }
                    },
                },
            }
        }
    }

    bind (target) {

        var tree =
            [{ tag: 'table', id: 'calendar', class: 'my-table' },
                [{ tag: 'thead', id: 'calendar-thead' },
                    [{ tag: 'tr', id: 'calendar-row-buttons' },
                        [{tag: 'td'},
                            [{ tag: 'table' },
                                [{ tag: 'tbody' },
                                    [{ tag: 'tr' },
                                        [{ tag: 'td' },
                                            { tag: 'span', id: 'button-month-prev', class: 'button-month', events: [{ name: 'click', fn: this.cb.control.month.prev, bind: this }] },
                                        ],
                                        [{ tag: 'td' },
                                            [{ tag: 'span', id: 'button-pick-calendar', events: [{ name: 'click', fn: this.cb.control.pickCalendar, bind: this }] },
                                                { tag: 'label', id: 'month' },
                                                { tag: 'label', id: 'year' },
                                            ],
                                        ],
                                        [{ tag: 'td' },
                                            { tag: 'span', id: 'button-month-next', class: 'button-month', events: [{ name: 'click', fn: this.cb.control.month.next, bind: this }] },
                                        ],
                                    ],
                                ],
                            ],    
                        ],
                    ],
                    [{ tag: 'tr', id: 'calendar-row-days' },
                        { tag: 'td' },
                    ],
                ],
                [{ tag: 'tbody', id: 'calendar-tbody' },
                ],
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) target.appendChild(tree);
        else console.log('tree is ' + tree);

        const L = this.cb;
        var qsParent, qsChild, qsParentExcl;

        qsParent = '#calendar > tbody'; qsChild = 'td', qsParentExcl = '.book-row';
        this._setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseDown.bind(this));
        this._setDelegate('mouseover', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseOver);
        this._setDelegate('mouseout', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseOut);
        this._setDelegate('mouseup', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseUp);

        qsParent = '#calendar > tbody'; qsChild = 'tr > th', qsParentExcl = '';
        this._setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.calendar.th.mouseDown);

        qsParent = '#calendar > tbody'; qsChild = '.book', qsParentExcl = '';
        this._setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.book.tr.mouseDown.bind(this));
        this._setDelegate('mouseover', qsParent, qsChild, qsParentExcl, L.book.tr.mouseOver);
        this._setDelegate('mouseout', qsParent, qsChild, qsParentExcl, L.book.tr.mouseOut);

        const E = GL.CONST.EVENTS.CALENDAR;
        EVENT_BUS.register(E.DIALOG_SAVE, L.dialog.save.bind(this));
        EVENT_BUS.register(E.RC_MENU.RC_MENU_OPEN, L.rcm.open);
        EVENT_BUS.register(E.RC_MENU.RCM_ITEM_ADD_GUEST, L.rcm.items.add);
        EVENT_BUS.register(E.RC_MENU.RCM_ITEM_DEL_GUEST, L.rcm.items.del);
        EVENT_BUS.register(E.RC_MENU.RCM_ITEM_UPD_GUEST, L.rcm.items.upd);
    
        EVENT_BUS.register(E.DB.GL001.INSERT.SUCCESS + this.eventId, L.db.gl001.insert.success.bind(this));
        EVENT_BUS.register(E.DB.GL001.SELECT.SUCCESS + this.eventId, L.db.gl001.select.success.bind(this));
        EVENT_BUS.register(E.DB.GL001.UPDATE.SUCCESS + this.eventId, L.db.gl001.update.success.bind(this));
        EVENT_BUS.register(E.DB.GL001.DELETE.SUCCESS + this.eventId, L.db.gl001.delete.success.bind(this));
    }

    init() {

        $.ajax({
            url: '../db/init.php',
            dataType: 'json',
            success: function onSuccess(data) {
                GL.DATA.CALENDAR.rooms = data.rooms;
                this._setYear(data.year);
                this._setMonth(data.month);
                this._setEntries(data.data);
                this._prepare();
                this.addEntry(this._getEntries());
            }.bind(this),
            error: function onError(xhr, textStatus, errorThrown) {
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }

    _prepare() {

        var self = this;
        free ();
        build ();

        function free() {
            
            var tbody = document.getElementById('calendar-tbody'),
                daysRow = document.getElementById('calendar-row-days');
            
            if (tbody) while (tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
            if (daysRow) while (daysRow.hasChildNodes()) daysRow.removeChild(daysRow.firstChild);
        }

        function build() {
            
            var today = new Date();
            const YEAR = self._getYear() || today.getFullYear();
            const MONTH = self._getMonth() || GL.CONST.VALUES.CALENDAR.MONTH_NAMES[today.getMonth() + 1];
            const DAYS = new Date(YEAR, MONTH.num, 0).getDate();
            // const ENTRIES = self._getEntries() || [];

            document.getElementById('calendar-row-buttons').getElementsByTagName('td')[0].setAttribute('colspan', DAYS);

            var calendar = document.getElementById('calendar'),
                labelYear = calendar.querySelector('#year'),
                labelMonth = calendar.querySelector('#month');
            
            while (labelYear.firstChild) labelYear.removeChild(labelYear.firstChild);
            while (labelMonth.firstChild) labelMonth.removeChild(labelMonth.firstChild);

            labelYear.appendChild(document.createTextNode(YEAR));
            labelMonth.appendChild(document.createTextNode(MONTH.name));

            var daysRow = document.getElementById('calendar-row-days');

            var day = 0;
            while (day <= DAYS) {
                var th = document.createElement('th');
                if (day == 0) {
                    th.classList.add('blank-cell');
                } else {
                    let id = 'D' + YEAR + '-' + MONTH.num + '-' + UTILS.OVERLAY(day, '0', 2);
                    th.setAttribute('id', id)
                    th.appendChild(document.createTextNode(day));
                }
                daysRow.appendChild(th);
                day++;
            }

            var tbody = document.getElementById('calendar-tbody');
            for (var room of GL.DATA.CALENDAR.rooms) {
                var id = 'R' + room.room,
                    tr = document.createElement('tr');
                tr.setAttribute('id', id);
                var day = 0;
                while (day <= DAYS) {
                    var node;
                    if (0 == day) {
                        node = document.createElement('th');
                        node.appendChild(document.createTextNode(room.room));
                    } else {
                        let id = 'RD' + room.room + '_'  + YEAR + '-' + MONTH.num + '-' + UTILS.OVERLAY(day, '0', 2);
                        node = document.createElement('td');
                        node.setAttribute('id', id);
                        node.appendChild(document.createTextNode(''));
                    }
                    tr.appendChild(node);
                    day++;
                }
                tbody.appendChild(tr);
            }
        }
    }

    addEntry(data) {

        var self = this;
        var data = data || self._getEntries();

        if (!data || data.length == 0) return;

        const YEAR = this._getYear();
        const MONTH = this._getMonth().num;

        for (let i = 0; i < data.length; i++) {
            setCellColor(data[i]);
            setBookEntry(data[i]);
        }

        function setCellColor(wa) {

            const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
            var begda = new Date(wa.dbeg),
                endda = new Date(wa.dend),
                curda = new Date(),
                tmpda = begda;

            while (tmpda <= endda) {
                if (!isDateValid(tmpda)) {
                    tmpda.setDate(tmpda.getDate() + 1);
                    continue;
                }

                //FIX: replace innerHTML (memory leak)
                var cell = document.querySelector('#calendar #R' + wa.room + ' #RD' + wa.room + '_' + tmpda.format('yyyy-mm-dd'));
                cell.innerHTML = '';

                // добавляем класс
                if (cell.classList.contains(CLASS_LIST.REDEEMED) || cell.classList.contains(CLASS_LIST.RESERVED)) {
                    cell.classList.remove(CLASS_LIST.REDEEMED, CLASS_LIST.RESERVED);
                    cell.classList.add(CLASS_LIST.ADJACENT);
                } else {
                    cell.classList.remove(CLASS_LIST.SELECTED);
                    (tmpda < curda) ? cell.classList.add(CLASS_LIST.REDEEMED) : cell.classList.add(CLASS_LIST.RESERVED);
                }
                cell.classList.add('N' + wa.unid);

                // добавляем подсказку  
                var div = cell.getElementsByTagName('div'),
                    hintText = '№' + wa.unid + ' ' + wa.name + ' с ' + begda.format('dd.mm') + ' по ' + endda.format('dd.mm');
                if (div.length == 0) {
                    var span = document.createElement('span');
                    span.setAttribute('class', 'hint-text');
                    span.appendChild(document.createTextNode(hintText));
                    div = document.createElement('div');
                    div.setAttribute('class', 'hint');
                    div.appendChild(span);
                    cell.append(div);
                } else {
                    div.children('span').append('<br>' + hintText);
                }

                tmpda.setDate(tmpda.getDate() + 1);
            }
        }

        function isDateValid(d) {
            return d.format('yyyy-mm') == (YEAR + '-' + MONTH);
        }

        function setBookEntry(wa) {

            const SCHEMA = GL.CONST.SCHEMA.GUEST;

            var tree,
                days = new Date(YEAR, MONTH, 0).getDate();
            
            if (!document.getElementById('R' + wa.room + '-book')) {
                tree =
                    [{ tag: 'tr', id: 'R' + wa.room + '-book', class: 'hidden book-row' },
                        [{ tag: 'td', colspan: (days + 1) },
                            [{ tag: 'table', class: 'book' },
                                { tag: 'tbody' }
                            ]
                        ]
                    ];
                tree = new DOMTree(tree).cultivate();
                var tr = document.querySelector('#calendar tbody tr#R' + wa.room);
                tr.parentNode.insertBefore(tree, tr.nextSibling);
            }

            tree =
                [{ tag: 'tr', id: 'N' + wa.unid, class: 'person-row' },
                    { tag: 'td', class: 'person-fields ' + SCHEMA.UNID, textNode: wa.unid },
                    [{ tag: 'td' },
                        [{ tag: 'table', class: 'inner-book' },
                            [{ tag: 'tbody' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: 'person-fields person-base-info' },
                                        { tag: 'a', class: 'person-fields ' + SCHEMA.NAME, textNode: wa.name },
                                        { tag: 'a', class: 'person-fields ' + SCHEMA.TELN, textNode: wa.teln },
                                    ],
                                    { tag: 'td', class: 'person-fields person-dates ' + SCHEMA.DBEG, textNode: 'с  ' + (new Date(wa.dbeg).format('dd.mm')) },
                                    { tag: 'td', class: 'person-fields ' + SCHEMA.ROOM, rowspan: 2, textNode: wa.room },
                                    { tag: 'td', class: 'person-fields ' + SCHEMA.COST, textNode: wa.cost },
                                ],
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: 'person-fields person-additional-info' },
                                        { tag: 'a', class: 'person-fields ' + SCHEMA.CITY, textNode: wa.city },
                                        { tag: 'a', class: 'person-fields ' + SCHEMA.FNOT, textNode: wa.fnot },
                                    ],
                                    { tag: 'td', class: 'person-fields person-dates ' + SCHEMA.DEND, textNode: 'по ' + (new Date(wa.dend).format('dd.mm')) },
                                    { tag: 'td', class: 'person-fields ' + SCHEMA.PAID , textNode: wa.paid },
                                ],
                                [{ tag: 'tr', style: 'display:none;' },
                                    { tag: 'td', class: 'person-fields ' + SCHEMA.DAYS, textNode: wa.days },
                                    { tag: 'td', class: 'person-fields ' + SCHEMA.BASE, textNode: wa.base },
                                    { tag: 'td', class: 'person-fields ' + SCHEMA.ADJS, textNode: wa.adjs }
                                ]
                            ]
                        ]
                    ]
                ];    
            tree = new DOMTree(tree).cultivate();
            document.querySelector('#R' + wa.room + '-book .book tbody').appendChild(tree);
        }
    }

    delEntry(list) {

        for (let i = 0; i < list.length; i++) {
            var wa = list[i];

            // calendar begin
            const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
            var room = wa.room,
                begda = new Date(wa.dbeg),
                endda = new Date(wa.dend),
                curda = new Date();

            while (begda <= endda) {
                var date = begda.format('yyyy-mm-dd'),
                    td = document.querySelector('#calendar tbody tr#R' + room + ' td#RD' + room + '_' + date);
                if (!td) {
                    begda.setDate(begda.getDate() + 1);
                    continue;
                }
                td.classList.remove('N' + wa.unid);
                td.classList.remove('N' + wa.unid + '-' + CLASS_LIST.VIEW_FIX);
                td.classList.remove('N' + wa.unid + '-' + CLASS_LIST.VIEW);
                if (td.classList.contains(CLASS_LIST.ADJACENT)) {
                    td.classList.remove(CLASS_LIST.ADJACENT);
                    if (begda < curda) {
                        td.classList.add(CLASS_LIST.REDEEMED);
                    } else {
                        td.classList.add(CLASS_LIST.RESERVED);
                    }
                } else {
                    td.classList.remove(CLASS_LIST.REDEEMED);
                    td.classList.remove(CLASS_LIST.RESERVED);
                }
                td.innerHTML = ''; //FIX: memory leak
                begda.setDate(begda.getDate() + 1);
            }
            // calendar end

            // book begin
            var tr = document.querySelector('.book > tbody > tr#N' + wa.unid);
            tr.parentNode.removeChild(tr);
            if (this.isEmptyBook(wa.room)) {
                tr = document.querySelector('#calendar > tbody > tr#R' + wa.room + '-book');
                tr.parentNode.removeChild(tr);
            }
            // book end
        }
    }

    updEntry(oldEntry, newEntry) {

        this.delEntry(oldEntry);
        this.addEntry(newEntry)

        const wa = newEntry[0];

        /**
         * SORT  
         */
        var tr = document.querySelectorAll('#R' + wa.room + '-book > td > .book > tbody > tr'),
            pos = [];
        for (let i = 0; i < tr.length; i++) {
            pos.push({
                id: parseInt(tr[i].querySelector('.' + GL.CONST.SCHEMA.GUEST.UNID), 10),
                pos: i
            });
        }

        pos.sort(function (a, b) {
            return a.id - b.id;
        });

        var prevRow = document.querySelector('#R' + wa.room + '-book tr#N' + pos[0].id);
        for (let i = 0; i < (pos.length - 1); i++) {
            if (pos[i].pos > pos[i + 1].pos) {
                var curRow = document.querySelector('#R' + wa.room + '-book tr#N' + pos[i].id),
                    nextRow = document.querySelector('#R' + wa.room + '-book tr#N' + pos[i + 1].id);
                nextRow.parentNode.insertBefore(nextRow, curRow);
            }
            prevRow = document.querySelector('#R' + wa.room + '-book tbody tr#N' + pos[i].id);
        }
    }

    _setMonth(month) {
        var parsedValue = parseInt(month);
        Number.isInteger(parsedValue) ? this.month = parsedValue : GL.CONST.VALUES.CALENDAR.MONTH_NAMES.indexOf(month);
        // document.getElementById('month').innerHTML = month;
    }

    _getMonth() {
        // var month = GL.CONST.VALUES.CALENDAR.MONTH_NAMES.indexOf(document.getElementById('month').innerHTML);
        // month = UTILS.OVERLAY(month, '0', 2)
        return {
            name: GL.CONST.VALUES.CALENDAR.MONTH_NAMES[this.month], //document.getElementById('month').innerHTML,
            num: UTILS.OVERLAY(this.month, '0', 2),
        }
    }

    _setYear(year) {
        this.year = year;
        // document.getElementById('year').innerHTML = year;
    }

    _getYear() {
        return this.year;
        // return document.getElementById('year').innerHTML;
    }

    _setEntries(entries) {
        this.entries = entries;
    }

    _getEntries() {
        return this.entries;
    }

    _isEmptyBook(room) {
        return !document.querySelector('#R' + room + '-book tbody').childElementCount;
    }

    _setDelegate(eventName, qsParent, qsChild, qsClosestExcl, callback) {

        var parent = document.querySelector(qsParent),
            that = {
                parent: parent,
                qsParent: qsParent,
                qsChild: qsChild,
                qsClosestExcl: qsClosestExcl,
                callback: callback
            };

        parent.addEventListener(eventName, function delegateListener(e) {
            var target = e.target;
            if (this.qsClosestExcl) if (target.closest(this.qsClosestExcl)) return;
            var childs = this.parent.querySelectorAll(this.qsChild);
            if (Array.from(childs).indexOf(target) != -1) return this.callback.call(e, e);
            for (var child of childs) {
                if (child.contains(target)) return this.callback.call(e, e);
            }
        }.bind(that));
    }
}

class SelectionGroup {

    constructor() {
        this.classId = undefined;
    }
    
    /**
     * Очистка ID текущего обрабатываемого класса
     */
    static free() {

        this.classId = undefined;
    }

    /**
     * Формирование ID нового класса
     */
    static gen() {

        this.classId = 'sel-group-' + Math.ceil((Math.random() * 100000));
    }

    /**
     * Добавление класса к объекту.
     * Если ID класса не сформирован то перед добавление будет вызван метод формирующий ID класса
     */
    static add(target) {

        !this.classId && this.gen();
        target.classList.add(this.classId);
        this.enum(this.classId);
    }

    /**
     * Поиск ID класса присвоенного объекту с последующим удалением и пересчетом оставшихся элементов 
     * которым присвоей этот ID
     */
    static del(target) {

        const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
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
                    group[0].classList.remove(CLASS_LIST.SELECTED);
                    group[0].classList.remove(classId);
                    break;
                } else {
                    group[0].innerHTML = '';
                    group[0].classList.remove(CLASS_LIST.SELECTED);
                    group[0].classList.remove(classId);
                }
            }
            target.classList.remove(classId);
            target.innerHTML = '';
            this.enum(classId);
        }
    }

    /**
     * Пересчет кол-ва объектов класса по ID класса 
     */
    static enum(classId) {

        var group = document.getElementsByClassName(classId);
        for (let i = 0; i < group.length; i++) {
            //FIX: inner html memory leak
            group[i].innerHTML = (i + 1);
        }
    }
}