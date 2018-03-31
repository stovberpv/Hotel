/*jshint esversion: 6 */
/*jshint -W030 */
(function () { "use strict"; })();

class Dialog {

    constructor(opts) {
        this.opts = opts;
        this.id = Math.floor(Math.random() * 100000);

        this.cb = {
            control: {},
            command: {
                ok: function () {
                    let val = this.getVal();
                    this.unbind();
                    this.promise.resolve(val);
                },
                no: function () {
                    this.unbind();
                    this.promise.reject();
                }
            }
        };

        this.promise = {
            resolve: null,
            reject: null
        };
    }

    bind() {}
    setVal() {}
    getPromise() {
        var self = this;
        return new Promise((resolve, reject) => { self.promise.resolve = resolve; self.promise.reject = reject; });
    }
    show() {}
    getVal() {}
    unbind() {}
}

class ConfirmDialog extends Dialog {

    constructor(opts) { super(opts); }

    bind() {

        const B = GL.CONST.LOCALIZABLE.VAR002;
        const P = GL.CONST.PREFIX.CONFIRM_DIALOG;
        const O = this.opts;
        let tree =
            [{ tag: 'div', id: `${P}-${this.id}`, class: `${P} modal modal-wrapper` },
                [{ tag: 'div', class: `${P} modal-content` },
                    [{ tag: 'div', class: `${P} modal-header intent-${O.intent}` },
                        { tag: 'label', textNode: O.title }
                    ],
                    [{ tag: 'div', class: `${P} modal-body` },
                        { tag: 'label', textNode: O.text }
                    ],
                    [{ tag: 'div', class: `${P} modal-footer` },
                        { tag: 'button', class: 'button negative', type: 'button', textNode: B.NO, events: [{ name: 'click', fn: this.cb.command.no, bind: this }] },
                        { tag: 'button', class: 'button positive', type: 'button', textNode: B.OK, events: [{ name: 'click', fn: this.cb.command.ok, bind: this }] },
                    ]
                ]
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) document.body.appendChild(tree);
        else console.log('tree is ' + tree);
    }

    setVal() {  }

    getPromise() { return super.getPromise(); }

    show() {
        const P = GL.CONST.PREFIX.CONFIRM_DIALOG;
        let dialog = document.getElementById(`${P}-${this.id}`);
        dialog.style.display = 'block';
    }

    getVal() { return true; }

    unbind() {
        const P = GL.CONST.PREFIX.CONFIRM_DIALOG;
        let dialog = document.getElementById(`${P}-${this.id}`);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }
}

class GuestCard extends Dialog {

    constructor(opts) {
        super(opts);

        this.utils = {
            checkDate: function (e) {
                return !!this.check([/^\d{1,2}$/, /^\d{1,2}\.\d{1,2}$/, /^\d{1,2}\.\d{1,2}\.\d{4}$/], e);
            },

            calcFields: function (self) {

                const O = self.opts;
                const P = GL.CONST.PREFIX.GUEST_CARD;

                let dialog = document.getElementById(`${P}-${self.id}`),
                    dbeg = dialog.querySelector(`#${P}-el-${IGuest.dbeg} input`),
                    dend = dialog.querySelector(`#${P}-el-${IGuest.dend} input`),
                    days = dialog.querySelector(`#${P}-el-${IGuest.days} input`),
                    room = dialog.querySelector(`#${P}-el-${IGuest.room} input`),
                    base = dialog.querySelector(`#${P}-el-${IGuest.base} input`),
                    adjs = dialog.querySelector(`#${P}-el-${IGuest.adjs} input`),
                    cost = dialog.querySelector(`#${P}-el-${IGuest.cost} input`);

                function d(d, m, y) { return new Date((y || O.year), (m ? (m - 1) : O.month), d); }

                let begda = d(...dbeg.value.split('.')),
                    endda = d(...dend.value.split('.'));

                let totalDays = ((endda - begda) / GL.CONST.VALUES.UTILS.ONE_DAY) + 1;

                let rooms = O.rooms.filter(function (el) { return el.room == room.value; });
                (base.value === 0) && (base.value = rooms[0].price);

                let price = (parseInt(base.value) || 0) + (parseInt(adjs.value) || 0),
                    mustBePaid = price * totalDays;

                days.value = totalDays;
                cost.value = mustBePaid;
                cost.dispatchEvent(new Event('change'));
            },

            check(regexArr, e) {
                let value = e.target.value.split(''),
                    key = e.key,
                    selEnd = e.srcElement.selectionEnd,
                    selStart = e.srcElement.selectionStart;

                (selEnd === selStart) ? value.splice(selStart, 0, key) : value[selStart] = key;
                value = value.join('');

                let result = 0;
                regexArr.forEach(reg => { result += reg.test(value); });
                return !!result;
            }
        };

        this.cb.control = {

            dbeg: {
                keypress: function (e) { !this.utils.checkDate(e) && e.preventDefault(); },
                paste: function(e) { e.preventDefault(); },
                change: function(e) { this.utils.calcFields(this); }
            },
            dend: {
                keypress: function(e) { !this.utils.checkDate(e) && e.preventDefault(); },
                paste: function(e) { e.preventDefault(); },
                change: function(e) { this.utils.calcFields(this); }
            },
            days: {
                keypress: function (e) { e.preventDefault(); },
                keydown: function(e) { e.preventDefault(); },
                paste: function (e) { e.preventDefault(); },
                change: function (e) {
                    const P = GL.CONST.PREFIX.GUEST_CARD;

                    let dialog = document.getElementById(`${P}-${this.id}`),
                        dbeg = dialog.querySelector(`#${P}-el-${IGuest.dbeg} input`),
                        dend = dialog.querySelector(`#${P}-el-${IGuest.dend} input`);

                    if (!dbeg) {
                        UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A001.TITLE, GL.CONST.LOG.ID.A001.GIST);
                        return;
                    }

                    if (!dend) {
                        UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A001.TITLE, GL.CONST.LOG.ID.A001.GIST);
                        return;
                    }

                    let firstDay = buildDate(this.opts.year, dbeg.value).getTime(),
                        lastDay = buildDate(this.opts.year, dend.value).getTime(),
                        oneDay = GL.CONST.VALUES.UTILS.ONE_DAY;
                    dialog.querySelector(`#${P}-el-${IGuest.days} input`).value = ((lastDay - firstDay) / oneDay) + 1;

                    e.preventDefault();

                    function buildDate(year, ddmm) {
                        let period = ddmm.split('.');
                        return new Date(`${year}.${period[1]}.${period[0]}`);
                    }
                }
            },
            room: {
                keypress: function(e) { e.preventDefault(); },
                keydown: function(e) { e.preventDefault(); },
                click: function(e) { e.target.parentNode.querySelector('#rooms-drop-down-list').classList.toggle('rooms-drop-down-list-visible'); },
                paste: function(e) { e.preventDefault(); },
                change: function (e) {
                    const P = GL.CONST.PREFIX.GUEST_CARD;

                    let dialog = document.getElementById(`${P}-${this.id}`),
                        room = this.opts.rooms.filter(function (el) { return el.room == e.target.value; }),
                        baseline = dialog.querySelector(`#${P}-el-${IGuest.base} input`);

                    baseline.value = room.length !== 0 ? room[0].price : 0;
                    baseline.dispatchEvent(new Event('change'));
                }
            },
            base: {
                keypress: function(e) { e.preventDefault(); },
                keydown: function(e) { e.preventDefault(); },
                paste: function(e) { e.preventDefault(); },
                change: function(e) { this.utils.calcFields(this); }
            },
            adjs: {
                keypress: function(e) { !this.utils.check([/^\-{0,1}\d+\.{0,1}\d*$/], e) && e.preventDefault(); },
                paste: function(e) { e.preventDefault(); },
                change: function(e) { this.utils.calcFields(this); }
            },
            cost: {
                keypress: function(e) { e.preventDefault(); },
                keydown: function(e) { e.preventDefault(); },
                paste: function(e) { e.preventDefault(); },
                change: function(e) { UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.A003.TITLE, GL.CONST.LOG.ID.A003.GIST); }
            },
            paid: {
                keypress: function(e) { !this.utils.check([/^\d+\.{0,1}\d*$/], e) && e.preventDefault(); },
                paste: function(e) { e.preventDefault(); }
            },
            teln: {
                keypress: function(e) { !this.utils.check([/^\+{0,1}\d+{0,1}\({0,1}\d+\){0,1}[\d\-]*$/], e) && e.preventDefault(); },
                paste: function(e) { e.preventDefault(); },
            },
            rddl: {
                click: function (e) {
                    let roomInput = e.target.parentNode.offsetParent.querySelector('input');
                    roomInput.value = e.target.textContent;
                    roomInput.dispatchEvent(new Event('change'));

                    e.target.parentNode.classList.remove('rooms-drop-down-list-visible');
                }
            }
        };
    }

    bind() {
        // NOTE когда дойду до isStrict то добавить атрибут placeholder=" " для input что бы нормально отображался label
        const T = GL.CONST.LOCALIZABLE.VAR001;
        const B = GL.CONST.LOCALIZABLE.VAR002;
        const O = this.opts;
        const P = GL.CONST.PREFIX.GUEST_CARD;
        let tree =
            [{ tag: 'div' , id: `${P}-${this.id}`, class: `${P} modal modal-wrapper` },
                [{ tag: 'div', class: `${P} modal-content` },
                    [{ tag: 'div', class: `${P} modal-header intent-${O.intent}` },
                        { tag: 'label', textNode: `${O.title}` }
                    ],
                    [{ tag: 'div', class: `${P} modal-body` },
                        [{ tag: 'div', class: 'row' },
                            [{ tag: 'div', id: `${P}-el-${IGuest.unid}`, class: `${P}-el output`, style: { display: 'none;' } },
                                { tag: 'input', type: 'text', readonly: true },
                                { tag: 'label', textNode: `${T.UNID}` }
                            ],
                            [{ tag: 'div', id: `${P}-el-${IGuest.dbeg}`, class: `${P}-el input` },
                                {
                                    tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict ,
                                    events: [
                                    { name: 'keypress', fn: this.cb.control.dbeg.keypress.bind(this) },
                                    { name: 'paste', fn: this.cb.control.dbeg.paste },
                                    { name: 'change', fn: this.cb.control.dbeg.change.bind(this) }
                                    ]
                                },
                                { tag: 'label', textNode: `${T.DBEG}` }
                            ],
                            [{ tag: 'div', id: `${P}-el-${IGuest.dend}`, class: `${P}-el input` },
                                {
                                    tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict,
                                    events: [
                                        { name: 'keypress', fn: this.cb.control.dend.keypress.bind(this) },
                                        { name: 'paste', fn: this.cb.control.dend.paste },
                                        { name: 'change', fn: this.cb.control.dend.change.bind(this) }
                                    ]
                                },
                                { tag: 'label', textNode: `${T.DEND}` }
                            ],
                            [{ tag: 'div', id: `${P}-el-${IGuest.days}`, class: `${P}-el output` },
                                {
                                    tag: 'input', type: 'text',
                                    events: [
                                        { name: 'keypress', fn: this.cb.control.days.keypress },
                                        { name: 'keydown', fn: this.cb.control.days.keydown },
                                        { name: 'paste', fn: this.cb.control.days.paste },
                                        { name: 'change', fn: this.cb.control.days.change.bind(this) }
                                    ]
                                },
                                { tag: 'label', textNode: `${T.DAYS}` }
                            ],
                        ],
                        [{ tag: 'div', class: 'row' },
                            [{ tag: 'div', id: `${P}-el-${IGuest.room}`, class: `${P}-el output` },
                                {
                                    tag: 'input', type: 'text', required: O.isStrict,
                                    events: [
                                        { name: 'keypress', fn: this.cb.control.room.keypress },
                                        { name: 'keydown', fn: this.cb.control.days.keydown },
                                        { name: 'paste', fn: this.cb.control.room.paste },
                                        { name: 'change', fn: this.cb.control.room.change.bind(this) },
                                        { name: 'click', fn: this.cb.control.room.click }
                                    ]
                                },
                                { tag: 'label', textNode: `${T.ROOM}` },
                                { tag: 'div', id: 'rooms-drop-down-list', class: 'rooms-drop-down-list', events: [{ name: 'click', fn: this.cb.control.rddl.click }] }
                            ],
                            [{ tag: 'div', id: `${P}-el-${IGuest.base}`, class: `${P}-el output` },
                                {
                                    tag: 'input', type: 'text', required: O.isStrict,
                                    events: [
                                        { name: 'keypress', fn: this.cb.control.base.keypress },
                                        { name: 'keydown', fn: this.cb.control.days.keydown },
                                        { name: 'paste', fn: this.cb.control.base.paste },
                                        { name: 'change', fn: this.cb.control.base.change.bind(this) }
                                    ]
                                },
                                { tag: 'label', textNode: `${T.BASE}` }
                            ],
                            [{ tag: 'div', id: `${P}-el-${IGuest.adjs}`, class: `${P}-el input` },
                                {
                                    tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict,
                                    events: [
                                        { name: 'keypress', fn: this.cb.control.adjs.keypress.bind(this) },
                                        { name: 'paste', fn: this.cb.control.adjs.paste },
                                        { name: 'change', fn: this.cb.control.adjs.change.bind(this) }
                                    ]
                                },
                                { tag: 'label', textNode: `${T.ADJS}` }
                            ],
                            [{ tag: 'div', id: `${P}-el-${IGuest.cost}`, class: `${P}-el output` },
                                {
                                    tag: 'input', type: 'text', required: O.isStrict,
                                    events: [
                                        { name: 'keypress', fn: this.cb.control.cost.keypress },
                                        { name: 'keydown', fn: this.cb.control.days.keydown },
                                        { name: 'paste', fn: this.cb.control.cost.paste },
                                        { name: 'change', fn: this.cb.control.cost.change.bind(this) }
                                    ]
                                },
                                { tag: 'label', textNode: `${T.COST}` }
                            ],
                            [{ tag: 'div', id: `${P}-el-${IGuest.paid}`, class: `${P}-el input` },
                                {
                                    tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict,
                                    events: [
                                        { name: 'keypress', fn: this.cb.control.paid.keypress.bind(this) },
                                        { name: 'paste', fn: this.cb.control.paid.paste }
                                    ]
                                },
                                { tag: 'label', textNode: `${T.PAID}` }
                            ],
                        ],
                        [{ tag: 'div', class: 'row' },
                            [{ tag: 'div', id: `${P}-el-${IGuest.name}`, class: `${P}-el input` },
                                { tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict },
                                { tag: 'label', textNode: `${T.NAME}` }
                            ],
                        ],
                        [{ tag: 'div', class: 'row' },
                            [{ tag: 'div', id: `${P}-el-${IGuest.city}`, class: `${P}-el input` },
                                { tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict },
                                { tag: 'label', textNode: `${T.CITY}` }
                            ],
                        ],
                        [{ tag: 'div', class: 'row' },
                            [{ tag: 'div', id: `${P}-el-${IGuest.teln}`, class: `${P}-el input` },
                                {
                                    tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict,
                                    events: [
                                        { name: 'keypress', fn: this.cb.control.teln.keypress.bind(this) },
                                        { name: 'paste', fn: this.cb.control.teln.paste }
                                    ]
                                },
                                { tag: 'label', textNode: `${T.TELN}` }
                            ],
                        ],
                        [{ tag: 'div', class: 'row' },
                            [{ tag: 'div', id: `${P}-el-${IGuest.fnot}`, class: `${P}-el input` },
                                { tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict, },
                                { tag: 'label', textNode: `${T.FNOT}` }
                            ],
                        ],
                    ],
                    [{ tag: 'div', class: `${P} modal-footer` },
                        { tag: 'button', class: 'button negative', type: 'button', textNode: B.NO, events: [{ name: 'click', fn: this.cb.command.no, bind: this }] },
                        { tag: 'button', class: 'button positive', type: 'button', textNode: B.OK, events: [{ name: 'click', fn: this.cb.command.ok, bind: this }] },
                    ],
                ]
            ];

        tree = new DOMTree(tree).cultivate();
        if (!tree) {
            UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A001.TITLE, GL.CONST.LOG.ID.A001.GIST);
            return;
        }
        let rddl = tree.querySelector('#rooms-drop-down-list');
        O.rooms.forEach(el => {
            let a = document.createElement('a');
            a.appendChild(document.createTextNode(el.room));
            rddl.appendChild(a);
        });
        document.body.appendChild(tree);
    }

    setVal(guest) {
        if (guest === undefined) {
            UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A000.TITLE, GL.CONST.LOG.ID.A000.GIST);
            return;
        }
        const P = GL.CONST.PREFIX.GUEST_CARD;
        let dialog = document.getElementById(`${P}-${this.id}`);
        dialog.querySelector(`#${P}-el-${IGuest.unid} input`).value = guest.unid;
        dialog.querySelector(`#${P}-el-${IGuest.dbeg} input`).value = new Date(guest.dbeg.toString()).format('dd.mm.yyyy');
        dialog.querySelector(`#${P}-el-${IGuest.dend} input`).value = new Date(guest.dend.toString()).format('dd.mm.yyyy');
        dialog.querySelector(`#${P}-el-${IGuest.room} input`).value = guest.room;
        dialog.querySelector(`#${P}-el-${IGuest.base} input`).value = guest.base;
        dialog.querySelector(`#${P}-el-${IGuest.adjs} input`).value = guest.adjs;
        dialog.querySelector(`#${P}-el-${IGuest.cost} input`).value = guest.cost;
        dialog.querySelector(`#${P}-el-${IGuest.paid} input`).value = guest.paid;
        dialog.querySelector(`#${P}-el-${IGuest.name} input`).value = guest.name;
        dialog.querySelector(`#${P}-el-${IGuest.city} input`).value = guest.city;
        dialog.querySelector(`#${P}-el-${IGuest.teln} input`).value = guest.teln;
        dialog.querySelector(`#${P}-el-${IGuest.fnot} input`).value = guest.fnot;

        document.querySelector(`#${P}-el-${IGuest.dbeg} input`).dispatchEvent(new Event('change'));
        document.querySelector(`#${P}-el-${IGuest.days} input`).dispatchEvent(new Event('change'));
        document.querySelector(`#${P}-el-${IGuest.room} input`).dispatchEvent(new Event('change'));
    }

    getPromise() { return super.getPromise(); }

    show() {
        let dialog = document.getElementById(`${GL.CONST.PREFIX.GUEST_CARD}-${this.id}`);
        dialog.classList.add('modal-wrapper-visible');
    }

    getVal() {
        const P = GL.CONST.PREFIX.GUEST_CARD;
        let dialog = document.getElementById(`${GL.CONST.PREFIX.GUEST_CARD}-${this.id}`);
        let guest = new Guest();
        guest.unid = dialog.querySelector(`#${P}-el-${IGuest.unid} input`).value;
        guest.dbeg = dialog.querySelector(`#${P}-el-${IGuest.dbeg} input`).value;
        guest.dend = dialog.querySelector(`#${P}-el-${IGuest.dend} input`).value;
        guest.days = dialog.querySelector(`#${P}-el-${IGuest.days} input`).value;
        guest.room = dialog.querySelector(`#${P}-el-${IGuest.room} input`).value;
        guest.base = dialog.querySelector(`#${P}-el-${IGuest.base} input`).value;
        guest.adjs = dialog.querySelector(`#${P}-el-${IGuest.adjs} input`).value;
        guest.cost = dialog.querySelector(`#${P}-el-${IGuest.cost} input`).value;
        guest.paid = dialog.querySelector(`#${P}-el-${IGuest.paid} input`).value;
        guest.name = dialog.querySelector(`#${P}-el-${IGuest.name} input`).value;
        guest.city = dialog.querySelector(`#${P}-el-${IGuest.city} input`).value;
        guest.teln = dialog.querySelector(`#${P}-el-${IGuest.teln} input`).value;
        guest.fnot = dialog.querySelector(`#${P}-el-${IGuest.fnot} input`).value;
        return guest;
    }

    unbind() {
        let dialog = document.getElementById(`${GL.CONST.PREFIX.GUEST_CARD}-${this.id}`);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }
}

class PickPeriod extends Dialog {

    constructor(opts) {
        super(opts);

        this.cb.control.year = {

            keyDown: function (e) {
                if (isNaN(e.key)) e.preventDefault();
                else this.value.length >= 4 && e.preventDefault();
            },

            keyUp: function (e) {
                let val = this.value;
                val.length === 0 && (this.value = 1900);
            },

            prev: function prevYear(e) {
                let id = `${GL.CONST.PREFIX.PICK_PERIOD}-${this.id}-input-year`,
                    year = document.getElementById(id) || 0;
                if (!year) {
                    console.log('ERROR. Year not find in DOM!');
                    return;
                }
                let val = parseInt(year.value);
                val > 1900 && val <= 9999 && (val--, year.value = val);
            },

            next: function nextYear(e) {
                let id = `${GL.CONST.PREFIX.PICK_PERIOD}-${this.id}-input-year`,
                    year = document.getElementById(id) || 0;
                if (!year) {
                    console.log('ERROR. Year not find in DOM!');
                    return;
                }
                let val = parseInt(year.value);
                val >= 0 && val < 9999 && (val++ , year.value = val);
            }
        };

        this.cb.control.month = {

            sel: function monthSel(e) {
                let className = `${GL.CONST.PREFIX.PICK_PERIOD}-month-sel`,
                    sel = document.getElementsByClassName(className);
                for (let i = 0; i < sel.length; i++) {
                    sel[i].classList.remove(className);
                }
                e.target.setAttribute('class', className);
            }
        };
    }

    bind() {

        const B = GL.CONST.LOCALIZABLE.VAR002;
        const P = GL.CONST.PREFIX.PICK_PERIOD;
        let tree =
            [{ tag: 'div', id: `${P}-${this.id}`, class: `${P} modal modal-wrapper`},
                [{ tag: 'div', class: `${P} modal-content` },
                    { tag: 'div', class: `${P} modal-header` },
                    [{ tag: 'div', class: `${P} modal-body` },
                        [{ tag: 'table' },
                            [{ tag: 'thead' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td' },
                                        { tag: 'button', id: `${P}-button-year-prev`, class: 'button', type: 'button', events: [{ name: 'click', fn: this.cb.control.year.prev, bind: this }] }
                                    ],
                                    [{ tag: 'td' },
                                        {
                                            tag: 'input',
                                            id: `${P}-${this.id}-input-year`,
                                            class: `${P}-input-year`,
                                            name: 'year',
                                            type: 'number',
                                            attr: { maxlength: 4, size: 4, min: 1900, max: 9999 },
                                            events: [
                                                { name: 'keydown', fn: this.cb.control.year.keyDown },
                                                { name: 'keyup', fn: this.cb.control.year.keyUp }
                                            ]
                                        }
                                    ],
                                    [{ tag: 'td' },
                                        { tag: 'button', id: `${P}-button-year-next`, class: 'button', type: 'button', events: [{ name: 'click', fn: this.cb.control.year.next, bind: this }] }
                                    ]
                                ]
                            ],
                            [{ tag: 'tbody', events: [{ name: 'click', fn: this.cb.control.month.sel }] },
                                [{ tag: 'tr' },
                                    { tag: 'td', id: `01-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Январь' },
                                    { tag: 'td', id: `02-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Февраль' },
                                    { tag: 'td', id: `03-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Март' },
                                ],
                                [{ tag: 'tr' },
                                    { tag: 'td', id: `04-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Апрель' },
                                    { tag: 'td', id: `05-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Май' },
                                    { tag: 'td', id: `06-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Июнь' },
                                ],
                                [{ tag: 'tr' },
                                    { tag: 'td', id: `07-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Июль' },
                                    { tag: 'td', id: `08-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Август' },
                                    { tag: 'td', id: `09-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Сентябрь' },
                                ],
                                [{ tag: 'tr' },
                                    { tag: 'td', id: `10-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Октябрь' },
                                    { tag: 'td', id: `11-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Ноябрь' },
                                    { tag: 'td', id: `12-month-${P}-${this.id}`, class: `${P}-month`, textNode: 'Декабрь' },
                                ],
                            ],
                        ]
                    ],
                    [{ tag: 'div', class: `${P} modal-footer` },
                        { tag: 'button', class: 'button negative', type: 'button', textNode: B.NO, events: [{ name: 'click', fn: this.cb.command.no, bind: this }] },
                        { tag: 'button', class: 'button positive', type: 'button', textNode: B.OK, events: [{ name: 'click', fn: this.cb.command.ok, bind: this }] },
                    ]
                ]
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) document.body.appendChild(tree);
        else console.log('tree is ' + tree);
    }

    setVal(val) {
        const P = GL.CONST.PREFIX.PICK_PERIOD;
        let year = document.getElementById(`${P}-${this.id}-input-year`) || {},
            month = document.getElementById(`${val.month}-month-${P}-${this.id}`);
        year.value = val.year;
        (month.classList) && month.classList.add(`${P}-month-sel`);
    }

    getPromise() { return super.getPromise(); }

    show() {
        const P = GL.CONST.PREFIX.PICK_PERIOD;
        let pick = document.getElementById(`${P}-${this.id}`);
        pick.style.display = 'block';
    }

    getVal() {
        const P = GL.CONST.PREFIX.PICK_PERIOD;
        let month = document.getElementsByClassName(`${P}-month-sel`)[0];
        return {
            year: document.getElementById(`${P}-${this.id}-input-year`).value,
            month: {
                num: (month.getAttribute('id')).substring(0, 2),
                name: month.textContent
            }
        };
    }

    unbind() {
        let pick = document.getElementById(`${ GL.CONST.PREFIX.PICK_PERIOD}-${this.id}`);
        pick.style.display = 'none';
        pick.parentNode.removeChild(pick);
    }
}

class RCMenu extends Dialog {

    constructor (opts) {
        super(opts);

        this.cb.command.upd = function upd(e) {
            this.unbind();
            EVENT_BUS.dispatch(GL.CONST.EVENTS.JOURNAL.RC_MENU.UPD, this.opts.guest);
        };

        this.cb.command.del = function del(e) {
            this.unbind();
            EVENT_BUS.dispatch(GL.CONST.EVENTS.JOURNAL.RC_MENU.DEL, this.opts.guest);
        };

        this.cb.command.add = function add(e) {
            this.unbind();
            EVENT_BUS.dispatch(GL.CONST.EVENTS.JOURNAL.RC_MENU.ADD, this.opts.guest);
        };

        this.cb.command.lmc = function lmc(e) {
            this.unbind();
        };
    }

    bind() {

        // TODO переделать на динамическое создание меню по входным параметрам
        const T = GL.CONST.LOCALIZABLE.VAR003;
        let div, ul, li;

        ul = document.createElement('ul');
        ul.setAttribute('id', 'rcmenu-list');

        if (this.opts.item.upd) {
            li = document.createElement('li');
            li.setAttribute('id', 'editGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode(T.UPDATE));
            li.addEventListener('click', this.cb.command.upd.bind(this));
            ul.appendChild(li);
        }
        if (this.opts.item.del) {
            li = document.createElement('li');
            li.setAttribute('id', 'delGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode(T.DELETE));
            li.addEventListener('click', this.cb.command.del.bind(this));
            ul.appendChild(li);
        }
        if (this.opts.item.add) {
            li = document.createElement('li');
            li.setAttribute('id', 'addGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode(T.ADD));
            li.addEventListener('click', this.cb.command.add.bind(this));
            ul.appendChild(li);
        }

        div = document.createElement('div');
        div.setAttribute('id', 'rcmenu');
        div.appendChild(ul);
        document.body.appendChild(div);

        EVENT_BUS.register(GL.CONST.EVENTS.CORE.LEFT_CLICK, this.cb.command.lmc.bind(this));
    }

    setVal () {}

    getPromise() { return super.getPromise(); }

    show () {
        let rcmenu = document.getElementById('rcmenu');
        rcmenu.style.left = `${this.opts.x}px`;
        rcmenu.style.top = `${this.opts.y}px`;
        rcmenu.style.display = 'block';
    }

    getVal () {}

    unbind () {
        let rcmenu = document.getElementById('rcmenu');
        if (rcmenu != undefined) {
            rcmenu.style.display = 'none';
            rcmenu.parentNode.removeChild(rcmenu);
        }
    }
}