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
                ok: function () { },
                no: function () { }
            }
        };
    }

    bind() {}
    setVal() {}
    show() {}
    getVal() {}
    unbind() {}
}

class ConfirmDialog extends Dialog {

    constructor(opts) {
        super(opts);
    
        this.cb.command.ok = function (e) {
            this.unbind();
            this.opts.cb.ok({ intent: this.opts.intent, guest: this.opts.data.guest });
        };
                
        this.cb.command.no = function (e) {
            this.unbind();
        };
    }

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

    show() {
        const P = GL.CONST.PREFIX.CONFIRM_DIALOG;
        let dialog = document.getElementById(`${P}-${this.id}`);
        dialog.style.display = 'block';
    }

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

        this.cb.command.ok = function (e) {
            EVENT_BUS.dispatch(GL.CONST.EVENTS.JOURNAL.DIALOG_SAVE, { intent: this.opts.intent, guest: this.getVal() } );
            this.unbind();
        };

        this.cb.command.no = function (e) {
            this.unbind();
        };

        this.utils = { //new function () { }();
            checkDate: function (value, key) {

                let allowedChars = '0123456789.',
                    dot = '.',
                    strlen = value.length,
                    dotIndex = value.indexOf('.'),
                    newValue = value.toString().concat(key);
    
                // только цифры и точка
                if (allowedChars.indexOf(key) === -1) return false;
                // точка не должна быть первой
                // не более двух точек
                // точка не может быть на 3 позиции
                if (key === dot) {
                    if (strlen === 0) return false;
                    if (strlen > 2) return false;
                    if (dotIndex !== -1) return false;
                    if (value === 0) return false;
                }
                // не более 5 символов (dd.mm)
                if (strlen > 4) return false;
                // не более 2 цифр подряд
                if (strlen > 1 && (key !== dot && dotIndex === -1)) return false;
                // день не больше 31 числа
                if (strlen === 1 && parseInt(newValue) > 31) return false;
                // месяц на старше 12
                if (dotIndex !== -1) {
                    let date = newValue.substring(dotIndex + 1);
                    if (date > 12) return false;
                }
                // корректная дата по календарю
    
                //
                return true;
            },

            calcFields: function (self) {

                const O = self.opts;
                const P = GL.CONST.PREFIX.GUEST_CARD;

                let dialog = document.getElementById(`${P}-${self.id}`),
                    dbeg = dialog.querySelector(`#${P}-el-${IGuest.Dbeg} input`),
                    dend = dialog.querySelector(`#${P}-el-${IGuest.Dend} input`),
                    days = dialog.querySelector(`#${P}-el-${IGuest.Days} input`),
                    room = dialog.querySelector(`#${P}-el-${IGuest.Room} input`),
                    base = dialog.querySelector(`#${P}-el-${IGuest.Base} input`),
                    adjs = dialog.querySelector(`#${P}-el-${IGuest.Adjs} input`),
                    cost = dialog.querySelector(`#${P}-el-${IGuest.Cost} input`);

                let begda = dbeg.value.split('.'),
                    endda = dend.value.split('.');
                begda = new Date(''.concat(O.year, '.', (begda[1] ? begda[1] : O.month), '.', begda[0]));
                endda = new Date(''.concat(O.year, '.', (endda[1] ? endda[1] : O.month), '.', endda[0]));
                let totalDays = (endda - begda) / GL.CONST.VALUES.UTILS.ONE_DAY;

                let rooms = O.rooms.filter(function (el) { return el.room == room.value; });
                (base.value === 0) && (base.value = rooms[0].price);

                let price = (parseInt(base.value) || 0) + (parseInt(adjs.value) || 0),
                    mustBePaid = price * totalDays;
    
                days.value = totalDays;
                cost.value = mustBePaid;
                cost.dispatchEvent(new Event('change'));
            }
        };

        this.cb.control = {
    
            dbeg: { 
                keypress: function (e) { !this.utils.checkDate(e.target.value, e.key) && e.preventDefault(); }, 
                paste: function(e) { e.preventDefault(); }, 
                change: function(e) { this.utils.calcFields(this); }
            },
            dend: { 
                keypress: function(e) { !this.checkDate(e.target.value, e.key) && e.preventDefault(); }, 
                paste: function(e) { e.preventDefault(); }, 
                change: function(e) { this.utils.calcFields(this); }
            },
            days: { 
                keypress: function (e) { e.preventDefault(); }, 
                paste: function (e) { e.preventDefault(); },
                change: function (e) {
                    const P = GL.CONST.PREFIX.GUEST_CARD;

                    let dialog = document.getElementById(`${P}-${this.id}`),
                        dbeg = dialog.querySelector(`#${P}-el-${IGuest.Dbeg} input`),
                        dend = dialog.querySelector(`#${P}-el-${IGuest.Dend} input`);
                    
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
                    dialog.querySelector(`#${P}-el-${IGuest.Days} input`).value = ((lastDay - firstDay) / oneDay) + 1;
                    
                    e.preventDefault();

                    function buildDate(year, ddmm) {
                        let period = ddmm.split('.');
                        return new Date(`${year}.${period[1]}.${period[0]}`);
                    }
                }
            },
            room: { 
                keypress: function(e) { e.preventDefault(); }, 
                click: function(e) { e.target.parentNode.querySelector('#rooms-drop-down-list').style.display = 'block'; }, 
                paste: function(e) { e.preventDefault(); }, 
                change: function (e) {
                    const P = GL.CONST.PREFIX.GUEST_CARD;

                    let dialog = document.getElementById(`${P}-${this.id}`),
                        room = this.opts.rooms.filter(function (el) { return el.room == e.target.value; }),
                        baseline = dialog.querySelector(`#${P}-el-${IGuest.Base} input`);
                    
                    baseline.value = room.length !== 0 ? room[0].price : 0;
                    baseline.dispatchEvent(new Event('change'));
                }
            },
            base: { 
                keypress: function(e) { e.preventDefault(); }, 
                paste: function(e) { e.preventDefault(); }, 
                change: function(e) { this.utils.calcFields(this); }
            },
            adjs: { 
                keypress: function(e) {
                    let allowedChars = '-0123456789',
                        strlen = e.target.value.length;
                    if (e.key == '-') {
                        if (e.target.value.indexOf('-') !== -1) { e.preventDefault(); return; }
                        if (e.target.value.length !== 0) { e.preventDefault(); return; }
                    }
                    if (allowedChars.indexOf(e.key) === -1) { e.preventDefault(); return; }
                    if (strlen > 5) { e.preventDefault(); }
                }, 
                paste: function(e) { e.preventDefault(); }, 
                change: function(e) { this.utils.calcFields(this); }
            },
            cost: { 
                keypress: function(e) { e.preventDefault(); }, 
                paste: function(e) { e.preventDefault(); }, 
                change: function(e) { UTILS.LOG(GL.CONST.LOG.LEVEL.INFO, GL.CONST.LOG.ID.A003.TITLE, GL.CONST.LOG.ID.A003.GIST); }
            },
            paid: { 
                keypress: function(e) {
                    let allowedChars = '0123456789',
                        strlen = e.target.value.length;

                    if (allowedChars.indexOf(e.key) === -1) { e.preventDefault(); return; }
                    if (strlen > 4) { e.preventDefault(); }
                }, 
                paste: function(e) { e.preventDefault(); }
            },
            teln: { 
                keypress: function(e) {
                    let allowedChars = '+-() 0123456789',
                    strlen = e.target.value.length;

                    if (allowedChars.indexOf(e.key) === -1) {
                        e.preventDefault();
                        return;
                    }
                    if (strlen > 16) {
                        e.preventDefault();

                    }
                }, 
                paste: function(e) { e.preventDefault(); }, 
            },
            rddl: {
                click: function (e) {
                    let roomInput = e.target.parentNode.offsetParent.querySelector('input');
                    roomInput.value = e.target.textContent;
                    roomInput.dispatchEvent(new Event('change'));

                    e.target.parentNode.style.display = 'none';
                }
            }
        };
    }

    bind() {

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
                        [{ tag: 'div', id: `${P}-el-intent`, class: `${P}-el output`, style: { display: 'none;' } },
                            { tag: 'input', type: 'text', readonly: true },
                            { tag: 'label', textNode: `${O.intent}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Unid}`, class: `${P}-el output`, style: { display: 'none;' } },
                            { tag: 'input', type: 'text', readonly: true },
                            { tag: 'label', textNode: `${T.UNID}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Dbeg}`, class: `${P}-el input` },
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
                        [{ tag: 'div', id: `${P}-el-${IGuest.Dend}`, class: `${P}-el input` },
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
                        [{ tag: 'div', id: `${P}-el-${IGuest.Days}`, class: `${P}-el output` },
                            {
                                tag: 'input', type: 'text',
                                events: [
                                    { name: 'keypress', fn: this.cb.control.days.keypress },
                                    { name: 'paste', fn: this.cb.control.days.paste },
                                    { name: 'change', fn: this.cb.control.days.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${T.DAYS}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Room}`, class: `${P}-el output` },
                            {
                                tag: 'input', type: 'text',
                                events: [
                                    { name: 'keypress', fn: this.cb.control.room.keypress },
                                    { name: 'paste', fn: this.cb.control.room.paste },
                                    { name: 'change', fn: this.cb.control.room.change.bind(this) },
                                    { name: 'click', fn: this.cb.control.room.click }
                                ]
                            },
                            { tag: 'label', textNode: `${T.ROOM}` },
                            { tag: 'div', id: 'rooms-drop-down-list', events: [{ name: 'click', fn: this.cb.control.rddl.click }] }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Base}`, class: `${P}-el output` },
                            {
                                tag: 'input', type: 'text',
                                events: [
                                    { name: 'keypress', fn: this.cb.control.base.keypress },
                                    { name: 'paste', fn: this.cb.control.base.paste },
                                    { name: 'change', fn: this.cb.control.base.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${T.BASE}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Adjs}`, class: `${P}-el input` },
                            {
                                tag: 'input', type: 'text', readonly: O.isReadOnly,
                                events: [
                                    { name: 'keypress', fn: this.cb.control.adjs.keypress },
                                    { name: 'paste', fn: this.cb.control.adjs.paste },
                                    { name: 'change', fn: this.cb.control.adjs.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${T.ADJS}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Cost}`, class: `${P}-el output` },
                            {
                                tag: 'input', type: 'text',
                                events: [
                                    { name: 'keypress', fn: this.cb.control.cost.keypress },
                                    { name: 'paste', fn: this.cb.control.cost.paste },
                                    { name: 'change', fn: this.cb.control.cost.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${T.COST}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Paid}`, class: `${P}-el input` },
                            {
                                tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict,
                                events: [
                                    { name: 'keypress', fn: this.cb.control.paid.keypress },
                                    { name: 'paste', fn: this.cb.control.paid.paste }
                                ]
                            },
                            { tag: 'label', textNode: `${T.PAID}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Name}`, class: `${P}-el input` },
                            { tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict },
                            { tag: 'label', textNode: `${T.NAME}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.City}`, class: `${P}-el input` },
                            { tag: 'input', type: 'text', readonly: O.isReadOnly, required: O.isStrict },
                            { tag: 'label', textNode: `${T.CITY}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Teln}`, class: `${P}-el input` },
                            {
                                tag: 'input', type: 'text', readonly: O.isReadOnly,
                                events: [
                                    { name: 'keypress', fn: this.cb.control.teln.keypress },
                                    { name: 'paste', fn: this.cb.control.teln.paste }
                                ]
                            },
                            { tag: 'label', textNode: `${T.TELN}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${IGuest.Fnot}`, class: `${P}-el input` },
                            { tag: 'input', type: 'text', readonly: O.isReadOnly },
                            { tag: 'label', textNode: `${T.FNOT}` }
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
            UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.B000.TITLE, GL.CONST.LOG.ID.B000.GIST);
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

    show() {
        let dialog = document.getElementById(`${GL.CONST.PREFIX.GUEST_CARD}-${this.id}`);
        dialog.style.display = 'block';
    }

    unbind() {
        let dialog = document.getElementById(`${GL.CONST.PREFIX.GUEST_CARD}-${this.id}`);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }

    setVal(guest) {
        if (guest === undefined) {
            UTILS.LOG(GL.CONST.LOG.LEVEL.ERROR, GL.CONST.LOG.ID.A000.TITLE, GL.CONST.LOG.ID.A000.GIST);
            return;
        }
        const P = GL.CONST.PREFIX.GUEST_CARD;
        let dialog = document.getElementById(`${P}-${this.id}`);
        dialog.querySelector(`#${P}-el-intent input`).value = this.opts.intent;
        dialog.querySelector(`#${P}-el-${IGuest.Unid} input`).value = guest.Unid;
        dialog.querySelector(`#${P}-el-${IGuest.Dbeg} input`).value = new Date(guest.Dbeg).format('dd.mm');
        dialog.querySelector(`#${P}-el-${IGuest.Dend} input`).value = new Date(guest.Dend).format('dd.mm');
        dialog.querySelector(`#${P}-el-${IGuest.Room} input`).value = guest.Room;
        dialog.querySelector(`#${P}-el-${IGuest.Base} input`).value = guest.Base;
        dialog.querySelector(`#${P}-el-${IGuest.Adjs} input`).value = guest.Adjs;
        dialog.querySelector(`#${P}-el-${IGuest.Cost} input`).value = guest.Cost;
        dialog.querySelector(`#${P}-el-${IGuest.Paid} input`).value = guest.Paid;
        dialog.querySelector(`#${P}-el-${IGuest.Name} input`).value = guest.Name;
        dialog.querySelector(`#${P}-el-${IGuest.City} input`).value = guest.City;
        dialog.querySelector(`#${P}-el-${IGuest.Teln} input`).value = guest.Teln;
        dialog.querySelector(`#${P}-el-${IGuest.Fnot} input`).value = guest.Fnot;

        document.querySelector(`#${P}-el-${IGuest.Dbeg} input`).dispatchEvent(new Event('change'));
        document.querySelector(`#${P}-el-${IGuest.Days} input`).dispatchEvent(new Event('change'));
        document.querySelector(`#${P}-el-${IGuest.Room} input`).dispatchEvent(new Event('change'));
    }

    getVal() {
        const P = GL.CONST.PREFIX.GUEST_CARD;
        let dialog = document.getElementById(`${GL.CONST.PREFIX.GUEST_CARD}-${this.id}`);
        let guest = new Guest();
        guest.Year = this.opts.year;
        guest.Mnth = this.opts.month;
        guest.Intn = this.opts.intent;
        guest.Unid = dialog.querySelector(`#${P}-el-${IGuest.Unid} input`).value;
        guest.Dbeg = dialog.querySelector(`#${P}-el-${IGuest.Dbeg} input`).value;
        guest.Dend = dialog.querySelector(`#${P}-el-${IGuest.Dend} input`).value;
        guest.Days = dialog.querySelector(`#${P}-el-${IGuest.Days} input`).value;
        guest.Room = dialog.querySelector(`#${P}-el-${IGuest.Room} input`).value;
        guest.Base = dialog.querySelector(`#${P}-el-${IGuest.Base} input`).value;
        guest.Adjs = dialog.querySelector(`#${P}-el-${IGuest.Adjs} input`).value;
        guest.Cost = dialog.querySelector(`#${P}-el-${IGuest.Cost} input`).value;
        guest.Paid = dialog.querySelector(`#${P}-el-${IGuest.Paid} input`).value;
        guest.Name = dialog.querySelector(`#${P}-el-${IGuest.Name} input`).value;
        guest.City = dialog.querySelector(`#${P}-el-${IGuest.City} input`).value;
        guest.Teln = dialog.querySelector(`#${P}-el-${IGuest.Teln} input`).value;
        guest.Fnot = dialog.querySelector(`#${P}-el-${IGuest.Fnot} input`).value;
        return guest;
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

        this.promise = {
            resolve: null,
            reject: null
        }

        this.cb.command.ok = function ok(e) {
            this.unbind();
            this.promise.resolve(this.getVal());
            // EVENT_BUS.dispatch(GL.CONST.EVENTS.JOURNAL.DIALOG_SAVE, { intent: this.opts.intent, year: val.year, month: val.month.num });
        };
                
        this.cb.command.no = function no(e) {
            this.unbind();
            this.promise.reject();
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

    getPromise() {
        var self = this;
        return new Promise((resolve, reject) => { self.promise.resolve = resolve; self.promise.reject = reject; });
    }

    setVal(val) {
        const P = GL.CONST.PREFIX.PICK_PERIOD;
        let year = document.getElementById(`${P}-${this.id}-input-year`) || {},
            month = document.getElementById(`${val.month}-month-${P}-${this.id}`);
        year.value = val.year;
        (month.classList) && month.classList.add(`${P}-month-sel`);
    }

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
            EVENT_BUS.dispatch(GL.CONST.EVENTS.JOURNAL.RC_MENU.RCM_ITEM_UPD_GUEST, this.opts.guest);
        };

        this.cb.command.del = function del(e) {
            this.unbind();
            EVENT_BUS.dispatch(GL.CONST.EVENTS.JOURNAL.RC_MENU.RCM_ITEM_DEL_GUEST, this.opts.guest);
        };

        this.cb.command.add = function add(e) {
            this.unbind();
            EVENT_BUS.dispatch(GL.CONST.EVENTS.JOURNAL.RC_MENU.RCM_ITEM_ADD_GUEST, this.opts.guest);
        };

        this.cb.command.lmc = function lmc(e) {
            this.unbind();
        };
    }

    bind() {
        
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