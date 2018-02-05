/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */
(function () { "use strict"; })();

/**
 * 
 * @class SelectionGroup
 */
class SelectionGroup {

    constructor() { this.classId = undefined; }
    
    /**
     * Очистка ID текущего обрабатываемого класса
     */
    static free() { this.classId = undefined; }

    /**
     * Формирование ID нового класса
     */
    static gen() { this.classId = `${GL.CONST.PREFIX.SELECTION_GROUP}-${Math.ceil(Math.random() * 100000)}`; }

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

        let classId = target.className.split(' ').filter(function (el) { return el.match(/\bsel-group-\d+/); }).toString();
        let group = document.getElementsByClassName(classId);
        for (let i = group.length; i > 0; i--) {
            let el = group[0];
            while (el.hasChildNodes()) el.removeChild(el.firstChild);
            el.classList.remove(GL.CONST.CSS.CALENDAR.CLASS.SELECTED);
            el.classList.remove(classId);
            if (el.id == target.id) break; 
        }
        this.enum(classId);
    }

    /**
     * Пересчет кол-ва объектов класса по ID класса 
     */
    static enum(classId) {

        let i = 1;
        for (let el of document.getElementsByClassName(classId)) {
            while (el.hasChildNodes()) el.removeChild(el.firstChild);
            el.textContent = (i++);
        }
    }
}

/**
 * 
 * @class IGuest
 */
class IGuest {
    constructor(entries) {
        if (entries === undefined) return;
        this._intn = entries.intn;
        this._year = entries.year;
        this._mnth = entries.mnth;
        this._unid = entries.unid;
        this._dbeg = entries.dbeg;
        this._dend = entries.dend;
        this._days = entries.days;
        this._room = entries.room;
        this._base = entries.base;
        this._adjs = entries.adjs;
        this._cost = entries.cost;
        this._paid = entries.paid;
        this._name = entries.name;
        this._teln = entries.teln;
        this._fnot = entries.fnot;
        this._city = entries.city;
    }

    static get intn() { return 'intn'; }
    static get year() { return 'year'; }
    static get mnth() { return 'mnth'; }
    static get unid() { return 'unid'; }
    static get dbeg() { return 'dbeg'; }
    static get dend() { return 'dend'; }
    static get days() { return 'days'; }
    static get room() { return 'room'; }
    static get base() { return 'base'; }
    static get adjs() { return 'adjs'; }
    static get cost() { return 'cost'; }
    static get paid() { return 'paid'; }
    static get name() { return 'name'; }
    static get teln() { return 'teln'; }
    static get fnot() { return 'fnot'; }
    static get city() { return 'city'; }
}

/**
 * 
 * @class Guest
 * @extends IGuest
 */
class Guest extends IGuest {

    /**
     * Creates an instance of Guest.
     * @param  {any} entries 
     * @memberof Guest
     */
    constructor(entries) {
        super(entries);
        this.id = Math.floor(Math.random() * 100000);
    }
    set intn(intn) { this._intn = intn || ''; } get intn() { return this._intn || ''; }
    set year(year) { this._year = year || ''; } get year() { return this._year || ''; }
    set mnth(mnth) { this._mnth = mnth || ''; } get mnth() { return this._mnth || ''; }
    set unid(unid) { this._unid = unid || ''; } get unid() { return this._unid || ''; }
    set dbeg(dbeg) { this._dbeg = dbeg || ''; } get dbeg() { return this._dbeg || ''; }
    set dend(dend) { this._dend = dend || ''; } get dend() { return this._dend || ''; }
    set days(days) { this._days = days || ''; } get days() { return this._days || ''; }
    set room(room) { this._room = room || ''; } get room() { return this._room || ''; }
    set base(base) { this._base = base || ''; } get base() { return this._base || ''; }
    set adjs(adjs) { this._adjs = adjs || ''; } get adjs() { return this._adjs || ''; }
    set cost(cost) { this._cost = cost || ''; } get cost() { return this._cost || ''; }
    set paid(paid) { this._paid = paid || ''; } get paid() { return this._paid || ''; }
    set name(name) { this._name = name || ''; } get name() { return this._name || ''; }
    set teln(teln) { this._teln = teln || ''; } get teln() { return this._teln || ''; }
    set fnot(fnot) { this._fnot = fnot || ''; } get fnot() { return this._fnot || ''; }
    set city(city) { this._city = city || ''; } get city() { return this._city || ''; }
}

/**
 * 
 * @class Calendar
 * @extends DataWrapper
 */
class Calendar extends DataWrapper {

    /**
     * Creates an instance of Calendar.
     * @memberof Calendar
     */
    constructor() {
        super();
        
        this._eventId = 'calendar';
        this._year = new Date().getFullYear();
        this._month = new Date().getMonth() + 1;
        this._guest = [];
        this._rooms = [];
        this._isSelected = false;

        this._intent = {
            add: { key: 'add', txt: 'Добавить' },
            upd: { key: 'upd', txt: 'Изменить' },
            del: { key: 'del', txt: 'Удалить' },
            ext: { key: 'ext', txt: '' },
            pickPeriod: 'pick-period'
        };

        this.cb = {

            rcm: {

                open: function RCMenuOpen(e) {

                    if (!e.detail.EventBus) {
                        UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A000.TITLE, GL.CONST.LOG.ID.A000.GIST);
                        return;
                    }

                    let rcmenu = new RCMenu(e.detail.data);
                    rcmenu.bind();
                    rcmenu.show();
                },

                items: {

                    add: function RCMItemAddGuest(e) {
    
                        let guestCard = new GuestCard({
                            intent: this.intent.add.key,
                            title:this.intent.add.txt,
                            isReadOnly: false,
                            isStrict: true,
                            month: this.month.num,
                            year: this.year,
                            rooms: this.rooms
                        });
                        guestCard.bind();
                        guestCard.setVal(e.detail.data);
                        guestCard.show();
                    },
        
                    del: function RCMItemDelGuest(e) {

                        let unid = e.detail.data.unid.match(/\d+/)[0];
                        let confirmDialog = new ConfirmDialog({
                            intent: this.intent.del.key,
                            title: this.intent.del.txt,
                            text: UTILS.FORMAT(GL.CONST.LOCALIZABLE.MSG001, {1:unid}),
                            data: { unid: unid },
                            cb: { ok: function (data) { EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.DIALOG_SAVE, data); } }
                        });
                        confirmDialog.bind();
                        confirmDialog.show();
                    },
        
                    upd: function RCMItemUpdGuest(e) {
        
                        const I = this.intent.upd;
                        const E = GL.CONST.EVENTS.CALENDAR.DB.GL001.SELECT.SUCCESS;

                        let self = this,
                            regExp = /\d+/,
                            unid = e.detail.data.unid;
                        
                        unid = regExp.test(unid) ? unid.match(/\d+/)[0] : -1;
                        EVENT_BUS.register(`${E}${I.key}`, showGuestCard, true);
                        DB.GL001.SELECT({ unid: unid }, I.key);

                        function showGuestCard(e) {
                            let guestCard = new GuestCard({
                                intent: I.key,
                                title: I.txt,
                                isReadOnly: false,
                                isStrict: true,
                                month: self.month.num,
                                year: self.year,
                                rooms: self.rooms
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

                        let self = this,
                            guest = new Guest(),
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
                            (TARGET.classList.length === 0 || TARGET.classList.contains(CLASS.SELECTED)) && TARGET.classList.toggle(CLASS.SELECTED);
                            self.isSelected = TARGET.classList.contains(CLASS.SELECTED);
                            SelectionGroup.del(TARGET);
                            self.isSelected ? SelectionGroup.add(e.target) : SelectionGroup.free();
                        }

                        function toggleView() {
                            let ids = TARGET.className.split(' ').filter(function (el) { return el.match(/^N\d+$/g); });
                            for (let i = 0; i < ids.length; i++) {
                                document.querySelectorAll(`#calendar > tbody > tr > td.${ids[i]}`).forEach(function (el) {
                                    el.classList.toggle(`${ids[i]}-${CLASS.VIEW_FIX}`);
                                    el.classList.toggle(`${ids[i]}-${CLASS.VIEW}`);
                                });

                                let bookRow = document.querySelector(`.book > tbody > tr#${ids[i]}`);
                                bookRow.classList.toggle(CLASS.VIEW_FIX);
                                bookRow.classList.toggle(CLASS.VIEW);
                            }
                        }

                        function rightMouse() {
                            if (!getCalendarEntry()) return;
                            guest.year = self.year;
                            guest.mnth = self.month.num;
                            openRCMenu();
                        }

                        function getCalendarEntry() {

                            let result;
                            
                            if (TARGET.classList.contains(CLASS.SELECTED)) {
                                isAvailableButton = true;
                                result = obtainNewEntryData();
                            } else if (TARGET.classList.contains(CLASS.REDEEMED) || TARGET.classList.contains(CLASS.RESERVED)) {
                                isAvailableButton = false;
                                result = obtainExistingEntryData();
                            } else {
                                isAvailableButton = null;
                                result = null;
                                UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A000.TITLE, GL.CONST.LOG.ID.A000.GIST);
                            }

                            return result;
                            
                            function obtainNewEntryData() {
                                let idGroupFilter = function (el) { return el.match(/\bsel-group-\d+/g); },
                                    groupId = TARGET.className.split(' ').filter(idGroupFilter).toString(),
                                    rowId = TARGET.id.match(/[^R]\d+/i) || [],
                                    room = rowId[0];
                            
                                if (!groupId) {
                                    UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A001.TITLE, GL.CONST.LOG.ID.A001.GIST);
                                    return false;
                                }

                                if (!room) {
                                    UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A001.TITLE, GL.CONST.LOG.ID.A001.GIST);
                                    return false;
                                }

                                let group = document.querySelectorAll(`#calendar > tbody > tr#R${room} > td.${groupId}`),
                                    begda = group[0].id.match(/\d{4}-\d{2}-\d{2}/) || [],
                                    endda = group[group.length - 1].id.match(/\d{4}-\d{2}-\d{2}/) || [];
        
                                if (!begda) {
                                    UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A001.TITLE, GL.CONST.LOG.ID.A001.GIST);
                                    return false;
                                }

                                if (!endda) {
                                    UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A001.TITLE, GL.CONST.LOG.ID.A001.GIST);
                                    return false;
                                }

                                guest.intn = self.intent.add.key;
                                guest.unid = '-1';
                                guest.room = room;
                                guest.dbeg = begda[0];
                                guest.dend = endda[0];
                                return true;
                            }

                            function obtainExistingEntryData() {
                                let idFilter = function (el) { return el.match(/^N\d+$/); },
                                    unid = TARGET.className.split(' ').filter(idFilter).toString();
                                
                                if (!unid) {
                                    UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A001.TITLE, GL.CONST.LOG.ID.A001.GIST);
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
                        let self = this;
                        
                        toggleSelection();
                        toggleView();

                        function toggleSelection() {
                            if (!GL.DATA.CORE.isMouseDown) return; 
                            if (TARGET.classList.length === 0 || TARGET.classList.contains(CLASS.SELECTED)) {
                                SelectionGroup.del(e.target);
                                self.isSelected && SelectionGroup.add(e.target);
                                TARGET.classList.toggle(CLASS.SELECTED, self.isSelected);
                            } else {
                                SelectionGroup.free();
                            }
                        }

                        function toggleView() {
                            let idList = TARGET.className.split(' ').filter(function (el) { return el.match(/^N\d+$/g); });
                            for (let id of idList) {

                                let cells = document.querySelectorAll(`#calendar > tbody > tr > td.${id}`),
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

                            let date = TARGET.id.match(/\d{4}-\d{2}-\d{2}/i) || [];

                            if (!date[0]) {
                                UTILS.LOG(GL.CONST.LOG.LEVEL.WARN, GL.CONST.LOG.ID.A002.TITLE, GL.CONST.LOG.ID.A002.GIST);
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
                            let idList = TARGET.className.split(' ').filter(function (el) { return el.match(/^N\d+$/g); });
                            for (let id of idList) {

                                let cells = document.querySelectorAll(`#calendar > tbody > tr > td.${id}`),
                                    view = `${id}-${CLASS.VIEW}`;
                                
                                for (let cell of cells) { cell.classList.remove(view); }
                                document.querySelector(`.book > tbody > tr#${id}`).classList.remove(CLASS.VIEW);
                            }

                            let date = TARGET.id.match(/\d{4}-\d{2}-\d{2}/i) || [];

                            if (!date[0]) {
                                UTILS.LOG(GL.CONST.LOG.LEVEL.WARN, GL.CONST.LOG.ID.A002.TITLE, GL.CONST.LOG.ID.A002.GIST);
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
                        let book = document.querySelector(`#${TARGET.parentNode.id}-book`);

                        if (!book) {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.WARN, GL.CONST.LOG.ID.A002.TITLE, TARGET.parentNode.id);
                            return;
                        }

                        let stDisplay = window.getComputedStyle(book).getPropertyValue('display');
                        if (book.style.display === 'none' || stDisplay === 'none') book.style.display = 'table-row';
                        else book.style.display = 'none';
                    },
                },

            },

            book: {

                tr: {

                    mouseDown: function mousedown(e) {

                        const CLASS = GL.CONST.CSS.CALENDAR.CLASS;
                        const TARGET = e.target;

                        let self = this,
                            book = TARGET.closest('.book'),
                            guest = new Guest(),
                            isAvailableButton;
                        
                        switch (e.which) {
                            case 1: leftMouse(); return;
                            case 3: rightMouse(); return;
                            default: return;
                        }
                        
                        function leftMouse() {

                            let personRow = book.querySelector('.person-row'),
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
                            guest.year = self.year;
                            guest.mnth = self.month.num;
                            isAvailableButton = true;
                            openRCMenu();
                        }

                        function getBookEntry() {
                            const P = GL.CONST.PREFIX.PERSON.CELL;
                            guest.unid = book.querySelector(`.${P}-${IGuest.unid}`).textContent;
                            guest.dbeg = book.querySelector(`.${P}-${IGuest.dbeg}`).getAttribute('value');
                            guest.dend = book.querySelector(`.${P}-${IGuest.dend}`).getAttribute('value');
                            guest.days = book.querySelector(`.${P}-${IGuest.days}`).textContent;
                            guest.room = book.querySelector(`.${P}-${IGuest.room}`).textContent;
                            guest.base = book.querySelector(`.${P}-${IGuest.base}`).textContent;
                            guest.adjs = book.querySelector(`.${P}-${IGuest.adjs}`).textContent;
                            guest.cost = book.querySelector(`.${P}-${IGuest.cost}`).textContent;
                            guest.paid = book.querySelector(`.${P}-${IGuest.paid}`).textContent;
                            guest.name = book.querySelector(`.${P}-${IGuest.name}`).textContent;
                            guest.teln = book.querySelector(`.${P}-${IGuest.teln}`).textContent;
                            guest.fnot = book.querySelector(`.${P}-${IGuest.fnot}`).textContent;
                            guest.city = book.querySelector(`.${P}-${IGuest.city}`).textContent;

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

                        let innerBook = e.target.closest('.book');
                        if (!innerBook) return;

                        let personRow = innerBook.querySelector('.person-row');
                        if (personRow.classList.contains(CLASS.VIEW_FIX)) return;

                        personRow.classList.add(CLASS.VIEW);
                        document.querySelectorAll(`#calendar > tbody > tr > td.${personRow.id}`).forEach(function (el) {
                            el.classList.add(`${personRow.id}-${CLASS.VIEW}`);
                        });
                    },
        
                    mouseOut: function mouseout(e) {

                        const CLASS = GL.CONST.CSS.CALENDAR.CLASS;

                        let innerBook = e.target.closest('.book');
                        if (!innerBook) return;

                        let personRow = innerBook.querySelector('.person-row');
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

                        let monthNum = this.month.num;
                        monthNum > 1 ? monthNum-- : monthNum = 12;

                        let data = {
                            year: this.year,
                            month: monthNum
                        };

                        DB.GL001.SELECT(data, this.eventId);
                    },

                    next: function nextMonth(e) {

                        let monthNum = this.month.num;
                        monthNum > 11 ? monthNum = 1 : monthNum++;

                        let data = {
                            year: this.year,
                            month: monthNum
                        };

                        DB.GL001.SELECT(data, this.eventId);
                    }
                },

                pickPeriod: function pickPeriod(e) {

                    let dialog = new PickPeriod({
                        intent: this.intent.pickPeriod
                    });
                    dialog.bind();
                    dialog.setVal({
                        year: this.year,
                        month: this.month.num
                    });
                    dialog.show();
                }
            },

            dialog: {

                save: function (e) {

                    const E = this.intent;
                    const GL001 = DB.GL001;
                    let that = this,
                        data = e.detail.data || this;

                    switch (data.intent) {
                        case E.add.key: GL001.INSERT(data.guest, this.eventId); break;
                        case E.upd.key: GL001.UPDATE(data.guest, this.eventId); break;
                        case E.del.key: GL001.DELETE(data.guest, this.eventId); break;
                        case E.pickPeriod: pickPeriod(); break;
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
                        success: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg); },
                        error: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B002.TITLE, e.detail.data.xhr); }
                    },
                    update: {
                        success: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg); },
                        error: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B002.TITLE, e.detail.data.xhr); }
                    },
                },
                rm001: {
                    select: {
                        success: function (e) {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg);
                            const D = e.detail.data;
                            D.status && (this.rooms = D.data);
                        },
                        error: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B002.TITLE, e.detail.data.xhr); }
                    },
                },
                gl001: {
                    insert: {
                        success: function (e) {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg);
                            const D = e.detail.data;
                            if (!D.status) return;
                            this.year = D.year;
                            this.month = D.month;
                            this.guest = D.data;
                            this.add(this.guest);
                        },
                        error: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B002.TITLE, e.detail.data.xhr); }
                    },
                    select: {
                        success: function (e) {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg);
                            const D = e.detail.data;
                            if (!D.status) return;
                            this.year = D.year;
                            this.month = D.month;
                            this.guest = D.data;
                            this._resetView();
                            this.add(this.guest);
                        },
                        error: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B002.TITLE, e.detail.data.xhr); }
                    },
                    update: {
                        success: function (e) {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg);
                            const D = e.detail.data;
                            D.status && this.upd(new Guest(D.old), new Guest(D.new));
                        },
                        error: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.xhr); }
                    },
                    delete: {
                        success: function (e) {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg);
                            const D = e.detail.data;
                            this.guest = D.data;
                            D.status && this.del(this.guest);
                        },
                        error: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B002.TITLE, e.detail.data.xhr); }
                    },
                },
            }
        };
    }

    set guest(entry) {
        let guests = [];
        if (Array.isArray(entry)) entry.forEach(el => guests.push(new Guest(el)));
        else guests.push(new Guest(entry));
        this._guest = guests;
    }
    get guest() { return this._guest; }

    set month(month) { this._month = month; }
    get month() {
        return {
            name: new Date(1900, this._month - 1).toLocaleString(GL.CONST.LOCALE, { month: "long" }),
            num: UTILS.OVERLAY(this._month, '0', 2),
        };
    }

    set year(year) { this._year = year; }
    get year() { return this._year; }

    set rooms(rooms) { this._rooms = rooms; }
    get rooms() { return this._rooms; }

    set isSelected(isSelected) { this._isSelected = isSelected; }
    get isSelected() { return this._isSelected; }

    get eventId() { return this._eventId; }
    get monthNames() { return this._monthNames; }
    get intent() { return this._intent; }

    /**
     * 
     * @param  {any} target 
     * @return {void}@memberof Calendar
     */
    bind (target) {

        let tree =
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
        let qsParent, qsChild, qsParentExcl;

        qsParent = '#calendar > tbody'; qsChild = 'td'; qsParentExcl = '.book-row';
        this._setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseDown.bind(this));
        this._setDelegate('mouseover', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseOver.bind(this));
        this._setDelegate('mouseout', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseOut.bind(this));
        this._setDelegate('mouseup', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseUp.bind(this));

        qsParent = '#calendar > tbody'; qsChild = 'tr > th'; qsParentExcl = '';
        this._setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.calendar.th.mouseDown.bind(this));

        qsParent = '#calendar > tbody'; qsChild = '.book'; qsParentExcl = '';
        this._setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.book.tr.mouseDown.bind(this));
        this._setDelegate('mouseover', qsParent, qsChild, qsParentExcl, L.book.tr.mouseOver.bind(this));
        this._setDelegate('mouseout', qsParent, qsChild, qsParentExcl, L.book.tr.mouseOut.bind(this));

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

    /**
     * 
     * @return {void}@memberof Calendar
     */
    init() {

        $.ajax({ url: '../db/init.php', dataType: 'json',
            success: function onSuccess(data) {
                this.rooms = data.rooms;
                this.year = data.year;
                this.month = data.month;
                this.guest = data.data;
                this._resetView();
                this.add(this.guest);
            }.bind(this),
            error: function onError(xhr, textStatus) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B002.TITLE, textStatus); }
        });
    }

    /**
     * 
     * @param  {any} entries 
     * @return {void}@memberof Calendar
     */
    add(entries) {

        let self = this;

        entries.forEach(guest => {
            setCellColor(guest);
            fillBook(guest);
        });

        function setCellColor(guest) {

            const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
            let begda = new Date(guest.dbeg),
                endda = new Date(guest.dend),
                curda = new Date(),
                tmpda = begda;

            while (tmpda <= endda) {
                if (!isDateValid(tmpda)) {
                    tmpda.setDate(tmpda.getDate() + 1);
                    continue;
                }

                let cell = document.querySelector(`#calendar #R${guest.room} #R${guest.room}D${tmpda.format('yyyy-mm-dd')}`);
                while (cell.hasChildNodes()) cell.removeChild(cell.firstChild);

                // добавляем класс
                if (cell.classList.contains(CLASS_LIST.REDEEMED) || cell.classList.contains(CLASS_LIST.RESERVED)) {
                    cell.classList.remove(CLASS_LIST.REDEEMED, CLASS_LIST.RESERVED);
                    cell.classList.add(CLASS_LIST.ADJACENT);
                } else {
                    cell.classList.remove(CLASS_LIST.SELECTED);
                    (tmpda < curda) ? cell.classList.add(CLASS_LIST.REDEEMED) : cell.classList.add(CLASS_LIST.RESERVED);
                }
                cell.classList.add(`N${guest.unid}`);

                // добавляем подсказку  
                let div = cell.getElementsByTagName('div'),
                    hintText = `№${guest.unid} ${guest.name} с ${begda.format('dd.mm')} по ${endda.format('dd.mm')}`;
                if (div.length === 0) {
                    let span = document.createElement('span');
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
            return d.format('yyyy-mm') == (self.year + '-' + self.month.num);
        }

        function fillBook(guest) {

            // FIX check empty field that using in uerSelection or Id. like room & days

            let tree, days = new Date(self.year, self.month.num, 0).getDate();
            
            if (!document.getElementById(`R${guest.room}-book`)) {
                tree =
                    [{ tag: 'tr', id: `R${guest.room}-book`, class: 'hidden book-row' },
                        [{ tag: 'td', colspan: (days + 1) },
                            [{ tag: 'table', class: 'book' },
                                { tag: 'tbody' }
                            ]
                        ]
                    ];
                tree = new DOMTree(tree).cultivate();
                let tr = document.querySelector(`#calendar tbody tr#R${guest.room}`);
                tr.parentNode.insertBefore(tree, tr.nextSibling);
            }

            const P = GL.CONST.PREFIX.PERSON;
            tree =
                [{ tag: 'tr', id: `N${guest.unid}`, class: 'person-row' },
                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.unid}`, textNode: guest.unid },
                    [{ tag: 'td' },
                        [{ tag: 'table', class: 'inner-book' },
                            [{ tag: 'tbody' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: `${P.FIELD} person-base-info` },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.name}`, textNode: guest.name },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.teln}`, textNode: guest.teln },
                                    ],
                                    { tag: 'td', class: `${P.FIELD} person-dates ${P.CELL}-${IGuest.dbeg}`, attr: { value: guest.dbeg }, textNode: new Date(guest.dbeg).format('dd.mm') },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.room}`, rowspan: 2, textNode: guest.room },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.cost}`, textNode: guest.cost },
                                ],
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: `${P.FIELD} person-additional-info` },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.city}`, textNode: guest.city },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.fnot}`, textNode: guest.fnot },
                                    ],
                                    { tag: 'td', class: `${P.FIELD} person-dates ${P.CELL}-${IGuest.dend}`, attr: { value: guest.dend }, textNode: new Date(guest.dend).format('dd.mm') },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.paid}` , textNode: guest.paid },
                                ],
                                [{ tag: 'tr', style: { display: 'none;'} },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.days}`, textNode: guest.days },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.base}`, textNode: guest.base },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.adjs}`, textNode: guest.adjs }
                                ]
                            ]
                        ]
                    ]
                ];    
            tree = new DOMTree(tree).cultivate();
            document.querySelector(`#R${guest.room}-book .book tbody`).appendChild(tree);
        }
    }

    /**
     * 
     * @param  {any} entries 
     * @return {void}@memberof Calendar
     */
    del(entries) {

        // TODO  replace find all cell with classname = list[i].unid => remove view_fix/view ; replace class_list
        entries.forEach(guest => {
            //test

            let test = document.getElementsByClassName(`N${guest.unid}`);
            for (let el of test) {
                
            }



            const CLASS_LIST = GL.CONST.CSS.CALENDAR.CLASS;
            let room = guest.room,
                begda = new Date(guest.dbeg),
                endda = new Date(guest.dend),
                curda = new Date();

            while (begda <= endda) {
                let date = begda.format('yyyy-mm-dd'),
                    td = document.querySelector(`#calendar tbody tr#R${room} td#R${room}D${date}`);
                if (!td) {
                    begda.setDate(begda.getDate() + 1);
                    continue;
                }
                td.classList.remove(`N${guest.unid}`);
                td.classList.remove(`N${guest.unid}_${CLASS_LIST.VIEW_FIX}`);
                td.classList.remove(`N${guest.unid}_${CLASS_LIST.VIEW}`);
                if (td.classList.contains(CLASS_LIST.ADJACENT)) {
                    td.classList.remove(CLASS_LIST.ADJACENT);
                    if (begda < curda)  td.classList.add(CLASS_LIST.REDEEMED);
                    else td.classList.add(CLASS_LIST.RESERVED);
                } else {
                    td.classList.remove(CLASS_LIST.REDEEMED);
                    td.classList.remove(CLASS_LIST.RESERVED);
                }
                while (td.hasChildNodes()) td.removeChild(td.firstChild);
                begda.setDate(begda.getDate() + 1);
            }

            let tr = document.querySelector(`.book > tbody > tr#N${guest.unid}`);
            tr.parentNode.removeChild(tr);
            if (Calendar._isEmptyBook(guest.room)) {
                tr = document.querySelector(`#calendar > tbody > tr#R${guest.room}-book`);
                tr.parentNode.removeChild(tr);
            }
        });
    }

    /**
     * 
     * @param  {any} oldEntries 
     * @param  {any} newEntries 
     * @return {void}@memberof Calendar
     */
    upd(oldEntries, newEntries) {

        this.del(oldEntries);
        this.add(newEntries);
        sort();

        function sort() {

            newEntries.forEach(guest => {
                let tr = document.querySelectorAll(`#R${guest.room}-book > td > .book > tbody > tr`),
                    pos = [];
                for (let i = 0; i < tr.length; i++) {
                    let id = tr[i].querySelector(`.${IGuest.unid}`) || "";
                    pos.push({
                        id: parseInt(id, 10),
                        pos: i
                    });
                }

                pos.sort(function (a, b) { return a.id - b.id; });

                for (let i = 0; i < (pos.length - 1); i++) {
                    if (pos[i].pos > pos[i + 1].pos) {
                        let curRow = document.querySelector(`#R${guest.room}-book tr#N${pos[i].id}`),
                        nextRow = document.querySelector(`#R${guest.room}-book tr#N${pos[i + 1].id}`);
                        nextRow.parentNode.insertBefore(nextRow, curRow);
                    }
                }
            });
        }
    }

    /**
     * 
     * @return {void}@memberof Calendar
     */
    _resetView() {

        let self = this;
        free ();
        build ();

        function free() {

            let tbody = document.getElementById('calendar-tbody'),
                daysRow = document.getElementById('calendar-row-days');
            
            if (tbody) while (tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
            if (daysRow) while (daysRow.hasChildNodes()) daysRow.removeChild(daysRow.firstChild);
        }

        function build() {
            
            const DAYS = new Date(self.year, self.month.num, 0).getDate().toString();

            document.getElementById('calendar-row-buttons').getElementsByTagName('td')[0].setAttribute('colspan', DAYS);

            let calendar = document.getElementById('calendar'),
                labelYear = calendar.querySelector('#year'),
                labelMonth = calendar.querySelector('#month');
            
            while (labelYear.firstChild) labelYear.removeChild(labelYear.firstChild);
            while (labelMonth.firstChild) labelMonth.removeChild(labelMonth.firstChild);

            labelYear.appendChild(document.createTextNode(self.year));
            labelMonth.appendChild(document.createTextNode(self.month.name));

            let daysRow = document.getElementById('calendar-row-days');

            let day = 0;
            while (day <= DAYS) {
                let th = document.createElement('th');
                if (day === 0) {
                    th.classList.add('blank-cell');
                } else {
                    let id = `D${self.year}-${self.month.num}-${UTILS.OVERLAY(day, '0', 2)}`;
                    th.setAttribute('id', id);
                    th.appendChild(document.createTextNode(day.toString()));
                }
                daysRow.appendChild(th);
                day++;
            }

            let tbody = document.getElementById('calendar-tbody');
            for (let room of self.rooms) {
                let id = `R${room.room}`,
                    tr = document.createElement('tr');
                tr.setAttribute('id', id);
                day = 0;
                while (day <= DAYS) {
                    let node;
                    if (0 === day) {
                        node = document.createElement('th');
                        node.appendChild(document.createTextNode(room.room));
                    } else {
                        let id = `R${room.room}D${self.year}-${self.month.num}-${UTILS.OVERLAY(day, '0', 2)}`;
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

    /**
     * 
     * @static
     * @param  {any} room 
     * @return 
     * @memberof Calendar
     */
    static _isEmptyBook(room) { return !document.querySelector(`#R${room}-book tbody`).childElementCount; }

    /**
     * 
     * @param  {any} eventName 
     * @param  {any} qsParent 
     * @param  {any} qsChild 
     * @param  {any} qsClosestExcl 
     * @param  {any} callback 
     * @return {void}@memberof Calendar
     */
    _setDelegate(eventName, qsParent, qsChild, qsClosestExcl, callback) {

        let parent = document.querySelector(qsParent),
            that = {
                parent: parent,
                qsParent: qsParent,
                qsChild: qsChild,
                qsClosestExcl: qsClosestExcl,
                callback: callback
            };

        parent.addEventListener(eventName, function delegateListener(e) {
            let target = e.target;
            if (this.qsClosestExcl) if (target.closest(this.qsClosestExcl)) return;
            let childs = this.parent.querySelectorAll(this.qsChild);
            if (Array.from(childs).indexOf(target) !== -1) return this.callback.call(e, e);
            for (let child of childs) { if (child.contains(target)) return this.callback.call(e, e); }
        }.bind(that));
    }
}