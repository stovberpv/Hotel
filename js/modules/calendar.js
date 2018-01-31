/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */
(function () {
    "use strict";
})();
class Calendar extends DataWrapper {

    constructor () {
        super();

        this.eventId = 'calendar';
        this.year = null;
        this.month = null;
        this.entries = null;
        /** 
         * ID обрабатываемого класса 
         * FIX: при переходе на новую строку начинать отсчет заново
         */
        this.classId = null;

        this.cb = {

            rcm: {

                open: function RCMenuOpen(e) {

                    if (!e.detail.EventBus) {
                        console.log('Invalid function call.');//TODO: console log
                        return;
                    }

                    var rcmenu = new RCMenu(e.detail.data);
                    rcmenu.bind();
                    rcmenu.show();
                },

                items: {

                    add: function RCMItemAddGuest(e) {
    
                        //FIX: not working invalid date maybe str 208
                        var guestCard = new GuestCard({
                            intent: GL.CONST.VALUES.CALENDAR.INTENT.ADD.key,
                            title: GL.CONST.VALUES.CALENDAR.INTENT.ADD.txt,
                            month: this._getMonth().num,
                            year: this._getYear(),
                            rooms: GL.DATA.CALENDAR.rooms
                        });
                        guestCard.bind();
                        guestCard.setVal(e.detail.data);
                        guestCard.show();
                    },
        
                    del: function RCMItemDelGuest(e) {

                        var confirmDialog = new ConfirmDialog({
                            intent: GL.CONST.VALUES.CALENDAR.INTENT.DEL.key,
                            title: GL.CONST.VALUES.CALENDAR.INTENT.DEL.txt,
                            text: `Вы действительно хотите удалить запись под номером${e.detail.data.unid}?
                                    Действие нельзя будет отменить`, //TODO: move to localizable constants
                            cb: {
                                ok: function (result) {
                                    EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.DIALOG_SAVE, { data: result.intent });
                                }
                            }
                        });
                        confirmDialog.bind();
                        confirmDialog.show();
                    },
        
                    upd: function RCMItemUpdGuest(e) {
        
                        const I = GL.CONST.VALUES.CALENDAR.INTENT.UPD;
                        const E = GL.CONST.EVENTS.CALENDAR.DB.GL001.SELECT.SUCCESS;

                        var regExp = /\d+/,
                            unid = e.detail.data.unid,
                            year = this._getYear(),
                            month = this._getMonth();
                        
                        unid = regExp.test(unid) ? unid.match(/\d+/)[0] : -1;
                        EVENT_BUS.register(`${E}${I.key}`, showGuestCard, true);
                        DB.GL001.SELECT({ unid: unid }, I.key);

                        function showGuestCard(e) {
                            var guestCard = new GuestCard({
                                intent: I.key,
                                title: I.txt,
                                isEditable: true,
                                isStrict: true,
                                month: month.num,
                                year: year,
                                rooms: GL.DATA.CALENDAR.rooms
                            });
                            guestCard.bind();
                            guestCard.setVal(e.detail.data.data[0]);
                            guestCard.show();
                        }
                    },
                },
            },

            calendar: {

                td: {

                    mouseDown: function mousedown(e) {

                        const CLASS = GL.CONST.CSS.CALENDAR.CLASS;
                        const TARGET = e.target;
                        
                        var self = this,
                            guest = UTILS.CLONE(GL.CONST.SCHEMA.GUEST),
                            isAvailableButton;

                        switch (e.which) {
                            case 1: leftMouse(); return;
                            case 3: rightMouse(); return;
                            default: return;
                        }

                        function leftMouse() {
                            toggleSelection();
                            toggleView();
                        }

                        function toggleSelection() {
                            GL.DATA.CORE.isMouseDown = true;
                            if (TARGET.classList.length == 0 || TARGET.classList.contains(CLASS.SELECTED)) {
                                TARGET.classList.toggle(CLASS.SELECTED);
                            }
                            GL.DATA.CALENDAR.isSelected = TARGET.classList.contains(CLASS.SELECTED);
                            SelectionGroup.del(TARGET);
                            GL.DATA.CALENDAR.isSelected ? SelectionGroup.add(e.target) : SelectionGroup.free();
                        }

                        function toggleView() {
                            let ids = TARGET.className.split(' ').filter(function (el) { return el.match(/^N\d+$/g); });
                            for (let i = 0; i < ids.length; i++) {
                                document.querySelectorAll(`#calendar > tbody > tr > td.${ids[i]}`).forEach(function (el) {
                                    el.classList.toggle(`${ids[i]}-${CLASS.VIEW_FIX}`);
                                    el.classList.toggle(`${ids[i]}-${CLASS.VIEW}`);
                                });
                                
                                document.querySelector(`.book > tbody > tr#${ids[i]}`).classList.toggle(CLASS.VIEW_FIX);
                                document.querySelector(`.book > tbody > tr#${ids[i]}`).classList.toggle(CLASS.VIEW);
                            }
                        }

                        function rightMouse() {
                            if (!getCalendarEntry()) return;
                            guest.year = self._getYear();
                            guest.mnth = self._getMonth().num;
                            openRCMenu();
                        }

                        function getCalendarEntry() {

                            var result = false;
                            
                            if (TARGET.classList.contains(CLASS.SELECTED)) {
                                isAvailableButton = true;
                                result = getNewEntryData();
                            } else if (TARGET.classList.contains(CLASS.REDEEMED) || TARGET.classList.contains(CLASS.RESERVED)) {
                                isAvailableButton = false;
                                result = getExistingEntryData();
                            } else {
                                isAvailableButton = null;
                                //TODO: console log
                                // result = false;
                            }

                            return result;
                            
                            function getNewEntryData() {
                                var idGroupFilter = function (el) { return el.match(/\bsel-group-\d+/g); },
                                    groupId = TARGET.className.split(' ').filter(idGroupFilter).toString(),
                                    rowId = TARGET.id.match(/[^R]\d+/i) || [];
                            
                                if (!groupId) {
                                    //TODO: console log
                                    return false;
                                }

                                if (!rowId[0]) {
                                    //TODO: console log
                                    return false;
                                }
                                
                                var group = document.querySelectorAll(`#calendar > tbody > tr#R${rowId[0]} > td.${groupId}`),
                                    begda = group[0].id.match(/\d{4}-\d{2}-\d{2}/) || [],
                                    endda = group[group.length - 1].id.match(/\d{4}-\d{2}-\d{2}/) || [];
        
                                if (!begda) {
                                    //TODO: console log
                                    return false;
                                }

                                if (!endda) {
                                    //TODO: console log
                                    return false;
                                }
                                guest.unid = '-1';
                                guest.room = rowId;
                                guest.dbeg = new Date(begda[0]).format('dd.mm');
                                guest.dend = new Date(endda[0]).format('dd.mm');
                                return true;
                            }

                            function getExistingEntryData() {
                                var idFilter = function (el) { return el.match(/^N\d+$/); },
                                    unid = TARGET.className.split(' ').filter(idFilter).toString();
                                if (!unid) {
                                    //TODO: console log
                                    return false;
                                }
                                guest.unid = unid;
                                return true;
                            }

                        }

                        function openRCMenu() {
                            EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU.RC_MENU_OPEN, {
                                item: {
                                    upd: !isAvailableButton,
                                    del: !isAvailableButton,
                                    add: isAvailableButton
                                },
                                x: e.pageX,
                                y: e.pageY,
                                guest
                            });
                        }
                    },
        
                    mouseOver: function mouseover(e) {
        
                        const CLASS = GL.CONST.CSS.CALENDAR.CLASS;
                        const TARGET = e.target;
                        
                        toggleSelection();
                        toggleView();

                        function toggleSelection() {
                            if (GL.DATA.CORE.isMouseDown) {
                                if (TARGET.classList.length == 0 || TARGET.classList.contains(CLASS.SELECTED)) {
                                    SelectionGroup.del(e.target);
                                    GL.DATA.CALENDAR.isSelected && SelectionGroup.add(e.target);
                                    TARGET.classList.toggle(CLASS.SELECTED, GL.DATA.CALENDAR.isSelected);
                                } else {
                                    SelectionGroup.free();
                                }
                            }
                        }

                        function toggleView() {
                            var idList = TARGET.className.split(' ').filter(function (el) { return el.match(/^N\d+$/g); });
                            for (let id of idList) {

                                var cells = document.querySelectorAll(`#calendar > tbody > tr > td.${id}`),
                                    bookRow = document.querySelector(`.book > tbody > tr#${id}`), 
                                    viewfix = `${id}-${CLASS.VIEW_FIX}`,
                                    view = `${id}-${CLASS.VIEW}`;
                                
                                for (let cell of cells) {
                                    if (cell.classList.contains(viewfix)) continue;
                                    if (cell.classList.contains(view)) continue;
                                    cell.classList.add(view);
                                }
                                if (bookRow.classList.contains(CLASS.VIEW_FIX)) continue;
                                if (bookRow.classList.contains(CLASS.VIEW)) continue;
                                bookRow.classList.add(CLASS.VIEW);
                            }
                            var date = TARGET.id.match(/\d{4}-\d{2}-\d{2}/i) || [];
                            if (!date[0]) {
                                //TODO: log
                                return;
                            }
                            document.querySelector(`#calendar > thead tr:nth-child(2) th#D${date[0]}`).classList.add(CLASS.VIEW);
                        }
                    },
        
                    mouseOut: function mouseout(e) {
        
                        const CLASS = GL.CONST.CSS.CALENDAR.CLASS;
                        const TARGET = e.target;
                        
                        toggleView();

                        function toggleView() {
                            var idList = TARGET.className.split(' ').filter(function (el) { return el.match(/^N\d+$/g); });
                            for (let id of idList) {

                                var cells = document.querySelectorAll(`#calendar > tbody > tr > td.${id}`),
                                    viewfix = `${id}-${CLASS.VIEW_FIX}`,
                                    view = `${id}-${CLASS.VIEW}`;
                                
                                for (let cell of cells) { cell.classList.remove(view); }
                                document.querySelector(`.book > tbody > tr#${id}`).classList.remove(CLASS.VIEW);
                            }
                            var date = TARGET.id.match(/\d{4}-\d{2}-\d{2}/i) || [];
                            if (!date[0]) {
                                //TODO: log
                                return;
                            }
                            document.querySelector(`#calendar > thead tr:nth-child(2) th#D${date[0]}`).classList.remove(CLASS.VIEW);
                        }
                    },
        
                    mouseUp: function mouseup(e) {
        
                        SelectionGroup.free();
                        GL.DATA.CORE.isMouseDown = false;
                    },
                },

                th: {

                    mouseDown: function mousedown(e) {

                        const TARGET = e.target;
    
                        TARGET.classList.toggle(GL.CONST.CSS.CALENDAR.CLASS.VIEW_FIX);
                        var book = document.querySelector(`#${TARGET.parentNode.id}-book`);
                        if (!book) {
                            console.log(`Error. No book with id: ${TARGET.parentNode.id}-book`); //FIX: log
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

                        const CLASS = GL.CONST.CSS.CALENDAR.CLASS;
                        const TARGET = e.target;

                        var self = this,
                            book = TARGET.closest('.book'),
                            guest = UTILS.CLONE(GL.CONST.SCHEMA.GUEST),
                            isAvailableButton;
                        
                        switch (e.which) {
                            case 1: leftMouse(); return;
                            case 3: rightMouse(); return;
                            default: return;
                        }
                        
                        function leftMouse() {

                            var personRow = book.querySelector('.person-row'),
                                id = personRow.id;
                            personRow.classList.toggle(CLASS.VIEW_FIX);
                            personRow.classList.toggle(CLASS.VIEW);
                            document.querySelectorAll(`#calendar > tbody > tr > td.${id}`).forEach(function (el) {
                                el.classList.toggle(`${id}-${CLASS.VIEW_FIX}`);
                                el.classList.toggle(`${id}-${CLASS.VIEW}`);
                            });
                        }

                        function rightMouse() {
                            getBookEntry();
                            guest.year = self._getYear();
                            guest.mnth = self._getMonth().num;
                            isAvailableButton = true;
                            openRCMenu();
                        }

                        function getBookEntry() {
                            const SCHEMA = GL.CONST.SCHEMA.GUEST;
                            guest.unid = book.querySelector(`.person-cell-${SCHEMA.UNID.key}`).textContent;
                            guest.dbeg = book.querySelector(`.person-cell-${SCHEMA.DBEG.key}`).getAttribute('value');
                            guest.dend = book.querySelector(`.person-cell-${SCHEMA.DEND.key}`).getAttribute('value');
                            guest.days = book.querySelector(`.person-cell-${SCHEMA.DAYS.key}`).textContent;
                            guest.room = book.querySelector(`.person-cell-${SCHEMA.ROOM.key}`).textContent;
                            guest.base = book.querySelector(`.person-cell-${SCHEMA.BASE.key}`).textContent;
                            guest.adjs = book.querySelector(`.person-cell-${SCHEMA.ADJS.key}`).textContent;
                            guest.cost = book.querySelector(`.person-cell-${SCHEMA.COST.key}`).textContent;
                            guest.paid = book.querySelector(`.person-cell-${SCHEMA.PAID.key}`).textContent;
                            guest.name = book.querySelector(`.person-cell-${SCHEMA.NAME.key}`).textContent;
                            guest.teln = book.querySelector(`.person-cell-${SCHEMA.TELN.key}`).textContent;
                            guest.fnot = book.querySelector(`.person-cell-${SCHEMA.FNOT.key}`).textContent;
                            guest.city = book.querySelector(`.person-cell-${SCHEMA.CITY.key}`).textContent;

                            guest.dbeg = new Date(guest.dbeg).format('dd.mm');
                            guest.dend = new Date(guest.dend).format('dd.mm');
                        }

                        function openRCMenu() {
                            EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU.RC_MENU_OPEN, {
                                item: {
                                    upd: isAvailableButton,
                                    del: isAvailableButton,
                                    add: !isAvailableButton
                                },
                                x: e.pageX,
                                y: e.pageY,
                                guest
                            });
                        }
                    },
        
                    mouseOver: function mouseover(e) {

                        const CLASS = GL.CONST.CSS.CALENDAR.CLASS;

                        var innerBook = e.target.closest('.book');
                        if (!innerBook) return;

                        var personRow = innerBook.querySelector('.person-row');
                        if (personRow.classList.contains(CLASS.VIEW_FIX)) return;

                        personRow.classList.add(CLASS.VIEW);
                        document.querySelectorAll(`#calendar > tbody > tr > td.${personRow.id}`).forEach(function (el) {
                            el.classList.add(`${personRow.id}-${CLASS.VIEW}`);
                        });
                    },
        
                    mouseOut: function mouseout(e) {

                        const CLASS = GL.CONST.CSS.CALENDAR.CLASS;

                        var innerBook = e.target.closest('.book');
                        if (!innerBook) return;

                        var personRow = innerBook.querySelector('.person-row');
                        if (personRow.classList.contains(CLASS.VIEW_FIX)) return;

                        personRow.classList.remove(CLASS.VIEW);
                        document.querySelectorAll(`#calendar > tbody > tr > td.${personRow.id}`).forEach(function (el) {
                            el.classList.remove(`${personRow.id}-${CLASS.VIEW}`);
                        });
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
                        };

                        DB.GL001.SELECT(data, this.eventId);
                    },

                    next: function nextMonth(e) {

                        var monthNum = this._getMonth().num;
                        monthNum > 11 ? monthNum = 1 : monthNum++;

                        var data = {
                            year: this._getYear(),
                            month: monthNum
                        };

                        DB.GL001.SELECT(data, this.eventId);
                    }
                },

                pickPeriod: function pickPeriod(e) {

                    var pickPeriod = new PickPeriod({
                        intent: GL.CONST.VALUES.CALENDAR.INTENT.PICK_PERIOD
                    });
                    pickPeriod.bind();
                    pickPeriod.setVal({
                        year: this._getYear(),
                        month: this._getMonth().num
                    });
                    pickPeriod.show();
                }
            },

            dialog: {

                save: function (e) {

                    const E = GL.CONST.VALUES.CALENDAR.INTENT;
                    const GL001 = DB.GL001;
                    var that = this;
                    var data = e.detail.data || this;

                    switch (data.intent) {
                        case E.ADD.key: GL001.INSERT(data, this.eventId); break;
                        case E.UPD.key: GL001.UPDATE(data, this.eventId); break;
                        case E.DEL.key: GL001.DELETE(data, this.eventId); break;
                        case E.PICK_PERIOD: pickPeriod(); break;
                        default: break;
                    }

                    function pickPeriod() {
                        if (data.year < 1900) return;
                        GL001.SELECT(data, that.eventId);
                        DB.CF001.UPDATE(data, that.eventId);
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
        };
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
                                            { tag: 'span', id: 'calendar-button-month-prev', class: 'button', events: [{ name: 'click', fn: this.cb.control.month.prev, bind: this }] },
                                        ],
                                        [{ tag: 'td' },
                                            [{ tag: 'span', id: 'calendar-button-pick-period', events: [{ name: 'click', fn: this.cb.control.pickPeriod, bind: this }] },
                                                { tag: 'label', id: 'month' },
                                                { tag: 'label', id: 'year' },
                                            ],
                                        ],
                                        [{ tag: 'td' },
                                            { tag: 'span', id: 'calendar-button-month-next', class: 'button', events: [{ name: 'click', fn: this.cb.control.month.next, bind: this }] },
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
        EVENT_BUS.register(E.RC_MENU.RCM_ITEM_ADD_GUEST, L.rcm.items.add.bind(this));
        EVENT_BUS.register(E.RC_MENU.RCM_ITEM_DEL_GUEST, L.rcm.items.del.bind(this));
        EVENT_BUS.register(E.RC_MENU.RCM_ITEM_UPD_GUEST, L.rcm.items.upd.bind(this));
    
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
                    th.setAttribute('id', id);
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
                day = 0;
                while (day <= DAYS) {
                    var node;
                    if (0 == day) {
                        node = document.createElement('th');
                        node.appendChild(document.createTextNode(room.room));
                    } else {
                        let id = `R${room.room}D${YEAR}-${MONTH.num}-${UTILS.OVERLAY(day, '0', 2)}`;
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
        data = data || self._getEntries();

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
                var cell = document.querySelector(`#calendar #R${wa.room} #R${wa.room}D${tmpda.format('yyyy-mm-dd')}`);
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
                    hintText = `№${wa.unid} ${wa.name} с ${begda.format('dd.mm')} по ${endda.format('dd.mm')}`;
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

            const E = GL.CONST.SCHEMA.GUEST;

            var tree,
                days = new Date(YEAR, MONTH, 0).getDate();
            
            if (!document.getElementById(`R${wa.room}-book`)) {
                tree =
                    [{ tag: 'tr', id: `R${wa.room}-book`, class: 'hidden book-row' },
                        [{ tag: 'td', colspan: (days + 1) },
                            [{ tag: 'table', class: 'book' },
                                { tag: 'tbody' }
                            ]
                        ]
                    ];
                tree = new DOMTree(tree).cultivate();
                var tr = document.querySelector(`#calendar tbody tr#R${wa.room}`);
                tr.parentNode.insertBefore(tree, tr.nextSibling);
            }

            tree =//TODO: переделать классы
                [{ tag: 'tr', id: 'N' + wa.unid, class: 'person-row' },
                    { tag: 'td', class: `person-fields person-cell-${E.UNID.key}`, textNode: wa.unid },
                    [{ tag: 'td' },
                        [{ tag: 'table', class: 'inner-book' },
                            [{ tag: 'tbody' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: 'person-fields person-base-info' },
                                        { tag: 'a', class: `person-fields person-cell-${E.NAME.key}`, textNode: wa.name },
                                        { tag: 'a', class: `person-fields person-cell-${E.TELN.key}`, textNode: wa.teln },
                                    ],
                                    { tag: 'td', class: `person-fields person-dates person-cell-${E.DBEG.key}`, attr: { value: wa.dbeg }, textNode: new Date(wa.dbeg).format('dd.mm') },
                                    { tag: 'td', class: `person-fields person-cell-${E.ROOM.key}`, rowspan: 2, textNode: wa.room },
                                    { tag: 'td', class: `person-fields person-cell-${E.COST.key}`, textNode: wa.cost },
                                ],
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: 'person-fields person-additional-info' },
                                        { tag: 'a', class: `person-fields person-cell-${E.CITY.key}`, textNode: wa.city },
                                        { tag: 'a', class: `person-fields person-cell-${E.FNOT.key}`, textNode: wa.fnot },
                                    ],
                                    { tag: 'td', class: `person-fields person-dates person-cell-${E.DEND.key}`, attr: { value: wa.dend }, textNode: new Date(wa.dend).format('dd.mm') },
                                    { tag: 'td', class: `person-fields person-cell-${E.PAID.key}` , textNode: wa.paid },
                                ],
                                [{ tag: 'tr', style: { display: 'none;'} },
                                    { tag: 'td', class: `person-fields person-cell-${E.DAYS.key}`, textNode: wa.days },
                                    { tag: 'td', class: `person-fields person-cell-${E.BASE.key}`, textNode: wa.base },
                                    { tag: 'td', class: `person-fields person-cell-${E.ADJS.key}`, textNode: wa.adjs }
                                ]
                            ]
                        ]
                    ]
                ];    
            tree = new DOMTree(tree).cultivate();
            document.querySelector(`#R${wa.room}-book .book tbody`).appendChild(tree);
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
                    td = document.querySelector(`#calendar tbody tr#R${room} td#R${room}D${date}`); //FIX: R##D####-##-##
                if (!td) {
                    begda.setDate(begda.getDate() + 1);
                    continue;
                }
                td.classList.remove(`N${wa.unid}`);
                td.classList.remove(`N${wa.unid}_${CLASS_LIST.VIEW_FIX}`);
                td.classList.remove(`N${wa.unid}_${CLASS_LIST.VIEW}`);
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
            var tr = document.querySelector(`.book > tbody > tr#N${wa.unid}`);
            tr.parentNode.removeChild(tr);
            if (this.isEmptyBook(wa.room)) {
                tr = document.querySelector(`#calendar > tbody > tr#R${wa.room}-book`);
                tr.parentNode.removeChild(tr);
            }
            // book end
        }
    }

    updEntry(oldEntry, newEntry) {

        this.delEntry(oldEntry);
        this.addEntry(newEntry);

        const wa = newEntry[0];

        /**
         * SORT  
         */
        var tr = document.querySelectorAll(`#R${wa.room}-book > td > .book > tbody > tr`),
            pos = [];
        for (let i = 0; i < tr.length; i++) {
            pos.push({
                id: parseInt(tr[i].querySelector(`.${GL.CONST.SCHEMA.GUEST.UNID}`), 10),
                pos: i
            });
        }

        pos.sort(function (a, b) {
            return a.id - b.id;
        });

        var prevRow = document.querySelector(`#R${wa.room}-book tr#N${pos[0].id}`);
        for (let i = 0; i < (pos.length - 1); i++) {
            if (pos[i].pos > pos[i + 1].pos) {
                var curRow = document.querySelector(`#R${wa.room}-book tr#N${pos[i].id}`),
                    nextRow = document.querySelector(`#R${wa.room}-book tr#N${pos[i + 1].id}`);
                nextRow.parentNode.insertBefore(nextRow, curRow);
            }
            prevRow = document.querySelector(`#R${wa.room}-book tbody tr#N${pos[i].id}`);
        }
    }

    _setMonth(month) {
        var parsedValue = parseInt(month);
        this.month = Number.isInteger(parsedValue) ? parsedValue : GL.CONST.VALUES.CALENDAR.MONTH_NAMES.indexOf(month);
    }

    _getMonth() {
        return {
            name: GL.CONST.VALUES.CALENDAR.MONTH_NAMES[this.month],
            num: UTILS.OVERLAY(this.month, '0', 2),
        };
    }

    _setYear(year) {
        this.year = year;
    }

    _getYear() {
        return this.year;
    }

    _setEntries(entries) {
        this.entries = entries;
    }

    _getEntries() {
        return this.entries;
    }

    _isEmptyBook(room) {
        return !document.querySelector(`#R${room}-book tbody`).childElementCount;
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

        this.classId = `sel-group-${Math.ceil(Math.random() * 100000)}`;
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