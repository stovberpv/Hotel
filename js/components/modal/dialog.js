/*jshint esversion: 6 */
/*jshint -W030 */
'use strict';

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
                    this._promise.resolve(val);
                },
                no: function () {
                    this.unbind();
                    this._promise.reject();
                }
            }
        };

        this._promise = {
            resolve: null,
            reject: null
        };
    }

    bind() {}
    setVal() {}
    promise() {
        var self = this;
        return new Promise((resolve, reject) => { self._promise.resolve = resolve; self._promise.reject = reject; });
    }
    show() {}
    getVal() {}
    unbind() {}
}

class ConfirmDialog extends Dialog {

    constructor(opts) {
        super(opts);

        return this;
    }

    bind() {

        const B = GL.CONST.LOCALIZABLE.VAR002;
        const O = this.opts;
        let tree =
            [{ tag: 'div', id: `confirm-dialog-${this.id}`, class: `confirm-dialog modal modal-wrapper` },
                [{ tag: 'div', class: `confirm-dialog modal-content` },
                    [{ tag: 'div', class: `confirm-dialog modal-header intent-${O.intent}` },
                        { tag: 'label', textNode: O.title }
                    ],
                    [{ tag: 'div', class: `confirm-dialog modal-body` },
                        { tag: 'label', textNode: O.text }
                    ],
                    [{ tag: 'div', class: `confirm-dialog modal-footer` },
                        { tag: 'button', class: 'button negative', type: 'button', textNode: B.NO, events: [{ name: 'click', fn: this.cb.command.no, bind: this }] },
                        { tag: 'button', class: 'button positive', type: 'button', textNode: B.OK, events: [{ name: 'click', fn: this.cb.command.ok, bind: this }] },
                    ]
                ]
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) document.body.appendChild(tree);
        else console.log('tree is ' + tree);

        return this;
    }

    setVal() {  }

    promise() { return super.promise(); }

    show() {
        document.getElementById(`confirm-dialog-${this.id}`).classList.add('visible');
        return this;
    }

    getVal() { return true; }

    unbind() {
        let dialog = document.getElementById(`confirm-dialog-${this.id}`);
        dialog.classList.remove('visible');
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

            flipDate: function(date) {
                if (/^\d{4}.\d{2}.\d{2}$/.test(date)) return (function reverse(y,m,d) { return `${d}.${m}.${y}`; })(...date.split('.'));
                if (/^\d{2}.\d{2}.\d{4}$/.test(date)) return (function reverse(d,m,y) { return `${y}-${m}-${d}`; })(...date.split('.'));
            },

            calcFields: function (self) {

                let field = new GL001().field;

                let dialog = document.getElementById(`guest-card-${self.id}`),
                    dbeg = dialog.querySelector(`#guest-card-el-${field.dbeg} input`).value,
                    dend = dialog.querySelector(`#guest-card-el-${field.dend} input`).value,
                    days = dialog.querySelector(`#guest-card-el-${field.days} input`),
                    room = dialog.querySelector(`#guest-card-el-${field.room} input`).value,
                    base = dialog.querySelector(`#guest-card-el-${field.base} input`).value,
                    adjs = dialog.querySelector(`#guest-card-el-${field.adjs} input`).value,
                    cost = dialog.querySelector(`#guest-card-el-${field.cost} input`);

                let begda = new Date(self.utils.flipDate(dbeg)),
                    endda = new Date(self.utils.flipDate(dend));

                let totalDays = ((endda - begda) / 86400000) + 1;

                let rooms = self.opts.rooms.filter(function (el) { return el.room == room; });
                base = base ? parseFloat(base) : parseFloat(rooms[0].base);

                let mustBePaid = (base + (parseFloat(adjs) || 0)) * totalDays;

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
                    let self = this,
                        field = new GL001().field;

                    let dialog = document.getElementById(`guest-card-${this.id}`),
                        dbeg = dialog.querySelector(`#guest-card-el-${field.dbeg} input`).value,
                        dend = dialog.querySelector(`#guest-card-el-${field.dend} input`).value;

                    if (!dbeg || !dend) {
                        UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A001.TITLE, GL.CONST.LOG.ID.A001.GIST);
                        return;
                    }

                    let begda = new Date(self.utils.flipDate(dbeg)),
                        endda = new Date(self.utils.flipDate(dend));
                    dialog.querySelector(`#guest-card-el-${field.days} input`).value = ((endda - begda) / 86400000) + 1;

                    e.preventDefault();
                }
            },
            room: {
                keypress: function(e) { e.preventDefault(); },
                keydown: function(e) { e.preventDefault(); },
                click: function(e) { e.target.parentNode.querySelector('#rooms-list').classList.toggle('visible'); },
                paste: function(e) { e.preventDefault(); },
                change: function (e) {
                    let field = new GL001().field,
                        dialog = document.getElementById(`guest-card-${this.id}`),
                        room = this.opts.rooms.filter(function (el) { return el.room == e.target.value; }),
                        baseline = dialog.querySelector(`#guest-card-el-${field.base} input`);

                    baseline.value = room.length !== 0 ? room[0].base : 0;
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
                keypress: function(e) { !this.utils.check([/^\+{0,1}\d{0,1}\({0,1}\d+\){0,1}[\d\-]*$/], e) && e.preventDefault(); },
                paste: function(e) { e.preventDefault(); },
            },
            rddl: {
                click: function (e) {
                    let roomInput = e.target.parentNode.offsetParent.querySelector('input');
                    roomInput.value = e.target.textContent;
                    roomInput.dispatchEvent(new Event('change'));

                    e.target.parentNode.classList.remove('visible');
                }
            }
        };
    }

    bind() {
        // NOTE когда дойду до isStrict то добавить атрибут placeholder=" " для input что бы нормально отображался label
        const T = GL.CONST.LOCALIZABLE.VAR001;
        const B = GL.CONST.LOCALIZABLE.VAR002;
        const O = this.opts;
        let field = new GL001().field;
        let tree =
            [{ tag: 'div' , id: `guest-card-${this.id}`, class: `guest-card modal modal-wrapper` },
                [{ tag: 'div', class: `guest-card modal-content` },
                    [{ tag: 'div', class: `guest-card modal-header intent-${O.intent}` },
                        { tag: 'label', textNode: `${O.title}` }
                    ],
                    [{ tag: 'div', class: `guest-card modal-body` },
                        [{ tag: 'div', class: 'row' },
                            [{ tag: 'div', id: `guest-card-el-${field.unid}`, class: `guest-card-el output`, style: { display: 'none;' } },
                                { tag: 'input', type: 'text', readonly: true },
                                { tag: 'label', textNode: `${T.UNID}` }
                            ],
                            [{ tag: 'div', id: `guest-card-el-${field.dbeg}`, class: `guest-card-el input` },
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
                            [{ tag: 'div', id: `guest-card-el-${field.dend}`, class: `guest-card-el input` },
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
                            [{ tag: 'div', id: `guest-card-el-${field.days}`, class: `guest-card-el output` },
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
                            [{ tag: 'div', id: `guest-card-el-${field.room}`, class: `guest-card-el output` },
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
                                { tag: 'div', id: 'rooms-list', class: 'drop-down-list', events: [{ name: 'click', fn: this.cb.control.rddl.click }] }
                            ],
                            [{ tag: 'div', id: `guest-card-el-${field.base}`, class: `guest-card-el output` },
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
                            [{ tag: 'div', id: `guest-card-el-${field.adjs}`, class: `guest-card-el input` },
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
                            [{ tag: 'div', id: `guest-card-el-${field.cost}`, class: `guest-card-el output` },
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
                            [{ tag: 'div', id: `guest-card-el-${field.paid}`, class: `guest-card-el input` },
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
                            [{ tag: 'div', id: `guest-card-el-${field.name}`, class: `guest-card-el input` },
                                { tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict },
                                { tag: 'label', textNode: `${T.NAME}` }
                            ],
                        ],
                        [{ tag: 'div', class: 'row' },
                            [{ tag: 'div', id: `guest-card-el-${field.city}`, class: `guest-card-el input` },
                                { tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict },
                                { tag: 'label', textNode: `${T.CITY}` }
                            ],
                        ],
                        [{ tag: 'div', class: 'row' },
                            [{ tag: 'div', id: `guest-card-el-${field.teln}`, class: `guest-card-el input` },
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
                            [{ tag: 'div', id: `guest-card-el-${field.fnot}`, class: `guest-card-el input` },
                                { tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict, },
                                { tag: 'label', textNode: `${T.FNOT}` }
                            ],
                        ],
                    ],
                    [{ tag: 'div', class: `guest-card modal-footer` },
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
        let rddl = tree.querySelector('#rooms-list');
        O.rooms.forEach(el => {
            let a = document.createElement('a');
            a.appendChild(document.createTextNode(el.room));
            rddl.appendChild(a);
        });
        document.body.appendChild(tree);

        return this;
    }

    setVal(guest) {
        if (guest === undefined) {
            UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A000.TITLE, GL.CONST.LOG.ID.A000.GIST);
            return;
        }
        let field = new GL001().field,
            dialog = document.getElementById(`guest-card-${this.id}`);
        dialog.querySelector(`#guest-card-el-${field.unid} input`).value = guest.unid;
        dialog.querySelector(`#guest-card-el-${field.dbeg} input`).value = new Date(guest.dbeg).format('dd.mm.yyyy');
        dialog.querySelector(`#guest-card-el-${field.dend} input`).value = new Date(guest.dend).format('dd.mm.yyyy');
        dialog.querySelector(`#guest-card-el-${field.room} input`).value = guest.room;
        dialog.querySelector(`#guest-card-el-${field.base} input`).value = guest.base;
        dialog.querySelector(`#guest-card-el-${field.adjs} input`).value = guest.adjs;
        dialog.querySelector(`#guest-card-el-${field.cost} input`).value = guest.cost;
        dialog.querySelector(`#guest-card-el-${field.paid} input`).value = guest.paid;
        dialog.querySelector(`#guest-card-el-${field.name} input`).value = guest.name;
        dialog.querySelector(`#guest-card-el-${field.city} input`).value = guest.city;
        dialog.querySelector(`#guest-card-el-${field.teln} input`).value = guest.teln;
        dialog.querySelector(`#guest-card-el-${field.fnot} input`).value = guest.fnot;

        document.querySelector(`#guest-card-el-${field.dbeg} input`).dispatchEvent(new Event('change'));
        document.querySelector(`#guest-card-el-${field.days} input`).dispatchEvent(new Event('change'));
        document.querySelector(`#guest-card-el-${field.room} input`).dispatchEvent(new Event('change'));

        return this;
    }

    promise() { return super.promise(); }

    show() {
        let dialog = document.getElementById(`guest-card-${this.id}`);
        dialog.classList.add('visible');

        return this;
    }

    getVal() {
        let field = new GL001().field,
            dialog = document.getElementById(`guest-card-${this.id}`),
            guest = new Guest();
        guest.unid = dialog.querySelector(`#guest-card-el-${field.unid} input`).value;
        guest.dbeg = dialog.querySelector(`#guest-card-el-${field.dbeg} input`).value;
        guest.dend = dialog.querySelector(`#guest-card-el-${field.dend} input`).value;
        guest.days = dialog.querySelector(`#guest-card-el-${field.days} input`).value;
        guest.room = dialog.querySelector(`#guest-card-el-${field.room} input`).value;
        guest.base = dialog.querySelector(`#guest-card-el-${field.base} input`).value;
        guest.adjs = dialog.querySelector(`#guest-card-el-${field.adjs} input`).value;
        guest.cost = dialog.querySelector(`#guest-card-el-${field.cost} input`).value;
        guest.paid = dialog.querySelector(`#guest-card-el-${field.paid} input`).value;
        guest.name = dialog.querySelector(`#guest-card-el-${field.name} input`).value;
        guest.city = dialog.querySelector(`#guest-card-el-${field.city} input`).value;
        guest.teln = dialog.querySelector(`#guest-card-el-${field.teln} input`).value;
        guest.fnot = dialog.querySelector(`#guest-card-el-${field.fnot} input`).value;

        guest.dbeg = this.utils.flipDate(guest.dbeg);
        guest.dend = this.utils.flipDate(guest.dend);
        return guest;
    }

    unbind() {
        let dialog = document.getElementById(`guest-card-${this.id}`);
        dialog.classList.remove('visible');
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
                let year = document.getElementById(`pick-period-${this.id}-input-year`) || 0,
                    val = parseInt(year.value);
                val > 1900 && val <= 9999 && (val--, year.value = val);
            },

            next: function nextYear(e) {
                let year = document.getElementById(`pick-period-${this.id}-input-year`) || 0,
                    val = parseInt(year.value);
                val >= 0 && val < 9999 && (val++ , year.value = val);
            }
        };

        this.cb.control.month = {

            sel: function monthSel(e) {
                document.querySelector(`#pick-period-${this.id} tbody .selected`).classList.remove('selected');
                e.target.classList.add('selected');
            }
        };

        return this;
    }

    bind() {

        const B = GL.CONST.LOCALIZABLE.VAR002;
        let tree =
            [{ tag: 'div', id: `pick-period-${this.id}`, class: `pick-period modal modal-wrapper`},
                [{ tag: 'div', class: `modal-content` },
                    { tag: 'div', class: `modal-header` },
                    [{ tag: 'div', class: `modal-body` },
                        [{ tag: 'table' },
                            [{ tag: 'thead' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td' },
                                        { tag: 'button', class: 'button prev', type: 'button', events: [{ name: 'click', fn: this.cb.control.year.prev, bind: this }] }
                                    ],
                                    [{ tag: 'td' },
                                        {
                                            tag: 'input',
                                            class: `year`,
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
                                        { tag: 'button', class: 'button next', type: 'button', events: [{ name: 'click', fn: this.cb.control.year.next, bind: this }] }
                                    ]
                                ]
                            ],
                            [{ tag: 'tbody', events: [{ name: 'click', fn: this.cb.control.month.sel }] },
                                [{ tag: 'tr' },
                                    { tag: 'td', id: `month-01`, class: `month`, textNode: 'Январь', attr: { 'data-id': '01' } },
                                    { tag: 'td', id: `month-02`, class: `month`, textNode: 'Февраль', attr: { 'data-id': '02' } },
                                    { tag: 'td', id: `month-03`, class: `month`, textNode: 'Март', attr: { 'data-id': '03' } },
                                ],
                                [{ tag: 'tr' },
                                    { tag: 'td', id: `month-04`, class: `month`, textNode: 'Апрель', attr: { 'data-id': '04' } },
                                    { tag: 'td', id: `month-05`, class: `month`, textNode: 'Май', attr: { 'data-id': '05' } },
                                    { tag: 'td', id: `month-06`, class: `month`, textNode: 'Июнь', attr: { 'data-id': '06' } },
                                ],
                                [{ tag: 'tr' },
                                    { tag: 'td', id: `month-07`, class: `month`, textNode: 'Июль', attr: { 'data-id': '07' } },
                                    { tag: 'td', id: `month-08`, class: `month`, textNode: 'Август', attr: { 'data-id': '08' } },
                                    { tag: 'td', id: `month-09`, class: `month`, textNode: 'Сентябрь', attr: { 'data-id': '09' } },
                                ],
                                [{ tag: 'tr' },
                                    { tag: 'td', id: `month-10`, class: `month`, textNode: 'Октябрь', attr: { 'data-id': '10' } },
                                    { tag: 'td', id: `month-11`, class: `month`, textNode: 'Ноябрь', attr: { 'data-id': '11' } },
                                    { tag: 'td', id: `month-12`, class: `month`, textNode: 'Декабрь', attr: { 'data-id': '12' } },
                                ],
                            ],
                        ]
                    ],
                    [{ tag: 'div', class: `modal-footer` },
                        { tag: 'button', class: 'button negative', type: 'button', textNode: B.NO, events: [{ name: 'click', fn: this.cb.command.no, bind: this }] },
                        { tag: 'button', class: 'button positive', type: 'button', textNode: B.OK, events: [{ name: 'click', fn: this.cb.command.ok, bind: this }] },
                    ]
                ]
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) document.body.appendChild(tree);
        else console.log('tree is ' + tree);

        return this;
    }

    setVal(val) {
        let dialog = document.getElementById(`pick-period-${this.id}`), // DEBUG 
            year = dialog.querySelector('td .year'),
            month = dialog.querySelector(`td[data-id='${val.month}']`);
        year.value = val.year;
        (month.classList) && month.classList.add('selected');

        return this;
    }

    promise() { return super.promise(); }

    show() {
        document.getElementById(`pick-period-${this.id}`).classList.add('visible');
    }

    getVal() {
        let dialog = document.getElementById(`pick-period-${this.id}`),
            month = dialog.querySelector(`td.selected`);
        return {
            year: dialog.querySelector('td.year').value,
            month: {
                num: month.dataset.id,
                name: month.textContent
            }
        };
    }

    unbind() {
        let dialog = document.getElementById(`pick-period-${this.id}`);
        dialog.classList.remove('visible');
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

        (() => {
            let rcmenu = document.getElementById('rcmenu');
            if (!rcmenu) return;
            rcmenu.parentNode.removeChild(rcmenu);
        })();

        return this;
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

        return this;
    }

    setVal () {}

    promise() { return super.promise(); }

    show () {
        let rcmenu = document.getElementById('rcmenu');
        rcmenu.style.left = `${this.opts.x}px`;
        rcmenu.style.top = `${this.opts.y}px`;
        rcmenu.classList.add('visible');
    }

    getVal () {}

    unbind () {
        let rcmenu = document.getElementById('rcmenu');
        if (rcmenu) {
            rcmenu.classList.remove('visible')
            rcmenu.parentNode.removeChild(rcmenu);
        }
    }
}