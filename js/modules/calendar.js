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

    constructor() {
        this.prefix = 'selection-group';
        this.attr = 'data-selection-group';
        this.unid = undefined;
    }
    
    /**
     * Очистка ID текущего обрабатываемого класса
     * 
     * @memberof SelectionGroup
     */
    static free(target) { target.dataset.unid = undefined; }

    /**
     * Формирование ID нового класса
     * 
     * @static
     * @returns 
     * @memberof SelectionGroup
     */
    static gen() { return Math.ceil(Math.random() * 100000); }

    /**
     * Добавление класса к объекту.
     * Если ID класса не сформирован то перед добавление будет вызван метод формирующий ID класса
     * 
     * @static
     * @param {DOM} target 
     * @param {number} [selection=0] 
     * @returns selection
     * @memberof SelectionGroup
     */
    static add(target, selection = 0) {
        let unid = selection ? selection : this.gen();
        target.dataset.selection =  this.unid;
        this.enum(unid);
        return unid;
    }

    /**
     * Поиск ID класса присвоенного объекту с последующим удалением и пересчетом оставшихся элементов 
     * которым присвоей этот ID
     * 
     * @param {any} target 
     * @memberof SelectionGroup
     */
    static del(target) {
        let unid = target.dataset.selection;
        let group = document.querySelectorAll(`[data-selection='${unid}']`);
        for (let i = group.length; i > 0; i--) {
            let el = group[0];
            while (el.hasChildNodes()) el.removeChild(el.firstChild);
             // FIX перенести логику удаления выделения в календарь
            // el.classList.remove(GL.CONST.CSS.CALENDAR.CLASS.SELECTED);
            el.datset.selection = undefined;
            if (el.id == target.id) break; 
        }
        this.enum(unid);
    }

    /**
     * Пересчет кол-ва объектов класса по ID класса 
     * 
     * @param {any} selection 
     * @memberof SelectionGroup
     */
     
    static enum(selection) {
        let i = 1;
        let group = document.querySelectorAll(`[data-selection='${selection}']`);
        for (let j = group.length; j > 0; j--) {
            let el = group[0];
            while (el.hasChildNodes()) el.removeChild(el.firstChild);
            el.textContent = (i++);
        }
    }

    static getGroup(selection, post = 'F;L') {
        let group = document.querySelectorAll(`[data-selection='${selection}']`);
        if (pos === 'F') return group[0];
        else if (pos === 'L') return group[group.length];
        else return group;
    }
}

/**
 * 
 * @class IGuest
 */
class IGuest {
    constructor(entries = {}) {
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
        this._selectionGroup;

        // TODO как-нибудь передeлать
        this._intent = { 
            add: 'add',
            upd: 'upd',
            upd: 'upd',
            pickPeriod: 'pick-period'
        };
        // TODO как-нибудь передeлать
        this._dataAttr = {
            view: {
                fix: 'fix',
                hov: 'hov'
            },
            status: {
                selected: "selected", // выделен
                reserved: "reserved", // зарезервирован
                adjacent: "adjacent", // смежный
                redeemed: "redeemed", // выкупленный 
            }
        };

        this.cb = {

            rcm: {

                add: function RCMItemAddGuest(e) {
                    let guestCard = new GuestCard({
                        intent: this.intent.add,
                        title: GL.CONST.LOCALIZABLE.VAR003.ADD,
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
                        intent: this.intent.del,
                        title: GL.CONST.LOCALIZABLE.VAR003.DELETE,
                        text: UTILS.FORMAT(GL.CONST.LOCALIZABLE.MSG001, { 1: e.detail.data.unid }),
                        data: { guest: e.detail.data },
                        cb: { ok: function (data) { EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.DIALOG_SAVE, data); } }
                    });
                    confirmDialog.bind();
                    confirmDialog.show();
                },
        
                upd: function RCMItemUpdGuest(e) {
                    let self = this;

                    EVENT_BUS.register(`${GL.CONST.EVENTS.CALENDAR.DB.GL001.SELECT.SUCCESS}${this.intent.upd}`, showGuestCard, true);
                    DB.GL001.SELECT({ unid: e.detail.data.unid }, this.intent.upd);

                    function showGuestCard(e) {
                        let guest;
                        try {
                            guest = new Guest(e.detail.data.guest[0]);
                        } catch (err) {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B000, err.message);
                            return;
                        }
                        let guestCard = new GuestCard({
                            intent: this.intent.upd,
                            title: GL.CONST.LOCALIZABLE.VAR003.UPDATE,
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

            calendar: {

                td: {

                    mouseDown: function mousedown(e) {

                        let self = this,
                            target = e.target;

                        switch (e.which) {
                            case 1: leftMouse(); return;
                            case 3: rightMouse(); return;
                            default: return;
                        }

                        function leftMouse() {
                            
                            (function toggleSelection() {
                                GL.DATA.CORE.isMouseDown = true;
                                if (target.dataset.status == self.dataAttr.status.selected) target.dataset.status = '';
                                self.isSelected = !!target.dataset.status;
                                SelectionGroup.del(target);
                                self.isSelected ? (self.selectionGroup = SelectionGroup.add(e.target, self.selectionGroup)) : SelectionGroup.free();
                            })();

                            (function toggleView() {
                                let ids = target.dataset.unid.split(',');
                                for (let id of ids) {
                                    document.querySelectorAll(`#calendar [data-unid='${id}']`).forEach(function (el) {
                                        let ds = el.dataset;
                                        ds.view = (ds.view == self.dataAttr.view.hov) ? self.dataAttr.view.fix : self.dataAttr.view.hov;
                                    });

                                    let bookRow = document.querySelector(`.book tr#N${id}`);
                                    bookRow.dataset.view = (bookRow.dataset.view == self.dataAttr.view.hov) ? self.dataAttr.view.fix : self.dataAttr.view.hov;
                                }
                            })();
                        }
                        
                        /**
                         * Для активной ячейки вытягиваем значение даты
                         * Тут можно вытягивать дату первой выделенной ячейки
                         * и последней и по ним првоерять гостя в БД
                         * Я вытягиваю дату только одной чейки на покторой нажали ПКМ
                         * Мне кажется так правильней
                         * 
                         * @returns boolean
                         */
                        async function rightMouse() {
                            debugger;
                            let year = self.year(),
                                month = self.month.num(),
                                room = target.dataset.room,
                                begda = target.dataset.date,
                                endda = new Date(target.dataset.date);

                            endda = new Date(endda.setMonth(endda.getMonth() + 1));
                            
                            let data = await new Select('', {types: 'sss', param: [begda, endda, room]}).Select('*').From('gl001').Where(`dbeg <= ? AND dend >= ? AND room = ?`).fetch();
                            data = data.data;

                            let isAvailableButton, guest;

                            switch (data.length) {
                                case 0:
                                    isAvailableButton = true;
                                    guest = new Guest();
                                    guest.Room = room;
                                    guest.Dbeg = SelectionGroup.getGroup(target.dataset.selection, 'F').dataset.date;
                                    guest.Dend = SelectionGroup.getGroup(target.dataset.selection, 'L').dataset.date;
                                    break;

                                case 1:
                                    isAvailableButton = false;
                                    guest = new Guest(data);
                                    break;

                                default:
                                    return false;
                                    break;
                            }

                            let rcmenu = new RCMenu({
                                item: { upd: !isAvailableButton, del: !isAvailableButton, add: isAvailableButton },
                                x: e.pageX, y: e.pageY,
                                guest
                            });
                            rcmenu.bind();
                            rcmenu.show();

                            return true;
                        }
                    },
        
                    mouseOver: function mouseover(e) {
        
                        let self = this,
                            target = e.target;
                        
                        (function toggleSelection() {
                            if (!GL.DATA.CORE.isMouseDown) return;
                            let ds = target.dataset;
                            if (ds.status === '' || ds.status == self.dataAttr.status.selected) {
                                SelectionGroup.del(target);
                                self.isSelected && (self.selectionGroup = SelectionGroup.add(target, self.selectionGroup));
                                target.dataset.status = self.isSelected ? '' : self.dataAttr.status.selected;
                            } else {
                                SelectionGroup.free();
                            }
                        })();

                        (function toggleView() {
                            let idList = target.dataset.unid ? target.dataset.unid.split(',') : [];
                            for (let id of idList) {

                                document.querySelectorAll(`#calendar [data-unid='${id}']`).forEach(el => {
                                    if (Object.values(self.dataAttr.view).indexOf(el.dataset.view) > -1) return;
                                    el.dataset.view = self.dataAttr.view.hov;
                                });
                                
                                let bookRow = document.querySelector(`.book tr#N${id}`);
                                if (Object.values(bookRow.dataAttr.view).indexOf(cell.dataset.view) > -1) continue;
                                bookRow.dataset.view = self.dataAttr.view.hov;
                            }

                            let date = target.dataset.date;

                            if (!date) {
                                return;
                            }
                            // NOTE подумать - оставить клссом или переделать на data-* 
                            document.querySelector(`#calendar > thead tr:nth-child(2) th#D${date}`).classList.add(self.dataAttr.view.hov);
                        })();
                    },
        
                    mouseOut: function mouseout(e) {
        
                        let self = this,
                            target = e.target;
                        
                        (function toggleView() {
                            let idList = target.dataset.unid ? target.dataset.unid.split(',') : [];
                            for (let id of idList) {
                                document.querySelectorAll(`#calendar [data-unid='${id}']`).forEach(el => { el.dataset.view = ''; });
                                document.querySelector(`.book tr#N${id}`).dataset.view = '';
                            }

                            let date = target.dataset.date;

                            if (!date) {
                                return;
                            }
                            // NOTE 
                            document.querySelector(`#calendar > thead tr:nth-child(2) th#D${date}`).classList.remove(self.css.view);
                        })();
                    },
        
                    mouseUp: function mouseup(e) {
        
                        SelectionGroup.free();
                        GL.DATA.CORE.isMouseDown = false;
                    },
                },

                th: {

                    mouseDown: function mousedown(e) {

                        let self = this,
                            target = e.target;
    
                        target.dataset.view = target.dataset.view == self.dataAttr.view.fix ? '' : self.dataAttr.fix;
                        let book = document.querySelector(`#${target.parentNode.id}-book`);

                        if (!book) { return; }

                        let stDisplay = window.getComputedStyle(book).getPropertyValue('display');
                        if (book.style.display === 'none' || stDisplay === 'none') book.style.display = 'table-row';
                        else book.style.display = 'none';
                    },
                },

            },

            book: {
                // TODO переделать по аналогии с календарем
                tr: {

                    mouseDown: function mousedown(e) {
                        /*
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
                            document.querySelectorAll(`#calendar [data-unid='${id}']`).forEach(el => {
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
                        */
                    },
        
                    mouseOver: function mouseover(e) {
                        /*
                        let self = this;

                        let innerBook = e.target.closest('.book');
                        if (!innerBook) return;

                        let personRow = innerBook.querySelector('.person-row');
                        if (personRow.classList.contains(self.css.viewFix)) return;

                        personRow.classList.add(self.css.view);
                        document.querySelectorAll(`#calendar > tbody > tr > td.${personRow.id}`).forEach(function (el) {
                            el.classList.add(`${personRow.id}-${self.css.view}`);
                        });
                        */
                    },
        
                    mouseOut: function mouseout(e) {
                        /*
                        let self = this;

                        let innerBook = e.target.closest('.book');
                        if (!innerBook) return;

                        let personRow = innerBook.querySelector('.person-row');
                        if (personRow.classList.contains(self.css.viewFix)) return;

                        personRow.classList.remove(self.css.view);
                        document.querySelectorAll(`#calendar > tbody > tr > td.${personRow.id}`).forEach(function (el) {
                            el.classList.remove(`${personRow.id}-${self.css.view}`);
                        });
                        */
                    },
                },
            },

            control: {

                month: {

                    prev: function prevMonth(e) {

                        (() => {
                            let date = new Date(self.year, self.month.num);
                            date.setMonth(date.getMonth() - 1);
                            self.year = date.getFullYear();
                            self.month = date.getMonth() + 1;
                        })();

                        (async () => { await self.updateConfig(this.year, self.month.num)})();

                        (async () => {
                            try {
                                let guest = await self.fetchGuest();
                                self.guest = guest.data;
                                self.resetView();
                                self.add(self.guest);
                           } catch (e) {
                           
                           }
                       })();
                    },

                    next: function nextMonth(e) {

                        (() => {
                            let date = new Date(self.year, self.month.num);
                            date.setMonth(date.getMonth() + 1);
                            self.year = date.getFullYear();
                            self.month = date.getMonth() + 1;
                        })();

                        (async () => { await self.updateConfig(this.year, self.month.num)})();

                        (async () => {
                            try {
                                let guest = await self.fetchGuest();
                                self.guest = guest.data;
                                self.resetView();
                                self.add(self.guest);
                           } catch (e) {
                           
                           }
                       })();
                    }
                },

                pickPeriod: function pickPeriod(e) {
                    // FIX promise
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
                // FIX SQL
                save: function (e) {
                    const E = this.intent;

                    let that = this,
                        data = e.detail.data || this;

                    switch (data.intent) {
                        /*
                        case E.add.key: GL001.INSERT(data.guest, this.eventId); break;
                        case E.upd.key: GL001.UPDATE(data.guest, this.eventId); break;
                        case E.del.key: GL001.DELETE(data.guest, this.eventId); break;
                        */
                        case E.pickPeriod: pickPeriod(); break;
                        default: break;
                    }
                }
            },
            /*
                gl001: {
                    insert: {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg);
                            const D = e.detail.data;
                            if (!D.status) return;
                            this.guest = D.guest;
                            this.add(this.guest);
                    },
                    update: {
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
                    delete: {
                            UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.B001.TITLE, e.detail.data.msg);
                            const D = e.detail.data;
                            this.guest = D.guest;
                            D.status && this.del(this.guest);
                    },
                },
            */
        };
    }

    set guest(entry) {
        let guests = [];
        (Array.isArray(entry)) ? entry.forEach(el => guests.push(new Guest(el))) : guests.push(new Guest(entry));
        this._guest = guests;
    }
    get guest() { return this._guest; }

    set month(month) { this._month = month; }
    get month() {
        return {
            name: new Date(1900, this._month).toLocaleString(GL.CONST.LOCALE, { month: "long" }),
            num: UTILS.OVERLAY(this._month, '0', 2),
        };
    }

    set year(year) { this._year = year; }
    get year() { return this._year; }

    set rooms(rooms) { this._rooms = rooms; }
    get rooms() { return this._rooms; }

    set isSelected(isSelected) { this._isSelected = isSelected; }
    get isSelected() { return this._isSelected; }

    set selectionGroup(selectionGroup) { this._selectionGroup = selectionGroup; }
    get selectionGroup() { return this._selectionGroup; }

    get eventId() { return this._eventId; }
    get monthNames() { return this._monthNames; }
    get intent() { return this._intent; }
    get dataAttr() { return this._dataAttr; }

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
        this.setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseDown.bind(this));
        this.setDelegate('mouseover', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseOver.bind(this));
        this.setDelegate('mouseout', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseOut.bind(this));
        this.setDelegate('mouseup', qsParent, qsChild, qsParentExcl, L.calendar.td.mouseUp.bind(this));

        qsParent = '#calendar > tbody'; qsChild = 'tr > th'; qsParentExcl = '';
        this.setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.calendar.th.mouseDown.bind(this));

        qsParent = '#calendar > tbody'; qsChild = '.book'; qsParentExcl = '';
        this.setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.book.tr.mouseDown.bind(this));
        this.setDelegate('mouseover', qsParent, qsChild, qsParentExcl, L.book.tr.mouseOver.bind(this));
        this.setDelegate('mouseout', qsParent, qsChild, qsParentExcl, L.book.tr.mouseOut.bind(this));

        const E = GL.CONST.EVENTS.CALENDAR;
        EVENT_BUS.register(E.DIALOG_SAVE, L.dialog.save.bind(this));
        EVENT_BUS.register(E.RC_MENU.RCM_ITEM_ADD_GUEST, L.rcm.items.add.bind(this));
        EVENT_BUS.register(E.RC_MENU.RCM_ITEM_DEL_GUEST, L.rcm.items.del.bind(this));
        EVENT_BUS.register(E.RC_MENU.RCM_ITEM_UPD_GUEST, L.rcm.items.upd.bind(this));
    }

    /**
     * 
     * @return {void}@memberof Calendar
     */
    init() {
        // TODO waiting window
        let self = this;
        (async () => {
            try {
                let config = await self.fetchConfig();
                self.year = config.data[0].year;
                self.month = config.data[0].month;

                let rooms = await self.fetchRoom();
                self.rooms = rooms.data;

                let guest = await self.fetchGuest(self.year, (self.month.num - 1));
                self.guest = guest.data;

                self.resetView();
                self.add(self.guest);
            } catch (err) {
                // TODO 
            }
        })();
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
                switch (cell.dataset.status) {
                    case self.dataAttr.status.redeemed:
                    case self.dataAttr.status.reserved:
                        cell.dataset.status = self.dataAttr.status.adjacent;
                        break;
                
                    default:
                        cell.dataset.status = (tmpda < curda) ? self.dataAttr.status.redeemed : self.dataAttr.status.reserved;    
                        break;
                }
                let unid = cell.dataset.unid ? cell.dataset.unid.split(',') : [];
                // не удается сократить, вместо строки айдишников возвращается длина массива
                unid.push(guest.Unid)
                unid = unid.toString();
                cell.dataset.unid = unid;

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

        function isDateValid(d) { return d.format('yyyy-mm') == (self.year + '-' + self.month.num); }

        function fillBook(guest) {

            // FIX check empty field

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
        /*
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
        */
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
    resetView() {

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
                        // TODO dataset room day
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
     * @param  {string} eventName 
     * @param  {string} qsParent 
     * @param  {string} qsChild 
     * @param  {string} qsClosestExcl 
     * @param  {function} callback 
     * @return {void}@memberof Calendar
     */
    setDelegate(eventName, qsParent, qsChild, qsClosestExcl, callback) {

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

    /**
     * 
     * @static
     * @param  {string} room 
     * @return 
     * @memberof Calendar
     */
    static isEmptyBook(room) { return !document.querySelector(`#R${room}-book tbody`).childElementCount; }

    static fetchConfig() {
        return new Select().select('year, month').from('cf001').join('us001').on('us001.login = cf001.user').where('us001.login = ?').connect(1); 
    }

    static fetchRoom() { return new Select().select('*').from('rm001').connect(); }

    static fetchGuest(year, month) {
        let begda = new Date(year, month, '01'),
            endda = new Date(year, month, '01');
        endda.setMonth(endda.getMonth() + 1);
        return new Select('', { types: 'ss', param: [endda.format('yyyy-mm-dd'), begda.format('yyyy-mm-dd')] }).select('*').from('gl001').where(`dbeg <= ? AND dend >= ?`).connect(); 
    }

    static updateConfig(year, month) {
        return new Update('', { types: 'ss', param: [year, month] }).update('cf001').set('year = ?, month = ?').where('user = ?').connect(1);
    }
}