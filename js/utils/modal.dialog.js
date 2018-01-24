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
        }
    }

    bind() {}
    setVal() {}
    show() {}
    getVal() {}
    unbind() {}
}

class ConfirmDialog extends Dialog {

    constructor() {
        super();
    
        this.cb.command.ok = function (e) {
            EventBus.dispatch(GL.CONST.EVENTS.CALENDAR.DIALOG_SAVE, { intent: this.opts.data.intent, data: this.opts.data });
            this.unbind();
        };
                
        this.cb.command.no = function (e) {
            this.unbind();
        };
    }

    bind() {

        var tree = [{ tag: '', id: ``, class: `` },
             //TODO: tree
        ];

        tree = new DOMTree(tree).cultivate();
        if (tree) document.body.appendChild(tree);
        else console.log('tree is ' + tree);

        var divDialog, divContent, divHeader, divBody, divFooter,
            a, button;

        divHeader = document.createElement('div');
        divHeader.classList.add('modal-header');
        divHeader.classList.add('modal-header-negative');

        a = document.createElement('a');
        a.appendChild(document.createTextNode('Удаление'));
        divHeader.appendChild(a);

        divBody = document.createElement('div');
        divBody.classList.add('modal-body');
        divBody.classList.add(additionalClass);

        a = document.createElement('a');
        a.appendChild(document.createTextNode('Удалить запись под номером №' + this.opts.data.id + ' из гостевой книги?\r\nДействие нельзя будет отменить!'));
        divBody.appendChild(a);

        divFooter = document.createElement('div');
        divFooter.classList.add('modal-footer');
        button = document.createElement('button');
        button.setAttribute('id', 'button-no');
        button.setAttribute('type', 'button');
        button.classList.add('button');
        button.classList.add('negative');
        button.appendChild(document.createTextNode('Отменить'));
        button.addEventListener('click', this.cb.no);
        divFooter.appendChild(button);

        button = document.createElement('button');
        button.setAttribute('id', 'button-ok');
        button.setAttribute('type', 'button');
        button.classList.add('button');
        button.classList.add('positive');
        button.addEventListener('click', this.cb.ok).bind( { id: this.opts.data.id } );
        button.appendChild(document.createTextNode('Подтвердить'));
        divFooter.appendChild(button);

        divContent = document.createElement('div')
        divContent.classList.add('modal-content');
        divContent.classList.add('modal-confirm');
        divContent.appendChild(divHeader);
        divContent.appendChild(divBody);
        divContent.appendChild(divFooter);

        divDialog = document.createElement('div')
        divDialog.setAttribute('id', 'modal-dialog-' + this.id);
        divDialog.classList.add('modal-dialog');
        divDialog.appendChild(divContent);

        document.appendChild(divDialog);
    }

    show() {
        var dialog = document.getElementById('modal-dialog-' + this.id);
        dialog.style.display = 'block';
    }

    unbind() {
        var dialog = document.getElementById('modal-dialog-' + this.id);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }
}

class InOutDialog extends Dialog {

    constructor() {
        super();

        this.cb = {

            ok: function (e) {
                EventBus.dispatch(GL.CONST.EVENTS.CALENDAR.DIALOG_SAVE, { intent: this.opts.data.intent, data: this.getVal() });
                this.unbind();
            },

            no: function (e) {
                this.unbind();
            },
        }
    }

    bind() {

        var dialog, button, attr,
            div, divWrapper, divHead, divBody, divFooter, divDropDown,
            a, label, input;

        divWrapper = document.createElement('div');
        divWrapper.setAttribute('id', 'pio-data-wrapper');

        divHead = document.createElement('div');
        divHead.setAttribute('id', 'pio-dw-head');
        divHead.classList.add('pio-unit');

        label = document.createElement('label');
        let additionalClass, title;
        switch (this.opts.flag) {
            case -1:
                additionalClass = "modal-header-negative";
                title = 'Удаление';
                break;
            case 0:
                additionalClass = "modal-header-neutral";
                title = 'Изменение';
                break;
            case 1:
                additionalClass = "modal-header-positive";
                title = 'Добавление';
                break;
            case 2:
                additionalClass = "modal-header-extend";
                title = 'Обработка';
                break;
            default:
                break;
        }
        label.appendChild(document.createTextNode(title));
        // label.classList.add(additionalClass);

        divHead.appendChild(label);

        divWrapper.appendChild(divHead);

        divBody = document.createElement('div');
        divBody.setAttribute('id', 'pio-dw-body');
        divBody.classList.add('pio-unit');

        div = this.createInputNode('intent', ['pio-el', 'output'], 'Цель');
        div.getElementsByTagName('input')[0].setAttribute('readonly', '');
        div.setAttribute('style', 'display:none;');
        divBody.appendChild(div);

        div = this.createInputNode('id', ['pio-el', 'output'], 'Идентификатор');
        div.getElementsByTagName('input')[0].setAttribute('readonly', '');
        div.setAttribute('style', 'display:none;');
        divBody.appendChild(div);

        div = this.createInputNode('dayin', ['pio-el', 'input'], 'Заезд');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');
        divBody.appendChild(div);

        div = this.createInputNode('dayout', ['pio-el', 'input'], 'Выезд');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');
        divBody.appendChild(div);

        div = this.createInputNode('days', ['pio-el', 'output'], 'Дней');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');
        divBody.appendChild(div);

        div = this.createInputNode('room', ['pio-el', 'input'], 'Комната');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'click');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');

        divDropDown = document.createElement('div');
        divDropDown.setAttribute('id', 'RDDL');
        this.setHandler(divDropDown, 'click');
        this.opts.rooms.forEach(el => {
            a = document.createElement('a');
            a.innerText = el.room;
            divDropDown.appendChild(a);
        });
        div.appendChild(divDropDown);

        divBody.appendChild(div);

        function createInputNode(id, classes, text) {

            var div = document.createElement('div');
            div.setAttribute('id', id);
            classes.forEach(el => {
                div.classList.add(el);
            });
    
            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('required', '');
    
            var label = document.createElement('label');
            label.innerText = text;
    
            div.appendChild(input);
            div.appendChild(label);
    
            return div;
        }

        div = createInputNode('baseline', ['pio-el', 'output'], 'База');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');
        divBody.appendChild(div);

        div = createInputNode('adjustment', ['pio-el', 'input'], 'Корр.');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');
        divBody.appendChild(div);

        div = createInputNode('cost', ['pio-el', 'output'], 'Стоимость');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');
        divBody.appendChild(div);

        div = createInputNode('paid', ['pio-el', 'input'], 'Оплачено');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        divBody.appendChild(div);

        div = createInputNode('name', ['pio-el', 'input'], 'ФИО');
        divBody.appendChild(div);

        div = createInputNode('city', ['pio-el', 'input'], 'Город');
        divBody.appendChild(div);

        div = createInputNode('tel', ['pio-el', 'input'], 'Телефон');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        divBody.appendChild(div);

        div = createInputNode('fn', ['pio-el', 'input'], 'Примечание');
        divBody.appendChild(div);

        divWrapper.appendChild(divBody);

        divFooter = document.createElement('div');
        divFooter.setAttribute('id', 'pio-dw-footer');
        divFooter.classList.add('pio-unit');

        function createButton (id, classes, text) {

            var button = document.createElement('button');
            button.setAttribute('type', 'button');
            button.setAttribute('id', id);
            button.classList.add('button');
            classes.forEach(el => {
                button.classList.add(el);
            });
            button.innerText = text;
    
            return button;
        }

        button = createButton('button-no', ['negative'], 'Отменить');
        button.addEventListener('click', this.cb.no);
        divFooter.appendChild(button);

        button = createButton('button-ok', ['positive'], 'Подтвердить');
        button.addEventListener('click', this.cb.ok);
        divFooter.appendChild(button);

        divWrapper.appendChild(divFooter);

        dialog = document.getElementById('pio-dialog-' + this.id);
        var dialog = document.createElement('div');
        dialog.className = 'popup-input-output';
        dialog.setAttribute('id', 'popup-input-output-' + this.id);
        dialog.appendChild(divWrapper);
        document.body.appendChild(dialog);
    }

    setHandler(target, event) {

        var checkDate = function (value, key) {

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
        }

        var calcFields = function () {

            var dialog = document.getElementById('popup-input-output-' + this.id),
                dayin = dialog.querySelector('#dayin input'),
                dayout = dialog.querySelector('#dayout input'),
                days = dialog.querySelector('#days input'),
                room = dialog.querySelector('#room input'),
                baseline = dialog.querySelector('#baseline input'),
                adjustment = dialog.querySelector('#adjustment input'),
                cost = dialog.querySelector('#cost input');

            var begda = dayin.value.split('.'),
                begda = new Date(''.concat(this.year, '.', (begda[1] ? begda[1] : this.month), '.', begda[0])),
                endda = dayout.value.split('.'),
                endda = new Date(''.concat(this.year, '.', (endda[1] ? endda[1] : this.month), '.', endda[0])),
                totalDays = (endda - begda) / 86400000;

            var rooms = this.rooms.filter(function (el) { return el.room == room.value; });
            (baseline.value == 0) && (baseline.value = rooms[0].price);
            
            var price = (parseInt(baseline.value) || 0) + (parseInt(adjustment.value) || 0),
                mustBePaid = price * totalDays;

            days.value = totalDays;
            cost.value = mustBePaid;
            cost.dispatchEvent(new Event('change'));

        }.bind( { rooms: this.opts.data.rooms, month: this.opts.data.month, year: this.opts.data.year, id: this.id } );

        var handlers = {

            keypress: {

                dayin: function (e) {

                    if (!this(e.target.value, e.key)) {
                        e.preventDefault();
                    }
                }.bind(checkDate),

                dayout: function (e) {

                    if (!this(e.target.value, e.key)) {
                        e.preventDefault();
                    }
                }.bind(checkDate),

                days: function (e) {

                    e.preventDefault();
                },

                room: function (e) {

                    e.preventDefault();
                },

                baseline: function (e) {

                    e.preventDefault();
                },

                adjustment: function (e) {

                    var allowedChars = '-0123456789',
                        strlen = e.target.value.length;
                    if (e.key == '-') {
                        if (e.target.value.indexOf('-') != -1) {
                            e.preventDefault();
                            return;
                        }
                        if (e.target.value.length != 0) {
                            e.preventDefault();
                            return;
                        }
                    }
                    if (allowedChars.indexOf(e.key) == -1) {
                        e.preventDefault();
                        return;
                    }
                    if (strlen > 5) {
                        e.preventDefault();
                        return;
                    }
                },

                cost: function (e) {

                    e.preventDefault();
                },

                paid: function (e) {

                    var allowedChars = '0123456789',
                        strlen = e.target.value.length;

                    if (allowedChars.indexOf(e.key) == -1) {
                        e.preventDefault();
                        return;
                    }
                    if (strlen > 4) {
                        e.preventDefault();
                        return;
                    }
                },

                name: function (e) {

                },

                city: function (e) {

                },

                tel: function (e) {

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

                fn: function (e) {

                }
            },

            click: {

                room: function (e) {

                    e.target.parentNode.querySelector('#RDDL').style.display = 'block';
                },

                RDDL: function (e) {

                    var roomInput = e.target.parentNode.offsetParent.querySelector('input');
                    roomInput.value = e.target.textContent;
                    roomInput.dispatchEvent(new Event('change'));

                    e.target.parentNode.style.display = 'none';
                }
            },

            paste: {

                dayin: function (e) {

                    e.preventDefault();
                },

                dayout: function (e) {
                    
                    e.preventDefault();
                },

                days: function (e) {

                    e.preventDefault();
                },

                room: function (e) {
                    
                    e.preventDefault();
                },

                baseline: function (e) {
                    
                    e.preventDefault();
                },

                adjustment: function (e) {
                    
                    e.preventDefault();
                },

                cost: function (e) {
                    
                    e.preventDefault();
                },

                paid: function (e) { 
                    
                    e.preventDefault();
                },

                tel: function (e) {
                    
                    e.preventDefault();
                }
            },

            change: {

                dayin: function (e) {
                
                    this();
                }.bind(calcFields),

                dayout: function (e) {
                
                    this();
                }.bind(calcFields),

                room: function (e) {

                    var room = this.rooms.filter(function(el) { return el.room == e.target.value }),
                        baseline = document.querySelector('#baseline input');
                    baseline.value = room.length != 0 ? room[0].price : 0;
                    baseline.dispatchEvent(new Event('change'));
                }.bind({ rooms: this.opts.data.rooms }),

                baseline: function (e) {

                    this();
                }.bind(calcFields),

                adjustment: function (e) {
                    
                    this();
                }.bind(calcFields),

                cost: function (e) {
                
                    console.log('change cost');
                }
            }
        }

        var id = target.id ? target.id : target.parentNode.id;
        target.addEventListener(event, handlers[event][id]);
    }

    show(id) {
        var dialogId = id ? id : this.id,
            dialog = document.getElementById('popup-input-output-' + dialogId);
        dialog.style.display = 'block';
    }

    unbind(id) {
        var dialogId = id ? id : this.id,
            dialog = document.getElementById('popup-input-output-' + dialogId);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }

    setVal(val) {
        if (val != undefined) {
            var dialog = document.getElementById('popup-input-output-' + this.id);
            dialog.querySelector('#id input').value = val.id;
            dialog.querySelector('#intent input').value = val.intent;
            dialog.querySelector('#dayin input').value = val.dayin;
            dialog.querySelector('#dayout input').value = val.dayout;
            dialog.querySelector('#room input').value = val.room;
            dialog.querySelector('#baseline input').value = val.baseline;
            dialog.querySelector('#adjustment input').value = val.adjustment;
            dialog.querySelector('#cost input').value = val.cost;
            dialog.querySelector('#paid input').value = val.paid;
            dialog.querySelector('#name input').value = val.name;
            dialog.querySelector('#city input').value = val.city;
            dialog.querySelector('#tel input').value = val.tel;
            dialog.querySelector('#fn input').value = val.fn;
        }
        document.querySelector('#dayin input').dispatchEvent(new Event('change'));
    }

    getVal() {
        var dialog = document.getElementById('popup-input-output-' + this.id);
        return {
            intent: dialog.querySelector('#intent input').value,
            id: dialog.querySelector('#id input').value,
            dayin: dialog.querySelector('#dayin input').value,
            dayout: dialog.querySelector('#dayout input').value,
            days: dialog.querySelector('#days input').value,
            room: dialog.querySelector('#room input').value,
            baseline: dialog.querySelector('#baseline input').value,
            adjustment: dialog.querySelector('#adjustment input').value,
            cost: dialog.querySelector('#cost input').value,
            paid: dialog.querySelector('#paid input').value,
            name: dialog.querySelector('#name input').value,
            city: dialog.querySelector('#city input').value,
            tel: dialog.querySelector('#tel input').value,
            fn: dialog.querySelector('#fn input').value
        }
    }
}

class PickPeriod extends Dialog {
    
    constructor(opts) {
        super();

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
                    year = document.getElementById(id) || 0,
                if (!year) {
                    console.log('ERROR. Year not find in DOM!');
                    return;
                };
                val = parseInt(year.value);
                val > 1900 && val <= 9999 && (val-- , year.value = val);
            },
                    
            next: function nextYear(e) {
                var id = `${GL.CONST.PREFIX.PICK_PERIOD}-${this.id}-input-year`,
                    year = document.getElementById(id) || 0,
                if (!year) {
                    console.log('ERROR. Year not find in DOM!');
                    return;
                };
                val = parseInt(year.value);
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
            EventBus.dispatch(GL.CONST.EVENTS.CALENDAR.DIALOG_SAVE, { intent: this.opts.data.intent, year: val.year, month: val.month });
        };
                
        this.cb.command.no = function no(e) {
            this.unbind();
        };
    }

    bind() {

        const P = GL.CONST.PREFIX.PICK_PERIOD;
        var tree =
            [{ tag: 'div', id: `${P}-${this.id}`, class: `${P}-wrapper`},
                [{ tag: 'div', id: `${P}-content` },
                    { tag: 'div', id: `${P}-head` },
                    [{ tag: 'div', id: `${P}-body` },
                        [{ tag: 'table' },
                            [{ tag: 'thead' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td' },
                                        { tag: 'button', id: `${P}-button-year-prev`, class: 'button year', type: 'button', events: [{ name: 'click', fn: this.cb.control.year.prev, bind: this }] }
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
                                        { tag: 'button', id: `${P}-button-year-next`, class: 'button year', type: 'button', events: [{ name: 'click', fn: this.cb.control.year.next, bind: this }] }
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
                    [{ tag: 'div', id: `${P}-footer` },
                        { tag: 'button', class: 'button negative', type: 'button', textNode: 'Отменить', events: [{ name: '', fn: this.cb.command.no, bind: this }] },
                        { tag: 'button', class: 'button positive', type: 'button', textNode: 'Подтвердить', events: [{ name: '', fn: this.cb.command.ok, bind: this }] },
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
            monthId: (month.getAttribute('id')).substring(0, 2),
            monthName: month.innerHTML
        }
    }

    unbind() {
        var pick = document.getElementById(`${P}-${this.id}-wrapper`);
        pick.style.display = 'none';
        pick.parentNode.removeChild(pick);
    }
}

class RCMenu extends Dialog {

    constructor (opts) {
        this.opts = opts;
        this.X = opts.x;
        this.Y = opts.y;

        this.cb = {

            upd: function upd (e) {
                this.unbind();
                EventBus.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU.RCM_ITEM_UPD_GUEST, { data: this.opts.data });
            },

            del: function del (e) {
                this.unbind();
                EventBus.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU.RCM_ITEM_DEL_GUEST, { data: this.opts.data });
            },

            add: function add (e) {
                this.unbind();
                EventBus.dispatch(GL.CONST.EVENTS.CALENDAR.RC_MENU.RCM_ITEM_ADD_GUEST, { data: this.opts.data });
            },

            lmc: function lmc(e) {
                this.unbind();
            }
        }
    }

    bind () {
        var div, ul, li;

        ul = document.createElement('ul');
        ul.setAttribute('id', 'rcmenu-list');

        if (this.opts.button.upd) {
            li = document.createElement('li');
            li.setAttribute('id', 'editGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode('Изменить'));
            li.addEventListener('click', this.cb.upd);
            ul.appendChild(li);
        }
        if (this.opts.button.del) {
            li = document.createElement('li');
            li.setAttribute('id', 'delGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode('Удалить'));
            li.addEventListener('click', this.cb.del);
            ul.appendChild(li);
        }
        if (this.opts.button.add) {
            li = document.createElement('li');
            li.setAttribute('id', 'addGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode('Добавить'));
            li.addEventListener('click', this.cb.add);
            ul.appendChild(li);
        }

        div = document.createElement('div');
        div.setAttribute('id', 'rcmenu');
        div.appendChild(ul);
        document.body.appendChild(div);

        EventBus.register(GL.CONST.EVENTS.CORE.LEFT_CLICK, this.cb.lmc);
    }

    setVal () {}

    show () {
        var rcmenu = document.getElementById('rcmenu');
        if (rcmenu) {
            this.unbind();
        } else {    
            rcmenu.style.left = this.X + 'px';
            rcmenu.style.top = this.Y + 'px';
            rcmenu.style.display = 'block';
        }
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