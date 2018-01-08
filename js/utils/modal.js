class Dialog {

    constructor(opts) {
        this.Opts = opts;
        this.Id = Math.floor(Math.random() * 100000);
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
    
        this.Listeners = {

            ok: function (e) {
                EventBus.dispatch(gl.events.inOutDialogSave, { data: this.Opts.data.id });
            },

            no: function (e) {
                this.unbind();
            }
        }
    }

    bind() {

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
        a.appendChild(document.createTextNode('Удалить запись под номером №' + this.Opts.data.id + ' из гостевой книги?\r\nДействие нельзя будет отменить!'));
        divBody.appendChild(a);

        divFooter = document.createElement('div');
        divFooter.classList.add('modal-footer');
        button = document.createElement('button');
        button.setAttribute('id', 'btn-no');
        button.setAttribute('type', 'button');
        button.classList.add('btn');
        button.classList.add('negative');
        button.appendChild(document.createTextNode('Отменить'));
        button.addEventListener('click', this.Listeners.no);
        divFooter.appendChild(button);

        button = document.createElement('button');
        button.setAttribute('id', 'btn-ok');
        button.setAttribute('type', 'button');
        button.classList.add('btn');
        button.classList.add('positive');
        button.addEventListener('click', this.Listeners.ok).bind( { id: this.Opts.data.id } );
        button.appendChild(document.createTextNode('Подтвердить'));
        divFooter.appendChild(button);

        divContent = document.createElement('div')
        divContent.classList.add('modal-content');
        divContent.classList.add('modal-confirm');
        divContent.appendChild(divHeader);
        divContent.appendChild(divBody);
        divContent.appendChild(divFooter);

        divDialog = document.createElement('div')
        divDialog.setAttribute('id', 'modal-dialog-' + this.Id);
        divDialog.classList.add('modal-dialog');
        divDialog.appendChild(divContent);

        document.appendChild(divDialog);
    }

    show() {
        var dialog = document.getElementById('modal-dialog-' + this.Id);
        dialog.style.display = 'block';
    }

    unbind() {
        var dialog = document.getElementById('modal-dialog-' + this.Id);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }
}

class InOutDialog extends Dialog {

    constructor() {
        super();

        this.Listeners = {

            ok: function (e) {
                EventBus.dispatch(gl.events.inOutDialogSave, this.getVal());
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
        switch (this.Opts.flag) {
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
        this.Opts.rooms.forEach(el => {
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
            button.classList.add('btn');
            classes.forEach(el => {
                button.classList.add(el);
            });
            button.innerText = text;
    
            return button;
        }

        button = createButton('btn-no', ['negative'], 'Отменить');
        button.addEventListener('click', this.Listeners.no);
        divFooter.appendChild(button);

        button = createButton('btn-ok', ['positive'], 'Подтвердить');
        button.addEventListener('click', this.Listeners.ok);
        divFooter.appendChild(button);

        divWrapper.appendChild(divFooter);

        dialog = document.getElementById('pio-dialog-' + this.Id);
        var dialog = document.createElement('div');
        dialog.className = 'popup-input-output';
        dialog.setAttribute('id', 'popup-input-output-' + this.Id);
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

        }.bind( { rooms: this.Opts.data.rooms, month: this.Opts.data.month, year: this.Opts.data.year, id: this.Id } );

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
                }.bind({ rooms: this.Opts.data.rooms }),

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
        var dialogId = id ? id : this.Id,
            dialog = document.getElementById('popup-input-output-' + dialogId);
        dialog.style.display = 'block';
    }

    unbind(id) {
        var dialogId = id ? id : this.Id,
            dialog = document.getElementById('popup-input-output-' + dialogId);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }

    setVal(val) {
        if (val != undefined) {
            var dialog = document.getElementById('popup-input-output-' + this.Id);
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
        var dialog = document.getElementById('popup-input-output-' + this.Id);
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

class PickCalendar extends Dialog {
    
    constructor(opts) {
        super();

        this.Listeners = {

            yearKeyDown: function (e) {
                if (isNaN(e.key)) {
                    return;
                } else {
                    this.value.length >= 4 && e.preventDefault();
                }
            },
            
            yearKeyUp: function (e) {
                var val = this.value;
                val.length == 0 && (this.value = 1900);
            },

            prevYear: function prevYear (e) {
                var year = document.getElementById('pc-' + this.id + '-year'),
                    val = parseInt(year.value);
                val > 0 && val <= 9999 && (val-- , year.value = val);
            },

            nextYear: function nextYear (e) {
                var year = document.getElementById('pc-' + this.id + '-year'),
                    val = parseInt(year.value);
                val >= 0 && val < 9999 && (val++ , year.value = val);
            },

            monthSel: function monthSel(e) {
                //FIX: this -> e??
                var sel = document.getElementsByClassName('pc-month-sel');
                for (let i = 0; i < sel.length; i++) {
                    sel[i].classList.remove('pc-month-sel');
                }
                this.setAttribute('class', 'pc-month-sel');
            },

            ok: function ok (e) {
                var val = this.getVal();
                this.unbind();
                EventBus.dispatch(gl.events.inOutDialogSave, { intent: this.Opts.data.intent, year: val.year, month: val.month });

            },

            no: function no (e) {
                this.unbind();
            }
        }
    }

    bind() {

        var div,
            divContent, divHead, divBody, divFooter,
            table, thead, tbody, tr, td,
            input, button;
        
        divContent = document.createElement('div');
        divContent.setAttribute('id', 'pc-content');

        divHead = document.createElement('div');
        divHead.setAttribute('id', 'pc-head');

        divContent.appendChild(divHead);

        tr = document.createElement('tr');
        
        td = document.createElement('td');
        button = document.createElement('button');
        button.setAttribute('id', 'pc-' + this.Id + '-prev');
        button.setAttribute('type', 'button');
        button.classList.add('pc-btn-prev');
        prev.addEventListener('click', this.Listeners.prevYear.bind({ id: this.Id }));
        td.appendChild(button);
        tr.appendChild(td);

        td = document.createElement('td');
        input = document.createElement('input');
        input.setAttribute('id', 'pc-' + this.Id + '-year');
        input.setAttribute('type', 'number');
        input.setAttribute('name', 'year');
        input.setAttribute('maxlength', '4');
        input.setAttribute('size', '4');
        input.setAttribute('min', '1900');
        input.setAttribute('max', '9999');
        input.classList.add('pc-year');
        input.keydown(this.Listeners.yearKeyDown);
        input.keyup(this.Listeners.yearKeyUp);
        td.appendChild(input);
        tr.appendChild(td);

        td = document.createElement('td');
        button = document.createElement('button');
        button.setAttribute('id', 'pc-' + this.Id + '-next');
        button.setAttribute('type', 'button');
        button.classList.add('pc-btn-next');
        next.addEventListener('click', this.Listeners.nextYear.bind({ id: this.Id }));
        td.appendChild(button);
        tr.appendChild(td);
        
        thead = document.createElement('thead');
        thead.appendChild(tr);

        table = document.createElement('table');
        table.appendChild(thead);  

        tbody = document.createElement('tbody');
        
        function createMonth(id, name) {
            var td = document.createElement('td');
            td.setAttribute('id', id + '-pc-' + this.Id + '-month');
            td.classList.add('pc-month');
            td.appendChild(document.createTextNode(name));
            return td;
        }
        
        tr = document.createElement('tr');
        tr.appendChild(createMonth('01', 'Январь'));
        tr.appendChild(createMonth('02', 'Февраль'));
        tr.appendChild(createMonth('03', 'Март'));
        tbody.appendChild(tr);

        tr = document.createElement('tr');
        tr.appendChild(createMonth('04', 'Апрель'));
        tr.appendChild(createMonth('05', 'Май'));
        tr.appendChild(createMonth('06', 'Июнь'));
        tbody.appendChild(tr);

        tr = document.createElement('tr');
        tr.appendChild(createMonth('07', 'Июль'));
        tr.appendChild(createMonth('08', 'Август'));
        tr.appendChild(createMonth('09', 'Сентябрь'));
        tbody.appendChild(tr);
        
        tr = document.createElement('tr');
        tr.appendChild(createMonth('10', 'Октябрь'));
        tr.appendChild(createMonth('11', 'Ноябрь'));
        tr.appendChild(createMonth('12', 'Декабрь'));
        tbody.appendChild(tr);

        tbody.addEventListener('click', this.Listeners.monthSel)
        
        table.appendChild(tbody);
        
        divBody = document.createElement('div');
        divBody.setAttribute('id', 'pc-body');
        divBody.appendChild(table);

        divContent.appendChild(divBody);

        divFooter = document.createElement('div');
        divFooter.setAttribute('id', 'pc-footer');

        button = document.createElement('button');
        button.setAttribute('id', 'pc-' + this.Id + '-no');
        button.setAttribute('type', 'button');
        button.classList.add('btn');
        button.classList.add('negative');
        button.appendChild(document.createTextNode('Отменить'));
        no.addEventListener('click', this.Listeners.no);
        divFooter.appendChild(button);

        button = document.createElement('button');
        button.setAttribute('id', 'pc-' + this.Id + '-ok');
        button.setAttribute('type', 'button');
        button.classList.add('btn');
        button.classList.add('positive');
        button.appendChild(document.createTextNode('Подтвердить'));
        ok.addEventListener('click', this.Listeners.ok);
        divFooter.appendChild(button);

        divContent.appendChild(divFooter);
        
        var div = document.createElement('div');
        div.classList.add('pick-calendar');
        div.setAttribute('id', 'pick-calendar-' + this.Id);
        div.appendChild(divContent);

        document.body.appendChild(div);
    }

    setVal(val) {
        document.getElementById('pc-' + this.Id + '-year').value = val.year;
        document.getElementById(val.month + '-pc-' + this.Id + '-month').classList.add('pc-month-sel');
    }

    show() {
        var pick = document.getElementById('pick-calendar-' + this.Id);
        pick.style.display = 'block';
    }

    getVal() {
        var month = document.getElementsByClassName('pc-month-sel')[0];
        return {
            year: document.getElementById('pc-' + this.Id + '-year').value,
            monthId: (month.getAttribute('id')).substring(0, 2),
            monthName: month.innerHTML
        }
    }

    unbind() {
        var pick = document.getElementById('pick-calendar-' + this.Id);
        pick.style.display = 'none';
        pick.parentNode.removeChild(pick);
    }
}
class RCMenu extends Dialog {

    constructor (opts) {
        this.Opts = opts;
        this.X = opts.x;
        this.Y = opts.y;

        this.Listeners = {

            upd: function upd (e) {
                this.unbind();
                EventBus.dispatch(gl.events.updGuest, { data: this.Opts.data });
            },

            del: function del (e) {
                this.unbind();
                EventBus.dispatch(gl.events.delGuest, { data: this.Opts.data });
            },

            add: function add (e) {
                this.unbind();
                EventBus.dispatch(gl.events.addGuest, { data: this.Opts.data });
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

        if (this.Opts.btn.upd) {
            li = document.createElement('li');
            li.setAttribute('id', 'editGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode('Изменить'));
            li.addEventListener('click', this.Listeners.upd);
            ul.appendChild(li);
        }
        if (this.Opts.btn.del) {
            li = document.createElement('li');
            li.setAttribute('id', 'delGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode('Удалить'));
            li.addEventListener('click', this.Listeners.del);
            ul.appendChild(li);
        }
        if (this.Opts.btn.add) {
            li = document.createElement('li');
            li.setAttribute('id', 'addGuest');
            li.classList.add('rcmenu-item');
            li.appendChild(document.createTextNode('Добавить'));
            li.addEventListener('click', this.Listeners.add);
            ul.appendChild(li);
        }

        div = document.createElement('div');
        div.setAttribute('id', 'rcmenu');
        div.appendChild(ul);
        document.body.appendChild(div);

        EventBus.register(gl.events.lefClick, this.Listeners.lmc);
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