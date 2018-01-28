/*jshint esversion: 6 */
/*jshint -W030 */
(function () {
    "use strict";
})();
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
            this.opts.cb.ok(this.opts.data);
        };
                
        this.cb.command.no = function (e) {
            this.unbind();
        };
    }

    bind() {

        const I = GL.CONST.VALUES.CALENDAR.INTENT;
        const P = GL.CONST.PREFIX.CONFIRM_DIALOG;
        const O = this.opts;
        var tree =
            [{ tag: 'div', id: `${P}-${this.id}`, class: `${P} modal modal-wrapper` },
                [{ tag: 'div', class: `${P} modal-content` },
                    [{ tag: 'div', class: `${P} modal-header ${I}-${O.intent}` },
                        { tag: 'label', textNode: O.title }    
                    ],
                    [{ tag: 'div', class: `${P} modal-body` },
                        { tag: 'label', textNode: O.text }
                    ],
                    [{ tag: 'div', class: `${P} modal-footer` },
                        { tag: 'button', class: 'button negative', type: 'button', textNode: 'Отменить', events: [{ name: 'click', fn: this.cb.command.no, bind: this }] },
                        { tag: 'button', class: 'button positive', type: 'button', textNode: 'Подтвердить', events: [{ name: 'click', fn: this.cb.command.ok, bind: this }] },
                    ]
                ]
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) document.body.appendChild(tree);
        else console.log('tree is ' + tree);
    }

    show() {
        const P = GL.CONST.PREFIX.CONFIRM_DIALOG;
        var dialog = document.getElementById(`${P}-${this.id}`);
        dialog.style.display = 'block';
    }

    unbind() {
        const P = GL.CONST.PREFIX.CONFIRM_DIALOG;
        var dialog = document.getElementById(`${P}-${this.id}`);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }
}

class GuestCard extends Dialog {

    constructor(opts) {
        super(opts);

        this.cb.command.ok = function (e) {
            EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.DIALOG_SAVE, { intent: this.opts.intent, data: this.getVal() });
            this.unbind();
        };

        this.cb.command.no = function (e) {
            this.unbind();
        };

        this.utils = { //new function () { }();
            checkDate: function (value, key) {

                var allowedChars = '0123456789.',
                    dot = '.',
                    strlen = value.length,
                    dotIndex = value.indexOf('.'),
                    newValue = value.toString().concat(key);
    
                // только цифры и точка
                if (allowedChars.indexOf(key) == -1) return false;
                // точка не должна быть первой
                // не более двух точек
                // точка не может быть на 3 позиции
                if (key == dot) {
                    if (strlen == 0) return false;
                    if (strlen > 2) return false;
                    if (dotIndex != -1) return false;
                    if (value == 0) return false;
                }
                // не более 5 символов (dd.mm)
                if (strlen > 4) return false;
                // не более 2 цифр подряд
                if (strlen > 1 && (key != dot && dotIndex == -1)) return false;
                // день не больше 31 числа
                if (strlen == 1 && parseInt(newValue) > 31) return false;
                // месяц на старше 12
                if (dotIndex != -1) {
                    var date = newValue.substring(dotIndex + 1);
                    if (date > 12) return false;
                }
                // корректная дата по календарю
    
                //
                return true;
            },

            calcFields: function (that) {

                const O = that.opts;
                const E = GL.CONST.SCHEMA.GUEST;
                const P = GL.CONST.PREFIX.GUEST_CARD;

                var dialog = document.getElementById(`${P}-${that.id}`),
                    dbeg = dialog.querySelector(`#${P}-el-${E.DBEG.key} input`),
                    dend = dialog.querySelector(`#${P}-el-${E.DEND.key} input`),
                    days = dialog.querySelector(`#${P}-el-${E.DAYS.key} input`),
                    room = dialog.querySelector(`#${P}-el-${E.ROOM.key} input`),
                    base = dialog.querySelector(`#${P}-el-${E.BASE.key} input`),
                    adjs = dialog.querySelector(`#${P}-el-${E.ADJS.key} input`),
                    cost = dialog.querySelector(`#${P}-el-${E.COST.key} input`);
    
                var begda = dbeg.value.split('.'),
                    endda = dend.value.split('.');
                begda = new Date(''.concat(O.year, '.', (begda[1] ? begda[1] : O.month), '.', begda[0]));
                endda = new Date(''.concat(O.year, '.', (endda[1] ? endda[1] : O.month), '.', endda[0]));
                var totalDays = (endda - begda) / 86400000;
    
                var rooms = O.rooms.filter(function (el) { return el.room == room.value; });
                (base.value == 0) && (base.value = rooms[0].price);
                
                var price = (parseInt(base.value) || 0) + (parseInt(adjs.value) || 0),
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
                change: function (e) { e.preventDefault(); }
            },
            room: { 
                keypress: function(e) { e.preventDefault(); }, 
                click: function(e) { e.target.parentNode.querySelector('#rooms-drop-down-list').style.display = 'block'; }, 
                paste: function(e) { e.preventDefault(); }, 
                change: function(e) {
                    var room = this.rooms.filter(function (el) { return el.room == e.target.value; }),
                        baseline = document.querySelector(`${GL.CONST.SCHEMA.GUEST.BASE.key} input`);
                    baseline.value = room.length != 0 ? room[0].price : 0;
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
                    var allowedChars = '-0123456789',
                        strlen = e.target.value.length;
                    if (e.key == '-') {
                        if (e.target.value.indexOf('-') != -1) { e.preventDefault(); return; }
                        if (e.target.value.length != 0) { e.preventDefault(); return; }
                    }
                    if (allowedChars.indexOf(e.key) == -1) { e.preventDefault(); return; }
                    if (strlen > 5) { e.preventDefault(); return; }
                }, 
                paste: function(e) { e.preventDefault(); }, 
                change: function(e) { this.utils.calcFields(this); }
            },
            cost: { 
                keypress: function(e) { e.preventDefault(); }, 
                paste: function(e) { e.preventDefault(); }, 
                change: function(e) { console.log('change cost'); }
            },
            paid: { 
                keypress: function(e) {
                    var allowedChars = '0123456789',
                        strlen = e.target.value.length;

                    if (allowedChars.indexOf(e.key) == -1) { e.preventDefault(); return; }
                    if (strlen > 4) { e.preventDefault(); return; }
                }, 
                paste: function(e) { e.preventDefault(); }
            },
            teln: { 
                keypress: function(e) {
                    var allowedChars = '+-() 0123456789',
                    strlen = e.target.value.length;

                    if (allowedChars.indexOf(e.key) == -1) {
                        e.preventDefault();
                        return;
                    }
                    if (strlen > 16) {
                        e.preventDefault();
                        return;
                    }
                }, 
                paste: function(e) { e.preventDefault(); }, 
            },
            rddl: {
                click: function (e) {
                    var roomInput = e.target.parentNode.offsetParent.querySelector('input');
                    roomInput.value = e.target.textContent;
                    roomInput.dispatchEvent(new Event('change'));

                    e.target.parentNode.style.display = 'none';
                }
            }
        };
    }

    bind() {

        const O = this.opts;
        const E = GL.CONST.SCHEMA.GUEST;
        const P = GL.CONST.PREFIX.GUEST_CARD;
        const I = GL.CONST.VALUES.CALENDAR.INTENT[O.intent.toUpperCase()];
        var tree =
            [{ tag: 'div' , id: `${P}-${this.id}`, class: `${P} modal modal-wrapper` },
                [{ tag: 'div', class: `${P} modal-content` },
                    [{ tag: 'div', class: `${P} modal-header intent-${O.intent}` },
                        { tag: 'label', textNode: `${O.title}` }
                    ],
                    [{ tag: 'div', class: `${P} modal-body` },
                        [{ tag: 'div', id: `${P}-el-intent`, class: `${P}-el output`, style: { display: 'none;' } },
                            { tag: 'input', type: 'text', attr: { readonly: '' } },
                            { tag: 'label', textNode: `${I.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.UNID.key}`, class: `${P}-el output`, style: { display: 'none;' } },
                            { tag: 'input', type: 'text', attr: { readonly: '' } },
                            { tag: 'label', textNode: `${E.UNID.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.DBEG.key}`, class: `${P}-el input` },
                            {
                                tag: 'input', type: 'text', attr: { readonly: O.isEditable, required: O.isStrict },
                                events: [
                                   { name: 'keypress', fn: this.cb.control.dbeg.keypress },
                                   { name: 'paste', fn: this.cb.control.dbeg.paste },
                                   { name: 'change', fn: this.cb.control.dbeg.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${E.DBEG.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.DEND.key}`, class: `${P}-el input` },
                            {
                                tag: 'input', type: 'text', attr: { readonly: O.isEditable, required: O.isStrict },
                                events: [
                                    { name: 'keypress', fn: this.cb.control.dend.keypress },
                                    { name: 'paste', fn: this.cb.control.dend.paste },
                                    { name: 'change', fn: this.cb.control.dend.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${E.DEND.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.DAYS.key}`, class: `${P}-el output` },
                            {
                                tag: 'input', type: 'text',
                                events: [
                                    { name: 'keypress', fn: this.cb.control.days.keypress },
                                    { name: 'paste', fn: this.cb.control.days.paste },
                                    { name: 'change', fn: this.cb.control.days.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${E.DAYS.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.ROOM.key}`, class: `${P}-el output` },
                            {
                                tag: 'input', type: 'text',
                                events: [
                                    { name: 'keypress', fn: this.cb.control.room.keypress },
                                    { name: 'paste', fn: this.cb.control.room.paste },
                                    { name: 'change', fn: this.cb.control.room.change.bind({ rooms: this.opts.rooms }) },
                                    { name: 'click', fn: this.cb.control.room.click }
                                ]
                            },
                            { tag: 'label', textNode: `${E.ROOM.txt}` },
                            { tag: 'div', id: 'rooms-drop-down-list', events: [{ name: 'click', fn: this.cb.control.rddl.click }] }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.BASE.key}`, class: `${P}-el output` },
                            {
                                tag: 'input', type: 'text',
                                events: [
                                    { name: 'keypress', fn: this.cb.control.base.keypress },
                                    { name: 'paste', fn: this.cb.control.base.paste },
                                    { name: 'change', fn: this.cb.control.base.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${E.BASE.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.ADJS.key}`, class: `${P}-el input` },
                            {
                                tag: 'input', type: 'text', attr: { readonly: O.isEditable },
                                events: [
                                    { name: 'keypress', fn: this.cb.control.adjs.keypress },
                                    { name: 'paste', fn: this.cb.control.adjs.paste },
                                    { name: 'change', fn: this.cb.control.adjs.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${E.ADJS.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.COST.key}`, class: `${P}-el output` },
                            {
                                tag: 'input', type: 'text',
                                events: [
                                    { name: 'keypress', fn: this.cb.control.cost.keypress },
                                    { name: 'paste', fn: this.cb.control.cost.paste },
                                    { name: 'change', fn: this.cb.control.cost.change.bind(this) }
                                ]
                            },
                            { tag: 'label', textNode: `${E.COST.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.PAID.key}`, class: `${P}-el input` },
                            {
                                tag: 'input', type: 'text', attr: { readonly: O.isEditable, required: O.isStrict },
                                events: [
                                    { name: 'keypress', fn: this.cb.control.paid.keypress },
                                    { name: 'paste', fn: this.cb.control.paid.paste }
                                ]
                            },
                            { tag: 'label', textNode: `${E.PAID.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.NAME.key}`, class: `${P}-el input` },
                            { tag: 'input', type: 'text', attr: { readonly: O.isEditable, required: O.isStrict } },
                            { tag: 'label', textNode: `${E.NAME.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.CITY.key}`, class: `${P}-el input` },
                            { tag: 'input', type: 'text', attr: { readonly: O.isEditable, required: O.isStrict } },
                            { tag: 'label', textNode: `${E.CITY.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.TELN.key}`, class: `${P}-el input` },
                            {
                                tag: 'input', type: 'text', attr: { readonly: O.isEditable },
                                events: [
                                    { name: 'keypress', fn: this.cb.control.teln.keypress },
                                    { name: 'paste', fn: this.cb.control.teln.paste }
                                ]
                            },
                            { tag: 'label', textNode: `${E.TELN.txt}` }
                        ],
                        [{ tag: 'div', id: `${P}-el-${E.FNOT.key}`, class: `${P}-el input` },
                            { tag: 'input', type: 'text', attr: { readonly: O.isEditable } },
                            { tag: 'label', textNode: `${E.FNOT.txt}` }
                        ],
                    ],
                    [{ tag: 'div', class: `${P} modal-footer` },
                        { tag: 'button', class: 'button negative', type: 'button', textNode: 'Отменить', events: [{ name: 'click', fn: this.cb.command.no, bind: this }] },
                        { tag: 'button', class: 'button positive', type: 'button', textNode: 'Подтвердить', events: [{ name: 'click', fn: this.cb.command.ok, bind: this }] },
                    ],
                ]
            ];
        
        tree = new DOMTree(tree).cultivate();
        var rddl = tree.querySelector('#rooms-drop-down-list');
        O.rooms.forEach(el => {
            var a = document.createElement('a');
            a.appendChild(document.createTextNode(el.room));
            rddl.appendChild(a);
        });
        if (tree) document.body.appendChild(tree);
        else console.log('tree is ' + tree);
    }

    show() {
        var dialog = document.getElementById(`${GL.CONST.PREFIX.GUEST_CARD}-${this.id}`);
        dialog.style.display = 'block';
    }

    unbind() {
        var dialog = document.getElementById(`${GL.CONST.PREFIX.GUEST_CARD}-${this.id}`);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }

    setVal(val) {
        if (val == undefined) {
            console.log('ERROR. Nothig to set.');
            return;
        }
        const E = GL.CONST.SCHEMA.GUEST;
        const P = GL.CONST.PREFIX.GUEST_CARD;
        var dialog = document.getElementById(`${P}-${this.id}`);
        dialog.querySelector(`#${P}-el-intent input`).value = this.opts.intent;
        dialog.querySelector(`#${P}-el-${E.UNID.key} input`).value = val.unid;
        dialog.querySelector(`#${P}-el-${E.DBEG.key} input`).value = val.dbeg;
        dialog.querySelector(`#${P}-el-${E.DEND.key} input`).value = val.dend;
        dialog.querySelector(`#${P}-el-${E.ROOM.key} input`).value = val.room;
        dialog.querySelector(`#${P}-el-${E.BASE.key} input`).value = val.base;
        dialog.querySelector(`#${P}-el-${E.ADJS.key} input`).value = val.adjs;
        dialog.querySelector(`#${P}-el-${E.COST.key} input`).value = val.cost;
        dialog.querySelector(`#${P}-el-${E.PAID.key} input`).value = val.paid;
        dialog.querySelector(`#${P}-el-${E.NAME.key} input`).value = val.name;
        dialog.querySelector(`#${P}-el-${E.CITY.key} input`).value = val.city;
        dialog.querySelector(`#${P}-el-${E.TELN.key} input`).value = val.teln;
        dialog.querySelector(`#${P}-el-${E.FNOT.key} input`).value = val.fnot;
        document.querySelector(`#${P}-el-${E.DBEG.key} input`).dispatchEvent(new Event('change'));
    }

    getVal() {
        var dialog = document.getElementById(`${GL.CONST.PREFIX.GUEST_CARD}-${this.id}`);
        return {
            intent: dialog.querySelector(`${GL.CONST.VALUES.CALENDAR.INTENT} input`).value,
            unid: dialog.querySelector(`${E.UNID.key} input`).value,
            dbeg: dialog.querySelector(`${E.DBEG.key} input`).value,
            dend: dialog.querySelector(`${E.DEND.key} input`).value,
            days: dialog.querySelector(`${E.DAYS.key} input`).value,
            room: dialog.querySelector(`${E.ROOM.key} input`).value,
            base: dialog.querySelector(`${E.BASE.key} input`).value,
            adjs: dialog.querySelector(`${E.ADJS.key} input`).value,
            cost: dialog.querySelector(`${E.COST.key} input`).value,
            paid: dialog.querySelector(`${E.PAID.key} input`).value,
            name: dialog.querySelector(`${E.NAME.key} input`).value,
            city: dialog.querySelector(`${E.CITY.key} input`).value,
            teln: dialog.querySelector(`${E.TELN.key} input`).value,
            fnot: dialog.querySelector(`${E.FNOT.key} input`).value
        };
    }
}

class PickPeriod extends Dialog {
    
    constructor(opts) {
        super(opts);

        this.cb.control.year = {
                    
            keyDown: function (e) {
                if (isNaN(e.key)) return;
                else this.value.length >= 4 && e.preventDefault();
            },

            keyUp: function (e) {
                var val = this.value;
                val.length == 0 && (this.value = 1900);
            },
        
            prev: function prevYear(e) {
                var id = `${GL.CONST.PREFIX.PICK_PERIOD}-${this.id}-input-year`,
                    year = document.getElementById(id) || 0;
                if (!year) {
                    console.log('ERROR. Year not find in DOM!');
                    return;
                }
                var val = parseInt(year.value);
                val > 1900 && val <= 9999 && (val-- , year.value = val);
            },
                    
            next: function nextYear(e) {
                var id = `${GL.CONST.PREFIX.PICK_PERIOD}-${this.id}-input-year`,
                    year = document.getElementById(id) || 0;
                if (!year) {
                    console.log('ERROR. Year not find in DOM!');
                    return;
                }
                var val = parseInt(year.value);
                val >= 0 && val < 9999 && (val++ , year.value = val);
            }
        };
                
        this.cb.control.month = {
                    
            sel: function monthSel(e) {
                var className = `${GL.CONST.PREFIX.PICK_PERIOD}-month-sel`,
                    sel = document.getElementsByClassName(className);
                for (let i = 0; i < sel.length; i++) {
                    sel[i].classList.remove(className);
                }
                e.target.setAttribute('class', className);
            }
        };

        this.cb.command.ok = function ok(e) {
            var val = this.getVal();
            this.unbind();
            EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.DIALOG_SAVE, { intent: this.opts.intent, year: val.year, month: val.month.num });
        };
                
        this.cb.command.no = function no(e) {
            this.unbind();
        };
    }

    bind() {

        const P = GL.CONST.PREFIX.PICK_PERIOD;
        var tree =
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
                        { tag: 'button', class: 'button negative', type: 'button', textNode: 'Отменить', events: [{ name: 'click', fn: this.cb.command.no, bind: this }] },
                        { tag: 'button', class: 'button positive', type: 'button', textNode: 'Подтвердить', events: [{ name: 'click', fn: this.cb.command.ok, bind: this }] },
                    ]
                ]
            ];
        
        tree = new DOMTree(tree).cultivate();
        if (tree) document.body.appendChild(tree);
        else console.log('tree is ' + tree);
    }

    setVal(val) {
        const P = GL.CONST.PREFIX.PICK_PERIOD;
        var year = document.getElementById(`${P}-${this.id}-input-year`) || {},
            month = document.getElementById(`${val.month}-month-${P}-${this.id}`);
        year.value = val.year;
        (month.classList) && month.classList.add(`${P}-month-sel`);
    }

    show() {
        const P = GL.CONST.PREFIX.PICK_PERIOD;
        var pick = document.getElementById(`${P}-${this.id}`);
        pick.style.display = 'block';
    }

    getVal() {
        const P = GL.CONST.PREFIX.PICK_PERIOD;
        var month = document.getElementsByClassName(`${P}-month-sel`)[0];
        return {
            year: document.getElementById(`${P}-${this.id}-input-year`).value,
            month: {
                num: (month.getAttribute('id')).substring(0, 2),
                name: month.textContent
            }
        };
    }

    unbind() {
        var pick = document.getElementById(`${ GL.CONST.PREFIX.PICK_PERIOD}-${this.id}`);
        pick.style.display = 'none';
        pick.parentNode.removeChild(pick);
    }
}

class RCMenu extends Dialog {

    constructor (opts) {
        super(opts);

        this.cb.command.upd = function upd(e) {
            this.unbind();
            EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU.RCM_ITEM_UPD_GUEST, this.opts.guest);
        };

        this.cb.command.del = function del(e) {
            this.unbind();
            EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU.RCM_ITEM_DEL_GUEST, this.opts.guest);
        };

        this.cb.command.add = function add(e) {
            this.unbind();
            EVENT_BUS.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU.RCM_ITEM_ADD_GUEST, this.opts.guest);
        };

        this.cb.command.lmc = function lmc(e) {
            this.unbind();
        };
    }

    bind () {
        var div, ul, li;

        ul = document.createElement('ul');
        ul.setAttribute('id', 'rcmenu-list');

        if (this.opts.item.upd) {
            li = document.createElement('li');
            li.setAttribute('id', 'editGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode('Изменить'));
            li.addEventListener('click', this.cb.command.upd.bind(this));
            ul.appendChild(li);
        }
        if (this.opts.item.del) {
            li = document.createElement('li');
            li.setAttribute('id', 'delGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode('Удалить'));
            li.addEventListener('click', this.cb.command.del.bind(this));
            ul.appendChild(li);
        }
        if (this.opts.item.add) {
            li = document.createElement('li');
            li.setAttribute('id', 'addGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode('Добавить'));
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
        var rcmenu = document.getElementById('rcmenu');
        // if (rcmenu) {
            // this.unbind();
        // } else {    
            rcmenu.style.left = this.opts.x + 'px';
            rcmenu.style.top = this.opts.y + 'px';
            rcmenu.style.display = 'block';
        // }
    }

    getVal () {}

    unbind () {
        var rcmenu = document.getElementById('rcmenu');
        if (rcmenu != undefined) {
            rcmenu.style.display = 'none';
            rcmenu.parentNode.removeChild(rcmenu);
        }
    }
}