/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

(function () { "use strict"; })();

class CellSelection {

    constructor() { }

    static gen() { return Math.ceil(Math.random() * 100000); }

    static add(target, selection = 0) {
        selection = selection ? selection : CellSelection.gen();
        target.dataset.selection = selection;
        target.dataset.status = 'selected';
        CellSelection.enum(selection);
        return selection;
    }

    static del(target) {
        let selection = target.dataset.selection;
        if (!selection) return;
        Array.prototype.slice.call(document.querySelectorAll(`[data-selection='${selection}']`)).some(el => {
            while (el.hasChildNodes()) el.removeChild(el.firstChild);
            el.removeAttribute('data-selection');
            el.removeAttribute('data-status');
            return (el.id === target.id);
        });;
        CellSelection.enum(selection);
    }

    static enum(selection) {
        let i = 1;
        document.querySelectorAll(`[data-selection='${selection}']`).forEach(el => {
            while (el.hasChildNodes()) el.removeChild(el.firstChild);
            el.textContent = (i++);
        });;
    }

    static getGroup(selection, pos = 'F;L') {
        let group = document.querySelectorAll(`[data-selection='${selection}']`);
        if (pos === 'F') return group[0];
        else if (pos === 'L') return group[group.length - 1];
        else return group;
    }
}

class IGuest {
    constructor() { }
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

class Guest extends IGuest {

    constructor(o = {}) {
        super();
        this.d = o.dbeg ? new Date(o.dbeg) : new Date();
        this.b = { d: this.d.getDate(), m: this.d.getMonth() + 1, y: this.d.getFullYear() };
        this.d = o.dend ? new Date(o.dend) : new Date();
        this.e = { d: this.d.getDate(), m: this.d.getMonth() + 1, y: this.d.getFullYear() };

        this.id = Math.floor(Math.random() * 100000);
        this._unid = o.unid || '';
        this._dbeg = { d: this.b.d, m: this.b.m, y: this.b.y, toString: function() { return new Date(`${this.y}-${this.m}-${this.d}`).format('yyyy-mm-dd'); } }
        this._dend = { d: this.e.d, m: this.e.m, y: this.e.y, toString: function() { return new Date(`${this.y}-${this.m}-${this.d}`).format('yyyy-mm-dd'); } }
        this._days = o.days || '';
        this._room = o.room || '';
        this._base = o.base || '';
        this._adjs = o.adjs || '';
        this._cost = o.cost || '';
        this._paid = o.paid || '';
        this._name = o.name || '';
        this._teln = o.teln || '';
        this._fnot = o.fnot || '';
        this._city = o.city || '';
    }
    set unid(val) { this._unid = val || ''; } get unid() { return this._unid; }
    set dbeg(val) { let d = this.dateParse(val); (d.d) && (this._dbeg.d = d.d); (d.m) && (this._dbeg.m = d.m); (d.y) && (this._dbeg.y = d.y); }
    get dbeg() { return this._dbeg; }
    set dend(val) { let d = this.dateParse(val); (d.d) && (this._dend.d = d.d); (d.m) && (this._dend.m = d.m); (d.y) && (this._dend.y = d.y); }
    get dend() { return this._dend; }
    set days(val) { this._days = val || ''; } get days() { return this._days; }
    set room(val) { this._room = val || ''; } get room() { return this._room; }
    set base(val) { this._base = val || ''; } get base() { return this._base; }
    set adjs(val) { this._adjs = val || ''; } get adjs() { return this._adjs; }
    set cost(val) { this._cost = val || ''; } get cost() { return this._cost; }
    set paid(val) { this._paid = val || ''; } get paid() { return this._paid; }
    set name(val) { this._name = val || ''; } get name() { return this._name; }
    set teln(val) { this._teln = val || ''; } get teln() { return this._teln; }
    set fnot(val) { this._fnot = val || ''; } get fnot() { return this._fnot; }
    set city(val) { this._city = val || ''; } get city() { return this._city; }

    dateParse(val) {
        let result = { d: '', m: '', y: '' };
        let regexp = {
            s: { r: /^(\d{1,2})$/, d: { d: 1 } },
            m: { r: /^(\d{1,2}).(\d{1,2})$/, d: { d: 1, m: 2 } },
            e: { r: /^(\d{4}).(\d{2}).(\d{2})$/, d: { d: 3, m: 2, y: 1 } },
            r: { r: /^(\d{2}).(\d{2}).(\d{4})$/, d: { d: 1, m: 2, y: 3 } },
        };
        for (let o in regexp) {
            let reg = regexp[o].r, rul = regexp[o].d, arr = val.match(reg);
            if (reg.test(val)) for (let i in rul) { result[i] = arr[rul[i]]; }
        }
        return result;
    }
}

class Journal extends DataWrapper {

    constructor() {
        super();

        this._year = new Date().getFullYear();
        this._month = new Date().getMonth() + 1;
        this._guest = [];
        this._rooms = []; // TODO подумать как можно это убрать
        this._selection;

        this.cb = {

            rcm: {

                add: function (e) {
                    let self = this;
                    let guestCard = new GuestCard({
                        intent: 'add',
                        title: GL.CONST.LOCALIZABLE.VAR003.ADD,
                        isReadOnly: false,
                        isStrict: true,
                        month: this.month.JSnum,
                        year: this.year,
                        rooms: this.rooms
                    });
                    guestCard.bind();
                    guestCard.setVal(e.detail.data);
                    guestCard.show();
                    (async () => {
                        try {
                            let g = await guestCard.getPromise();
                            let insert = await new Insert('', {
                                    types: 'ssiiddddssss',
                                    param: [g.dbeg.toString(), g.dend.toString(), g.days, g.room, g.base, g.adjs, g.cost, g.paid, g.name, g.teln, g.fnot, g.city]
                                }).into('gl001 (dbeg, dend, days, room , base, adjs, cost, paid, name, teln, fnot, city, user)').values('(?,?,?,?,?,?,?,?,?,?,?,?,?)').connect(1);
                            if (!insert.insertId) return;
                            let select = await new Select('', { types: 'i', param: [insert.insertId] }).select('*').from('gl001').where('unid = ?').connect();
                            if (!select.status) return;
                            self.guest = select.data[0];
                            self.add(self.guest);
                        } catch (error) { return; }
                    })();
                },

                del: function (e) {
                    let self = this;
                    let confirmDialog = new ConfirmDialog({
                        intent: 'del',
                        title: GL.CONST.LOCALIZABLE.VAR003.DELETE,
                        text: UTILS.FORMAT(GL.CONST.LOCALIZABLE.MSG001, { 1: e.detail.data.unid }),
                    });
                    confirmDialog.bind();
                    confirmDialog.show();
                    (async () => {
                        try {
                            let result = await confirmDialog.getPromise();
                            if (!result) return;
                            let del = await new Delete('', { types: 'i', param: [e.detail.data.unid] }).from('gl001').where('unid = ?').connect();
                            if (!del.affectedRows) return;
                            self.del(e.detail.data.unid);
                        } catch (error) { return; }
                    })();
                },

                upd: function (e) {
                    let self = this;
                    let guestCard = new GuestCard({
                        intent: 'upd',
                        title: GL.CONST.LOCALIZABLE.VAR003.UPDATE,
                        isReadOnly: false,
                        isStrict: true,
                        month: this.month.JSnum,
                        year: this.year,
                        rooms: this.rooms
                    });
                    guestCard.bind();
                    guestCard.setVal(e.detail.data);
                    guestCard.show();
                    (async () => {
                        try {
                            let g = await guestCard.getPromise();
                            let update = await new Update('', {
                                    types: 'ssiiddddssssi',
                                    param: [g.dbeg.toString(), g.dend.toString(), g.days, g.room, g.base, g.adjs, g.cost, g.paid, g.name, g.teln, g.fnot, g.city, g.unid]
                                }).update('gl001').set('dbeg = ?, dend = ?, days = ?, room = ?, base = ?, adjs = ?, cost = ?, paid = ?, name = ?, teln = ?, fnot = ?, city = ?').where('unid = ?').connect();
                            if (!update.affectedRows) return;
                            let select = await new Select('', { types: 'i', param: [g.unid] }).select('*').from('gl001').where('unid = ?').connect();
                            if (!select.status) return;
                            self.guest = select.data[0];
                            self.upd(self.guest);
                        } catch (error) { return; }
                    })();
                },
            },

            journal: {

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

                            GL.DATA.CORE.isMouseDown = true;

                            const DATA_ATTR = GL.CONST.DATA_ATTR.JOURNAL;

                            (function toggleSelection() {
                                switch (target.dataset.status) {
                                    case undefined:
                                        self.selection = CellSelection.add(target);
                                        break;

                                    case DATA_ATTR.STATUS.SELECTED:
                                        CellSelection.del(target);
                                        self.selection = '';
                                        break;

                                    default:
                                        self.selection = '';
                                        return;
                                        break;
                                }
                            })();

                            (function toggleView() {
                                let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                                for (let id of ids) {
                                    document.querySelectorAll(`#journal [data-unid='${id}']`).forEach(el => {
                                        el.dataset.view = (el.dataset.view === DATA_ATTR.VIEW.HOV) ? DATA_ATTR.VIEW.FIX : DATA_ATTR.VIEW.HOV;
                                    });
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
                            let year = self.year,
                                month = self.month.num,
                                room = target.dataset.room,
                                date = target.dataset.date,
                                select;
                            try {
                                select = await new Select('', {types: 'sss', param: [date, date, room]}).select('*').from('gl001').where(`dbeg <= ? AND dend >= ? AND room = ?`).connect();
                            } catch (error) { return; }
                            select = select.data;

                            let isAvailableButton, guest;

                            switch (select.length) {
                                case 0:
                                    isAvailableButton = true;
                                    guest = new Guest();
                                    guest.room = room;
                                    guest.dbeg = CellSelection.getGroup(target.dataset.selection, 'F').dataset.date;
                                    guest.dend = CellSelection.getGroup(target.dataset.selection, 'L').dataset.date;
                                    break;

                                case 1:
                                    isAvailableButton = false;
                                    guest = new Guest(select[0]);
                                    break;

                                default:
                                    return;
                                    break;
                            }

                            let rcmenu = new RCMenu({
                                item: { upd: !isAvailableButton, del: !isAvailableButton, add: isAvailableButton },
                                x: e.pageX, y: e.pageY,
                                guest
                            });
                            rcmenu.bind();
                            rcmenu.show();
                        }
                    },

                    mouseOver: function mouseover(e) {

                        let self = this,
                            target = e.target;

                        const DATA_ATR = GL.CONST.DATA_ATTR.JOURNAL;

                        (function toggleSelection() {
                            if (!GL.DATA.CORE.isMouseDown) return;
                            if (target.dataset.status !== DATA_ATR.STATUS.SELECTED && target.dataset.status !== undefined) return;
                            self.selection ? CellSelection.add(target, self.selection) : CellSelection.del(target);
                        })();

                        (function toggleView() {
                            let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                            for (let id of ids) {
                                document.querySelectorAll(`#journal [data-unid='${id}']`).forEach(el => {
                                    if (el.dataset.view === DATA_ATR.VIEW.FIX) return;
                                    el.dataset.view = DATA_ATR.VIEW.HOV;
                                });
                            }

                            let date = target.dataset.date;
                            if (!date) { return; }
                            document.querySelector(`#journal > thead tr:nth-child(2) th#D${date}`).dataset.view = DATA_ATR.VIEW.HOV;
                        })();
                    },

                    mouseOut: function mouseout(e) {

                        let self = this,
                            target = e.target;

                        const DATA_ATR = GL.CONST.DATA_ATTR.JOURNAL;

                        (function toggleView() {
                            let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                            for (let id of ids) {
                                document.querySelectorAll(`#journal [data-unid='${id}']`).forEach(el => {
                                    (el.dataset.view === DATA_ATR.VIEW.HOV) && el.removeAttribute('data-view');
                                });
                            }

                            let date = target.dataset.date;
                            if (!date) { return; }
                            document.querySelector(`#journal > thead tr:nth-child(2) th#D${date}`).removeAttribute('data-view');
                        })();
                    },

                    mouseUp: function mouseup(e) {

                        this.selection = '';
                        GL.DATA.CORE.isMouseDown = false;
                    },
                },

                th: {

                    mouseDown: function mousedown(e) {

                        let self = this,
                            target = e.target;

                        const DATA_ATR = GL.CONST.DATA_ATTR.JOURNAL;

                        target.dataset.view = target.dataset.view == DATA_ATR.VIEW.FIX ? '' : DATA_ATR.VIEW.FIX;
                        let records = document.querySelector(`#${target.parentNode.id}-records`);

                        if (!records) { return; }

                        let stDisplay = window.getComputedStyle(records).getPropertyValue('display');
                        if (records.style.display === 'none' || stDisplay === 'none') records.style.display = 'table-row';
                        else records.style.display = 'none';
                    },
                },

            },

            records: {
                tr: {

                    mouseDown: function mousedown(e) {
                        let self = this,
                            target = e.target.closest('.record');

                        if (!target) return;

                        const DATA_ATTR = GL.CONST.DATA_ATTR.JOURNAL;

                        switch (e.which) {
                            case 1: leftMouse(); return;
                            case 3: rightMouse(); return;
                            default: return;
                        }

                        function leftMouse() {
                            let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                            for (let id of ids) {
                                document.querySelectorAll(`#journal [data-unid='${id}']`).forEach(el => {
                                    el.dataset.view = (el.dataset.view === DATA_ATTR.VIEW.HOV) ? DATA_ATTR.VIEW.FIX : DATA_ATTR.VIEW.HOV;
                                });
                            }
                        }

                        async function rightMouse() {
                            let select;
                            try {
                                select = await new Select('', {types: 'i', param: [target.dataset.unid]}).select('*').from('gl001').where(`unid = ?`).connect();
                            } catch (error) { return; }
                            if (!select.data.length) return;
                            let guest = new Guest(select.data[0]);
                            let rcmenu = new RCMenu({ item: { upd: true, del: true, add: false }, x: e.pageX, y: e.pageY, guest });
                            rcmenu.bind();
                            rcmenu.show();
                        }
                    },

                    mouseOver: function mouseover(e) {
                        let self = this,
                            target = e.target.closest('.record');

                        if (!target) return;

                        const DATA_ATR = GL.CONST.DATA_ATTR.JOURNAL;

                        let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                        for (let id of ids) {
                            document.querySelectorAll(`#journal [data-unid='${id}']`).forEach(el => {
                                if (el.dataset.view === DATA_ATR.VIEW.FIX) return;
                                el.dataset.view = DATA_ATR.VIEW.HOV;
                            });
                        }
                    },

                    mouseOut: function mouseout(e) {
                        let self = this,
                            target = e.target.closest('.record');

                        if (!target) return;

                        const DATA_ATR = GL.CONST.DATA_ATTR.JOURNAL;

                        let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                        for (let id of ids) {
                            document.querySelectorAll(`#journal [data-unid='${id}']`).forEach(el => {
                                (el.dataset.view === DATA_ATR.VIEW.HOV) && el.removeAttribute('data-view');
                            });
                        }
                    },
                },
            },

            control: {

                month: {

                    prev: function prevMonth(e) {

                        (() => {
                            let date = new Date(self.year, self.month.JSnum, '01');
                            date.setMonth(date.getMonth() - 1);
                            self.year = date.getFullYear();
                            self.month = date.getMonth() + 1;
                        })();

                        (async () => { await Journal.updateUserConfig(this.year, self.month.num)})();

                        (async () => {
                            try {
                                let guest = await Journal.initializeGuestList(self.year, self.month.JSnum);
                                self.guest = guest.data;
                                self.resetView();
                                self.add(self.guest);
                           } catch (e) { return; }
                       })();
                    },

                    next: function nextMonth(e) {

                        (() => {
                            let date = new Date(self.year, self.month.JSnum, '01');
                            date.setMonth(date.getMonth() + 1);
                            self.year = date.getFullYear();
                            self.month = date.getMonth() + 1;
                        })();

                        (async () => { await Journal.updateUserConfig(this.year, self.month.num)})();

                        (async () => {
                            try {
                                let guest = await Journal.initializeGuestList(self.year, self.month.JSnum);
                                self.guest = guest.data;
                                self.resetView();
                                self.add(self.guest);
                           } catch (e) { return; }
                       })();
                    }
                },

                pickPeriod: async function pickPeriod(e) {
                    let self = this;

                    let dialog = new PickPeriod();
                    dialog.bind();
                    dialog.setVal({ year: self.year, month: self.month.num });
                    dialog.show();
                    try {
                        var result = await dialog.getPromise();
                        self.year = result.year;
                        self.month = result.month.num;
                        new Update('', { types: 'ss', param: [self.year, self.month.num] }).update('cf001').set('year = ?, month = ?').where('user = ?').connect(1);
                        let select = Journal.initializeGuestList(self.year, self.month.JSnum);
                        self.guest = select.data;
                        self.resetView();
                        self.add(self.guest);
                    } catch (error) { return; }
                }
            }
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
            JSnum: UTILS.OVERLAY((this._month - 1), '0', 2)
        };
    }

    set year(year) { this._year = year; }
    get year() { return this._year; }

    set rooms(rooms) { this._rooms = rooms; }
    get rooms() { return this._rooms; }

    set selection(selection) { this._selection = selection; }
    get selection() { return this._selection; }

    bind (target) {

        let tree =
            [{ tag: 'table', id: 'journal' },
                [{ tag: 'thead', id: 'journal-thead' },
                    [{ tag: 'tr', id: 'journal-control-buttons' },
                        [{tag: 'td'},
                            [{ tag: 'table' },
                                [{ tag: 'tbody' },
                                    [{ tag: 'tr' },
                                        [{ tag: 'td' },
                                            { tag: 'span', id: 'journal-button-month-prev', class: 'button', events: [{ name: 'click', fn: this.cb.control.month.prev, bind: this }] },
                                        ],
                                        [{ tag: 'td' },
                                            [{ tag: 'span', id: 'journal-button-pick-period', events: [{ name: 'click', fn: this.cb.control.pickPeriod, bind: this }] },
                                                { tag: 'label', id: 'month' },
                                                { tag: 'label', id: 'year' },
                                            ],
                                        ],
                                        [{ tag: 'td' },
                                            { tag: 'span', id: 'journal-button-month-next', class: 'button', events: [{ name: 'click', fn: this.cb.control.month.next, bind: this }] },
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [{ tag: 'tr', id: 'journal-calendar-days' },
                        { tag: 'td' },
                    ],
                ],
                [{ tag: 'tbody', id: 'journal-tbody' },
                ],
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) target.appendChild(tree);
        else console.log('tree is ' + tree);

        const L = this.cb;
        let qsParent, qsChild, qsParentExcl;

        qsParent = '#journal > tbody'; qsChild = 'td'; qsParentExcl = '.records-row';
        this.setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.journal.td.mouseDown.bind(this));
        this.setDelegate('mouseover', qsParent, qsChild, qsParentExcl, L.journal.td.mouseOver.bind(this));
        this.setDelegate('mouseout', qsParent, qsChild, qsParentExcl, L.journal.td.mouseOut.bind(this));
        this.setDelegate('mouseup', qsParent, qsChild, qsParentExcl, L.journal.td.mouseUp.bind(this));

        qsParent = '#journal > tbody'; qsChild = 'tr > th'; qsParentExcl = '';
        this.setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.journal.th.mouseDown.bind(this));

        qsParent = '#journal > tbody'; qsChild = '.records'; qsParentExcl = '';
        this.setDelegate('mousedown', qsParent, qsChild, qsParentExcl, L.records.tr.mouseDown.bind(this));
        this.setDelegate('mouseover', qsParent, qsChild, qsParentExcl, L.records.tr.mouseOver.bind(this));
        this.setDelegate('mouseout', qsParent, qsChild, qsParentExcl, L.records.tr.mouseOut.bind(this));

        const E = GL.CONST.EVENTS.JOURNAL;
        EVENT_BUS.register(E.RC_MENU.ADD, L.rcm.add.bind(this));
        EVENT_BUS.register(E.RC_MENU.DEL, L.rcm.del.bind(this));
        EVENT_BUS.register(E.RC_MENU.UPD, L.rcm.upd.bind(this));
    }

    init() {
        // TODO waiting window
        let self = this;
        (async () => {
            try {
                let config = await new Select().select('year, month').from('cf001').join('us001').on('us001.login = cf001.user').where('us001.login = ?').connect(1);
                self.year = config.data[0].year;
                self.month = config.data[0].month;

                let rooms = await new Select().select('*').from('rm001').connect();
                self.rooms = rooms.data;

                let guest = await Journal.initializeGuestList(self.year, self.month.JSnum);
                self.guest = guest.data;

                self.resetView();
                self.add(self.guest);
            } catch (err) {
                // TODO error
            }
        })();
    }

    add(entries) {

        let self = this;

        if (!Array.isArray(entries)) {
           let arr = [];
           arr.push(entries);
           entries = arr;
        }

        entries.forEach(guest => {
            setJournal(guest);
            setRecords(guest);
        });

        function setJournal(guest) {

            let begda = new Date(guest.dbeg.toString()),
                endda = new Date(guest.dend.toString()),
                curda = new Date(),
                tmpda = begda;

            while (tmpda <= endda) {
                if (!isDateValid(tmpda)) {
                    tmpda.setDate(tmpda.getDate() + 1);
                    continue;
                }

                let cell = document.querySelector(`#journal #R${guest.room} #R${guest.room}D${tmpda.format('yyyy-mm-dd')}`);
                while (cell.hasChildNodes()) cell.removeChild(cell.firstChild);

                (() => {
                    const STATUS = GL.CONST.DATA_ATTR.JOURNAL.STATUS;
                    switch (cell.dataset.status) {
                        case STATUS.REDEEMED:
                        case STATUS.RESERVED:
                            cell.dataset.status = STATUS.ADJACENT;
                            break;

                        default:
                            cell.dataset.status = (tmpda < curda) ? STATUS.REDEEMED : STATUS.RESERVED;
                            break;
                    }
                    let unid = cell.dataset.unid ? cell.dataset.unid.split(',') : [];
                    unid.push(guest.unid)
                    unid = unid.toString();
                    cell.dataset.unid = unid;
                })();

                (() => {
                    let balloon = cell.querySelector('.balloon-wrapper');
                    if (!balloon) {
                        (balloon = document.createElement('div')).setAttribute('class', 'balloon-wrapper');
                        let b = document.createElement('div');
                        b.setAttribute('class', 'balloon');
                        balloon.appendChild(b);
                        cell.appendChild(balloon);
                        balloon = cell.querySelector('.balloon-wrapper .balloon');
                    }

                    let tree =
                        [{ tag: 'div', class: 'hint', attr: { 'data-balloon-unid': guest.unid } },
                            { tag: 'span', class: 'balloon-person-name', textNode: guest.name },
                            { tag: 'span', class: 'balloon-person-teln', textNode: guest.teln },
                            { tag: 'span', class: 'balloon-person-fnot', textNode: guest.fnot },
                            { tag: 'span', class: 'balloon-person-city', textNode: guest.city },
                            { tag: 'span', class: 'balloon-person-unid', textNode: guest.unid }
                        ];

                    tree = new DOMTree(tree).cultivate();
                    balloon.appendChild(tree);
                })();

                tmpda.setDate(tmpda.getDate() + 1);
            }
        }

        function isDateValid(d) { return d.format('yyyy-mm') == (self.year + '-' + self.month.num); }

        function setRecords(guest) {

            let tree, days = new Date(self.year, self.month.JSnum, 0).getDate();

            if (!document.getElementById(`R${guest.room}-records`)) {
                tree =
                    [{ tag: 'tr', id: `R${guest.room}-records`, class: 'hidden records-row' },
                        [{ tag: 'td', colspan: (days + 1) },
                            [{ tag: 'table', class: 'records' },
                                { tag: 'tbody' }
                            ]
                        ]
                    ];
                tree = new DOMTree(tree).cultivate();
                let tr = document.querySelector(`#journal > tbody tr#R${guest.room}`);
                tr.parentNode.insertBefore(tree, tr.nextSibling);
            }

            const P = GL.CONST.PREFIX.PERSON;
            tree =
                [{ tag: 'tr', id: `N${guest.unid}`, class: 'record', attr: { 'data-unid': guest.unid } },
                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.unid}`, textNode: guest.unid },
                    [{ tag: 'td' },
                        [{ tag: 'table', class: 'record-detail' },
                            [{ tag: 'tbody' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: `${P.FIELD} person-base-info` },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.name}`, textNode: guest.name },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.teln}`, textNode: guest.teln },
                                    ],
                                    { tag: 'td', class: `${P.FIELD} person-dates ${P.CELL}-${IGuest.dbeg}`, attr: { value: guest.dbeg }, textNode: new Date(guest.dbeg.toString()).format('dd.mm') },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.room}`, rowspan: 2, textNode: guest.room },
                                    { tag: 'td', class: `${P.FIELD} ${P.CELL}-${IGuest.cost}`, textNode: guest.cost },
                                ],
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: `${P.FIELD} person-additional-info` },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.city}`, textNode: guest.city },
                                        { tag: 'a', class: `${P.FIELD} ${P.CELL}-${IGuest.fnot}`, textNode: guest.fnot },
                                    ],
                                    { tag: 'td', class: `${P.FIELD} person-dates ${P.CELL}-${IGuest.dend}`, attr: { value: guest.dend }, textNode: new Date(guest.dend.toString()).format('dd.mm') },
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
            document.querySelector(`#R${guest.room}-records .records tbody`).appendChild(tree);
        }
    }

    del(unid) {

        let self = this;
        const CURRENT_DATE = new Date();

        (() => {
            let record = document.querySelector(`#journal .records #N${unid}`);
            record.parentNode.removeChild(record);
        })();

        (() => {
            document.querySelectorAll(`[data-unid='${unid}']`).forEach((el) => {
                const STATUS = GL.CONST.DATA_ATTR.JOURNAL.STATUS;
                if (el.dataset.status === STATUS.ADJACENT) {
                    el.dataset.status = (new Date(el.dataset.date) < CURRENT_DATE) ? STATUS.REDEEMED : STATUS.RESERVED;
                    let unids = el.dataset.unid.split(',');
                    unids.splice(unids.indexOf(unid), 1);
                    el.dataset.unid = unids.toString();
                    let hint = el.querySelector(`[data-baloon-unid='${unid}']`);
                    (!hint) && hint.parentNode.removeChild(hint);
                } else {
                    el.removeAttribute('data-status');
                    el.removeAttribute('data-unid');
                    while (el.hasChildNodes()) el.removeChild(el.firstChild);
                }
            });
        })();
    }

    upd(entries) {

        let self = this;

        if (!Array.isArray(entries)) {
            let arr = [];
            arr.push(entries);
            entries = arr;
        }

        entries.forEach(guest => {
            this.del(guest.unid);
            this.add(guest);
        });

        sort();

        function sort() {
            /*
             TODO sort
            newEntries.forEach(guest => {
                let tr = document.querySelectorAll(`#R${guest.Room}-records > td > .records > tbody > tr`),
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
                        let curRow = document.querySelector(`#R${guest.Room}-records tr#N${pos[i].id}`),
                        nextRow = document.querySelector(`#R${guest.Room}-records tr#N${pos[i + 1].id}`);
                        nextRow.parentNode.insertBefore(nextRow, curRow);
                    }
                }
            });
            */
        }
    }

    resetView() {

        let self = this;
        free ();
        build ();

        function free() {

            let journal   = document.getElementById('journal'),
                labelYear  = journal.querySelector('#year'),
                labelMonth = journal.querySelector('#month'),
                tbody      = journal.querySelector('#journal-tbody'),
                daysRow    = journal.querySelector('#journal-calendar-days');

            if (tbody) while (tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
            if (daysRow) while (daysRow.hasChildNodes()) daysRow.removeChild(daysRow.firstChild);

            while (labelYear.firstChild) labelYear.removeChild(labelYear.firstChild);
            while (labelMonth.firstChild) labelMonth.removeChild(labelMonth.firstChild);
        }

        function build() {

            const DAYS = new Date(self.year, self.month.JSnum, 0).getDate().toString();

            document.getElementById('journal-control-buttons').getElementsByTagName('td')[0].setAttribute('colspan', DAYS);

            let journal   = document.getElementById('journal'),
                labelYear  = journal.querySelector('#year'),
                labelMonth = journal.querySelector('#month');

            labelYear.appendChild(document.createTextNode(self.year));
            labelMonth.appendChild(document.createTextNode(self.month.name));

            let daysRow = document.getElementById('journal-calendar-days');

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

            let tbody = document.getElementById('journal-tbody');
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
                        let date = new Date(self.year, self.month.JSnum, day).format('yyyy-mm-dd');
                            id = `R${room.room}D${date}`;
                        node = document.createElement('td');
                        node.setAttribute('id', id);
                        node.dataset.room = room.room;
                        node.dataset.date = date;
                        node.appendChild(document.createTextNode(''));
                    }
                    tr.appendChild(node);
                    day++;
                }
                tbody.appendChild(tr);
            }
        }
    }

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

    static initializeGuestList(year, month) {
        let begda = new Date(year, month, '01'),
            endda = new Date(year, month, '01');
        endda.setMonth(endda.getMonth() + 1);
        return new Select('', { types: 'ss', param: [endda.format('yyyy-mm-dd'), begda.format('yyyy-mm-dd')] }).select('*').from('gl001').where(`dbeg <= ? AND dend >= ?`).connect();
    }

    static updateUserConfig(year, month) {
        return new Update('', { types: 'ss', param: [year, month] }).update('cf001').set('year = ?, month = ?').where('user = ?').connect(1);
    }
}