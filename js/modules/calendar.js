/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

/*
     TODO 
    1. ID гостя вынести из классов в атрибут data-*
    2. переделать логику ПКМ
    3. переделать класс VIEW & VIEW_FIX на атрибут data-vaie: fix/hov


*/

(function () { "use strict"; })();

/**
 * 
 * @class SelectionGroup
 */
class SelectionGroup {

    constructor() {
        this.prefix = 'selection-group';
        this.attr = 'data-selection-group';
        this.unid = undefined;
    }
    
    /**
     * Очистка ID текущего обрабатываемого класса
     * @static
     * @return {void}@memberof SelectionGroup
     */
    static free() { this.unid = undefined; }

    /**
     * Формирование ID нового класса
     * @static
     * @return {void}@memberof SelectionGroup
     */
    static gen() {
        this.unid = Math.ceil(Math.random() * 100000);
    }

    /**
     * Добавление класса к объекту.
     * Если ID класса не сформирован то перед добавление будет вызван метод формирующий ID класса
     * @static
     * @param  {any} target 
     * @return {void}@memberof SelectionGroup
     */
    static add(target) {

        !this.unid && this.gen();
        target.setAttribute(this.attr, this.unid);
        this.enum(this.unid);
    }

    /**
     * Поиск ID класса присвоенного объекту с последующим удалением и пересчетом оставшихся элементов 
     * которым присвоей этот ID
     * @static
     * @param  {any} target 
     * @return {void}@memberof SelectionGroup
     */
    static del(target) {

        let unid = target.target.getAttribute(this.attr);
        let group = document.querySelectorAll(`[${this.attr}='${unid}']`);
        for (let i = group.length; i > 0; i--) {
            let el = group[0];
            while (el.hasChildNodes()) el.removeChild(el.firstChild);
            // el.classList.remove(GL.CONST.CSS.CALENDAR.CLASS.SELECTED); // FIX перенести логику удаления выделения в календарь
            el.removeAttribute(this.attr);
            if (el.id == target.id) break; 
        }
        this.enum(unid);
    }

    /**
     * Пересчет кол-ва объектов класса по ID класса 
     * @static
     * @param  {any} unid 
     * @return {void}@memberof SelectionGroup
     */
    static enum(unid) {

        let i = 1;
        let group = document.querySelectorAll(`[${this.attr}='${unid}']`);
        for (let j = group.length; j > 0; j--) {
            let el = group[0];
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
        this.intn = entries.intn || '';
        this.year = entries.year || '';
        this.mnth = entries.mnth || '';
        this.unid = entries.unid || '';
        this.dbeg = entries.dbeg || '';
        this.dend = entries.dend || '';
        this.days = entries.days || '';
        this.room = entries.room || '';
        this.base = entries.base || '';
        this.adjs = entries.adjs || '';
        this.cost = entries.cost || '';
        this.paid = entries.paid || '';
        this.name = entries.name || '';
        this.teln = entries.teln || '';
        this.fnot = entries.fnot || '';
        this.city = entries.city || '';
    }

    static get Intn() { return 'intn'; }
    static get Year() { return 'year'; }
    static get Mnth() { return 'mnth'; }
    static get Unid() { return 'unid'; }
    static get Dbeg() { return 'dbeg'; }
    static get Dend() { return 'dend'; }
    static get Days() { return 'days'; }
    static get Room() { return 'room'; }
    static get Base() { return 'base'; }
    static get Adjs() { return 'adjs'; }
    static get Cost() { return 'cost'; }
    static get Paid() { return 'paid'; }
    static get Name() { return 'name'; }
    static get Teln() { return 'teln'; }
    static get Fnot() { return 'fnot'; }
    static get City() { return 'city'; }
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
    set Intn(Intn) { this.intn = Intn || ''; } get Intn() { return this.intn || ''; }
    set Year(Year) { this.year = Year || ''; } get Year() { return this.year || ''; }
    set Mnth(Mnth) { this.mnth = Mnth || ''; } get Mnth() { return this.mnth || ''; }
    set Unid(Unid) { this.unid = Unid || ''; } get Unid() { return this.unid || ''; }
    set Dbeg(Dbeg) { this.dbeg = Dbeg || ''; } get Dbeg() { return this.dbeg || ''; }
    set Dend(Dend) { this.dend = Dend || ''; } get Dend() { return this.dend || ''; }
    set Days(Days) { this.days = Days || ''; } get Days() { return this.days || ''; }
    set Room(Room) { this.room = Room || ''; } get Room() { return this.room || ''; }
    set Base(Base) { this.base = Base || ''; } get Base() { return this.base || ''; }
    set Adjs(Adjs) { this.adjs = Adjs || ''; } get Adjs() { return this.adjs || ''; }
    set Cost(Cost) { this.cost = Cost || ''; } get Cost() { return this.cost || ''; }
    set Paid(Paid) { this.paid = Paid || ''; } get Paid() { return this.paid || ''; }
    set Name(Name) { this.name = Name || ''; } get Name() { return this.name || ''; }
    set Teln(Teln) { this.teln = Teln || ''; } get Teln() { return this.teln || ''; }
    set Fnot(Fnot) { this.fnot = Fnot || ''; } get Fnot() { return this.fnot || ''; }
    set City(City) { this.city = City || ''; } get City() { return this.city || ''; }
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

        this._intent = { // TODO как-нибудь передлать это гавно
            add: { key: 'add', txt: 'Добавить' },
            upd: { key: 'upd', txt: 'Изменить' },
            del: { key: 'del', txt: 'Удалить' },
            ext: { key: 'ext', txt: '' },
            pickPeriod: 'pick-period'
        };

        this._dataAttr = {
            view: {
                name: 'data-view',
                keys: {
                    fixed: 'fixex',
                    hovered: 'hovered'
                }
            },
            status: {
                name: 'data-day-status',
                selected: "selected", // выделен
                reserved: "reserved", // зарезервирован
                adjacent: "adjacent", // смежный
                redeemed: "redeemed", // выкупленный
            }
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

                        let confirmDialog = new ConfirmDialog({
                            intent: this.intent.del.key,
                            title: this.intent.del.txt,
                            text: UTILS.FORMAT(GL.CONST.LOCALIZABLE.MSG001, { 1: e.detail.data.unid }),
                            data: { guest: e.detail.data },
                            cb: { ok: function (data) { EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.DIALOG_SAVE, data); } }
                        });
                        confirmDialog.bind();
                        confirmDialog.show();
                    },
        
                    upd: function RCMItemUpdGuest(e) {
        
                        const I = this.intent.upd;
                        const E = GL.CONST.EVENTS.CALENDAR.DB.GL001.SELECT.SUCCESS;
                        let self = this;

                        EVENT_BUS.register(`${E}${I.key}`, showGuestCard, true);
                        DB.GL001.SELECT({ unid: e.detail.data.unid }, I.key);

                        function showGuestCard(e) {
                            let guest;
                            try {
                                guest = new Guest(e.detail.data.guest[0]);
                            } catch (err) {
                                UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B000, err.message);
                                return;
                            }
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
                            guestCard.setVal(guest);
                            guestCard.show();
                        }
                    },
                },
            },

            calendar: {

                td: {

                    mouseDown: function mousedown(e) {

                        let self = this,
                            target = e.target;
                        
                        let guest = new Guest(),
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
                            (target.classList.length === 0 || target.classList.contains(self.css.selected)) && target.classList.toggle(self.css.selected);
                            self.isSelected = target.classList.contains(self.css.selected);
                            SelectionGroup.del(target);
                            self.isSelected ? SelectionGroup.add(e.target) : SelectionGroup.free();
                        }

                        function toggleView() {
                            let ids = self._getElementInfo(target).class.unid;
                            for (let i = 0; i < ids.length; i++) {
                                document.querySelectorAll(`#calendar > tbody > tr > td.${ids[i]}`).forEach(function (el) {
                                    let view = el.getAttribute('data-view');
                                    (view == 'hov') ? el.setAttribute('data-view', 'fix') : ;
                                    el.hasAttribute() ? : ;
                                    el.classList.toggle(`${ids[i]}-${self.css.viewFix}`);
                                    el.classList.toggle(`${ids[i]}-${self.css.view}`);
                                });

                                let bookRow = document.querySelector(`.book > tbody > tr#${ids[i]}`);
                                bookRow.classList.toggle(self.css.viewFix);
                                bookRow.classList.toggle(self.css.view);
                            }
                        }

                        /*
                        //test begin
                        function rightMouse() {
                        yield
                            1. get: id / selection-group
                                if id && selgroup <> "" => error + close
                                if id && selgroup == "" => error + error
                                id || selgroup <> "" => ok
                                    data1 = get room + day + month + year

                            2. fetch db <= data1
                                if result err => error + close
                                if result ok => ok
                                    if data2 == "" => data3 = add
                                    if data2 <> "" => update calendar => data3 = del + upd

                            3. show guest card / del popup <= (data1 | data2) + data3
                                if close = > close
                                if save => ok

                            4. update db <= (data1 | data2)
                                if result err => error + close
                                if result ok => ok
                                    if data4 == "" => error + close
                                    if data4 <> "" => ok

                            5. update calendar <= data4     
                            6.close
                        }
                        //test end
                        */

                        function rightMouse() {
                            if (!getCalendarEntry()) return;
                            guest.Year = self.year;
                            guest.Mnth = self.month.num;
                            openRCMenu();
                        }

                        function getCalendarEntry() {

                            let result;
                            
                            if (target.classList.contains(self.css.selected)) {
                                isAvailableButton = true;
                                result = obtainNewEntryData();
                            } else if (target.classList.contains(self.css.redeemed) || target.classList.contains(self.css.reserved)) {
                                isAvailableButton = false;
                                result = obtainExistingEntryData();
                            } else {
                                isAvailableButton = null;
                                result = null;
                                UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A000.TITLE, GL.CONST.LOG.ID.A000.GIST);
                            }

                            return result;
                            
                            function obtainNewEntryData() {
                                let groupId, room;
                                
                                    groupId = self._getElementInfo(target).attr.selGroup;
                                    room = selft._getElementInfo(target).id.room;
                            
                                let group = document.querySelectorAll(`#calendar > tbody > tr#R${room} > td.${groupId}`),
                                    begda, endda;
                                
                                    begda = self._getElementInfo(group[0]).id.date;
                                    endda = selft._getElementInfo(group[group.length - 1]).id.date;

                                guest.Intn = self.intent.add.key;
                                guest.Unid = '-1';
                                guest.Room = room;
                                guest.Dbeg = begda;
                                guest.Dend = endda;
                                return true;
                            }

                            function obtainExistingEntryData() {
                                let unid;
                                    unid = self._getElementInfo(target).class.unid[0];
                                
                                guest.Unid = unid;
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
        
                        let target = e.target,
                            self = this;
                        
                        toggleSelection();
                        toggleView();

                        function toggleSelection() {
                            if (!GL.DATA.CORE.isMouseDown) return; 
                            if (target.classList.length === 0 || target.classList.contains(self.css.selected)) {
                                SelectionGroup.del(e.target);
                                self.isSelected && SelectionGroup.add(e.target);
                                target.classList.toggle(self.css.selected, self.isSelected);
                            } else {
                                SelectionGroup.free();
                            }
                        }

                        function toggleView() {
                            let idList = self._getElementInfo(target).class.unid;
                            for (let id of idList) {

                                let cells = document.querySelectorAll(`#calendar > tbody > tr > td.${id}`),
                                    bookRow = document.querySelector(`.book > tbody > tr#${id}`), 
                                    viewfix = `${id}-${self.css.viewFix}`,
                                    view = `${id}-${self.css.view}`;
                                
                                for (let cell of cells) {
                                    if (cell.classList.contains(viewfix)) continue;
                                    if (cell.classList.contains(view)) continue;
                                    cell.classList.add(view);
                                }
                                if (bookRow.classList.contains(self.css.viewFix)) continue;
                                if (bookRow.classList.contains(self.css.view)) continue;
                                bookRow.classList.add(self.css.view);
                            }

                            let date = self._getElementInfo(target).id.date;

                            if (!date) {
                                UTILS.LOG(GL.CONST.LOG.LEVEL.WARN, GL.CONST.LOG.ID.A002.TITLE, GL.CONST.LOG.ID.A002.GIST);
                                return;
                            }

                            document.querySelector(`#calendar > thead tr:nth-child(2) th#D${date}`).classList.add(self.css.view);
                        }
                    },
        
                    mouseOut: function mouseout(e) {
        
                        let target = e.target,
                            self = this;
                        
                        toggleView();

                        function toggleView() {
                            let idList = self._getElementInfo(target).class.unid;
                            for (let id of idList) {

                                let cells = document.querySelectorAll(`#calendar > tbody > tr > td.${id}`),
                                    view = `${id}-${self.css.view}`;
                                
                                for (let cell of cells) { cell.classList.remove(view); }
                                document.querySelector(`.book > tbody > tr#${id}`).classList.remove(self.css.view);
                            }

                            let date = self._getElementInfo(target).id.date;

                            if (!date) {
                                UTILS.LOG(GL.CONST.LOG.LEVEL.WARN, GL.CONST.LOG.ID.A002.TITLE, GL.CONST.LOG.ID.A002.GIST);
                                return;
                            }

                            document.querySelector(`#calendar > thead tr:nth-child(2) th#D${date}`).classList.remove(self.css.view);
                        }
                    },
        
                    mouseUp: function mouseup(e) {
        
                        SelectionGroup.free();
                        GL.DATA.CORE.isMouseDown = false;
                    },
                },

                th: {

                    mouseDown: function mousedown(e) {

                        let target = e.target,
                            self = this;
    
                        target.classList.toggle(self.css.viewFix);
                        let book = document.querySelector(`#${target.parentNode.id}-book`);

                        if (!book) {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.WARN, GL.CONST.LOG.ID.A002.TITLE, target.parentNode.id);
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

                        let target = e.target,
                            self = this,
                            book = target.closest('.book'),
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
                            personRow.classList.toggle(self.css.viewFix);
                            personRow.classList.toggle(self.css.view);
                            document.querySelectorAll(`#calendar > tbody > tr > td.${id}`).forEach(function (el) {
                                el.classList.toggle(`${id}-${self.css.viewFix}`);
                                el.classList.toggle(`${id}-${self.css.view}`);
                            });
                        }

                        function rightMouse() {
                            getBookEntry();
                            guest.Year = self.year;
                            guest.Mnth = self.month.num;
                            isAvailableButton = true;
                            openRCMenu();
                        }

                        function getBookEntry() {
                            const P = GL.CONST.PREFIX.PERSON.CELL;
                            guest.Unid = book.querySelector(`.${P}-${IGuest.Unid}`).textContent;
                            guest.Dbeg = book.querySelector(`.${P}-${IGuest.Dbeg}`).getAttribute('value');
                            guest.Dend = book.querySelector(`.${P}-${IGuest.Dend}`).getAttribute('value');
                            guest.Days = book.querySelector(`.${P}-${IGuest.Days}`).textContent;
                            guest.Room = book.querySelector(`.${P}-${IGuest.Room}`).textContent;
                            guest.Base = book.querySelector(`.${P}-${IGuest.Base}`).textContent;
                            guest.Adjs = book.querySelector(`.${P}-${IGuest.Adjs}`).textContent;
                            guest.Cost = book.querySelector(`.${P}-${IGuest.Cost}`).textContent;
                            guest.Paid = book.querySelector(`.${P}-${IGuest.Paid}`).textContent;
                            guest.Name = book.querySelector(`.${P}-${IGuest.Name}`).textContent;
                            guest.Teln = book.querySelector(`.${P}-${IGuest.Teln}`).textContent;
                            guest.Fnot = book.querySelector(`.${P}-${IGuest.Fnot}`).textContent;
                            guest.City = book.querySelector(`.${P}-${IGuest.City}`).textContent;

                            guest.Dbeg = new Date(guest.Dbeg).format('dd.mm');
                            guest.Dend = new Date(guest.Dend).format('dd.mm');
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

                        let self = this;

                        let innerBook = e.target.closest('.book');
                        if (!innerBook) return;

                        let personRow = innerBook.querySelector('.person-row');
                        if (personRow.classList.contains(self.css.viewFix)) return;

                        personRow.classList.add(self.css.view);
                        document.querySelectorAll(`#calendar > tbody > tr > td.${personRow.id}`).forEach(function (el) {
                            el.classList.add(`${personRow.id}-${self.css.view}`);
                        });
                    },
        
                    mouseOut: function mouseout(e) {

                        let self = this;

                        let innerBook = e.target.closest('.book');
                        if (!innerBook) return;

                        let personRow = innerBook.querySelector('.person-row');
                        if (personRow.classList.contains(self.css.viewFix)) return;

                        personRow.classList.remove(self.css.view);
                        document.querySelectorAll(`#calendar > tbody > tr > td.${personRow.id}`).forEach(function (el) {
                            el.classList.remove(`${personRow.id}-${self.css.view}`);
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
                            D.status && (this.rooms = D.room);
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
                            this.guest = D.guest;
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
                            this.guest = D.guest;
                            this._resetView();
                            this.add(this.guest);
                        },
                        error: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B002.TITLE, e.detail.data.xhr); }
                    },
                    update: {
                        success: function (e) {
                            const D = e.detail.data;
                            UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, D.msg);
                            let oldEntries = [], newEntries = [];
                            try {
                                D.old.forEach(el => { oldEntries.push(new Guest(el)); });
                                D.new.forEach(el => { newEntries.push(new Guest(el)); });
                            } catch (err) {
                                UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B000, err.message);
                                return;
                            }
                            D.status && this.upd(oldEntries, newEntries);
                        },
                        error: function (e) { UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.xhr); }
                    },
                    delete: {
                        success: function (e) {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg);
                            const D = e.detail.data;
                            this.guest = D.guest;
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
    get css() { return this._css; }

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

        // TODO reset selection-group by id

        entries.forEach(guest => {
            setCellColor(guest);
            fillBook(guest);
        });

        function setCellColor(guest) {

            let begda = new Date(guest.Dbeg),
                endda = new Date(guest.Dend),
                curda = new Date(),
                tmpda = begda;

            while (tmpda <= endda) {
                if (!isDateValid(tmpda)) {
                    tmpda.setDate(tmpda.getDate() + 1);
                    continue;
                }

                let cell = document.querySelector(`#calendar #R${guest.Room} #R${guest.Room}D${tmpda.format('yyyy-mm-dd')}`);
                while (cell.hasChildNodes()) cell.removeChild(cell.firstChild);

                // добавляем класс
                if (cell.classList.contains(self.css.redeemed) || cell.classList.contains(self.css.reserved)) {
                    cell.classList.remove(self.css.redeemed, CLASS_self.cssLIST.reserved);
                    cell.classList.add(self.css.adjacent);
                } else {
                    cell.classList.remove(self.css.selected);
                    (tmpda < curda) ? cell.classList.add(self.css.redeemed) : cell.classList.add(self.css.reserved);
                }
                cell.classList.add(`N${guest.Unid}`);

                // добавляем подсказку  
                let div = cell.getElementsByTagName('div'),
                    hintText = `№${guest.Unid} ${guest.Name} с ${begda.format('dd.mm')} по ${endda.format('dd.mm')}`;
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
            
            if (!document.getElementById(`R${guest.Room}-book`)) {
                tree =
                    [{ tag: 'tr', id: `R${guest.Room}-book`, class: 'hidden book-row' },
                        [{ tag: 'td', colspan: (days + 1) },
                            [{ tag: 'table', class: 'book' },
                                { tag: 'tbody' }
                            ]
                        ]
                    ];
                tree = new DOMTree(tree).cultivate();
                let tr = document.querySelector(`#calendar tbody tr#R${guest.Room}`);
                tr.parentNode.insertBefore(tree, tr.nextSibling);
            }

            const P = GL.CONST.PREFIX.PERSON;
            tree =
                [{ tag: 'tr', id: `N${guest.Unid}`, class: 'person-row' },
                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.Unid}`, textNode: guest.Unid },
                    [{ tag: 'td' },
                        [{ tag: 'table', class: 'inner-book' },
                            [{ tag: 'tbody' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: `${P.FIELD} person-base-info` },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.Name}`, textNode: guest.Name },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.Teln}`, textNode: guest.Teln },
                                    ],
                                    { tag: 'td', class: `${P.FIELD} person-dates ${P.CELL}-${IGuest.Dbeg}`, attr: { value: guest.Dbeg }, textNode: new Date(guest.Dbeg).format('dd.mm') },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.Room}`, rowspan: 2, textNode: guest.Room },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.Cost}`, textNode: guest.Cost },
                                ],
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: `${P.FIELD} person-additional-info` },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.City}`, textNode: guest.City },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.Fnot}`, textNode: guest.Fnot },
                                    ],
                                    { tag: 'td', class: `${P.FIELD} person-dates ${P.CELL}-${IGuest.Dend}`, attr: { value: guest.Dend }, textNode: new Date(guest.Dend).format('dd.mm') },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.Paid}` , textNode: guest.Paid },
                                ],
                                [{ tag: 'tr', style: { display: 'none;'} },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.Days}`, textNode: guest.Days },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.Base}`, textNode: guest.Base },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.Adjs}`, textNode: guest.Adjs }
                                ]
                            ]
                        ]
                    ]
                ];    
            tree = new DOMTree(tree).cultivate();
            document.querySelector(`#R${guest.Room}-book .book tbody`).appendChild(tree);
        }
    }

    /**
     * 
     * @param  {any} entries 
     * @return {void}@memberof Calendar
     */
    del(entries) {

        const CURRENT_DATE = new Date();

        entries.forEach(guest => {

            const id = `N${guest.Unid}`;
            let self = this;

            const cells = document.getElementsByClassName(id);
            for (let i = cells.length; i > 0; i--) {
                let cell = cells[0];
               
                if (cell.classList.contains(self.css.adjacent)) {
                    cell.classList.remove(self.css.adjacent);
                    let date;
                    date = self._getElementInfo(cell).id.date;
                    (date < CURRENT_DATE) ? cell.classList.add(self.css.redeemed) : td.classList.add(self.css.reserved);
                } else {
                    cell.classList.remove(self.css.redeemed);
                    cell.classList.remove(self.css.reserved);
                }
                cell.classList.remove(id);
                cell.classList.remove(`${id}_${self.css.viewFix}`);
                cell.classList.remove(`${id}_${self.css.view}`);

                // FIX для смежных дней будет удалять подсказку даже с той записи, котоаря остается 
                while (cell.hasChildNodes()) cell.removeChild(cell.firstChild);
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
                let tr = document.querySelectorAll(`#R${guest.Room}-book > td > .book > tbody > tr`),
                    pos = [];
                for (let i = 0; i < tr.length; i++) {
                    let id = tr[i].querySelector(`.${IGuest.Unid}`) || "";
                    pos.push({
                        id: parseInt(id, 10),
                        pos: i
                    });
                }

                pos.sort(function (a, b) { return a.id - b.id; });

                for (let i = 0; i < (pos.length - 1); i++) {
                    if (pos[i].pos > pos[i + 1].pos) {
                        let curRow = document.querySelector(`#R${guest.Room}-book tr#N${pos[i].id}`),
                        nextRow = document.querySelector(`#R${guest.Room}-book tr#N${pos[i + 1].id}`);
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

            let calendar   = document.getElementById('calendar'),
                labelYear  = calendar.querySelector('#year'),
                labelMonth = calendar.querySelector('#month'),
                tbody      = calendar.querySelector('#calendar-tbody'),
                daysRow    = calendar.querySelector('#calendar-row-days');
            
            if (tbody) while (tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
            if (daysRow) while (daysRow.hasChildNodes()) daysRow.removeChild(daysRow.firstChild);
            
            while (labelYear.firstChild) labelYear.removeChild(labelYear.firstChild);
            while (labelMonth.firstChild) labelMonth.removeChild(labelMonth.firstChild);
        }

        function build() {
            
            const DAYS = new Date(self.year, self.month.num, 0).getDate().toString();

            document.getElementById('calendar-row-buttons').getElementsByTagName('td')[0].setAttribute('colspan', DAYS);

            let calendar   = document.getElementById('calendar'),
                labelYear  = calendar.querySelector('#year'),
                labelMonth = calendar.querySelector('#month');

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

    _getElementInfo(target) {
        if (!UTILS.IS_DOM(target)) return;

        const ID = target.id;
        const CL = target.className;

        let info = {
            id: {
                unid,
                room,
                date
            },
            class: {
                unid: [],
            },
            attr: {
                selGroup
            }
        };

        let regExp = {
            id: {
                unid: /N\d+/,
                room: /R\d+/,
                date: /D\d{4}-\d{2}-\d{2}/
            },
            class: {
                unid: /N\d+/g,
            }
        };

        info.id.unid = regExp.id.unid.test(ID) ? ID.match(regExp.id.unid)[0].substring(1) : '';
        info.id.room = regExp.id.room.test(ID) ? ID.match(regExp.id.room)[0].substring(1) : '';
        info.id.date = regExp.id.date.test(ID) ? ID.match(regExp.id.date)[0].substring(1) : '';

        info.class.unid = regExp.class.unid.test(CL) ? CL.match(regExp.class.unid).map(function (el) { return el.substring(1); } ) : [];

        info.attr.selGroup = target.getAttribute('sg') || '';

        return info;
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