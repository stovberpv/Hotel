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

    bind() {
        var additionalClass = "";
        switch (this.Opts.flag) {
            case -1:
                additionalClass = "modal-header-negative";
                break;
            case 0:
                additionalClass = "modal-header-neutral";
                break;
            case 1:
                additionalClass = "modal-header-positive";
                break;
            case 2:
                additionalClass = "modal-header-extend";
                break;
            default:
                break;
        }

        this.Dialog =
            '<div class="modal-content modal-confirm">' +
            '<div class="modal-header ' + additionalClass + '">' +
            '<a>' + this.Opts.dialog.title + '</a>' +
            '</div>' +
            '<div class="modal-body">' +
            '<a>' + this.Opts.dialog.body + '</a>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" id="btn-no" class="btn negative">Отменить</button>' +
            '<button type="button" id="btn-ok" class="btn positive">Подтвердить</button>' +
            '</div>' +
            '</div>';

        var div = document.createElement('div');
        div.className = 'modal-dialog';
        div.id = 'modal-dialog-' + this.Id;
        div.innerHTML = this.Dialog;
        document.body.appendChild(div);

        var dialog = document.getElementById('modal-dialog-' + this.Id),
            btnOk = dialog.children[0].children[2].children[1],
            btnNo = dialog.children[0].children[2].children[0];

        btnOk.addEventListener('click', this.Opts.buttons.btnOk);
        btnNo.addEventListener('click', this.Opts.buttons.btnNo);
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
                additionalClass = "modal-header-extend";
                title = 'Изменение';
                break;
            case 1:
                additionalClass = "modal-header-positive";
                title = 'Добавление';
                break;
            case 2:
                additionalClass = "modal-header-neutrald";
                title = 'Обработка';
                break;
            default:
                break;
        }
        label.innerText = title;
        // label.classList.add(additionalClass);

        divHead.appendChild(label);

        divWrapper.appendChild(divHead);

        divBody = document.createElement('div');
        divBody.setAttribute('id', 'pio-dw-body');
        divBody.classList.add('pio-unit');

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

        div = this.createInputNode('baseline', ['pio-el', 'output'], 'База');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');
        divBody.appendChild(div);

        div = this.createInputNode('adjustment', ['pio-el', 'input'], 'Корр.');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');
        divBody.appendChild(div);

        div = this.createInputNode('cost', ['pio-el', 'output'], 'Стоимость');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        this.setHandler(div.getElementsByTagName('input')[0], 'change');
        divBody.appendChild(div);

        div = this.createInputNode('paid', ['pio-el', 'input'], 'Оплачено');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        divBody.appendChild(div);

        div = this.createInputNode('name', ['pio-el', 'input'], 'ФИО');
        divBody.appendChild(div);

        div = this.createInputNode('city', ['pio-el', 'input'], 'Город');
        divBody.appendChild(div);

        div = this.createInputNode('tel', ['pio-el', 'input'], 'Телефон');
        this.setHandler(div.getElementsByTagName('input')[0], 'keypress');
        this.setHandler(div.getElementsByTagName('input')[0], 'paste');
        divBody.appendChild(div);

        div = this.createInputNode('fn', ['pio-el', 'input'], 'Примечание');
        divBody.appendChild(div);

        divWrapper.appendChild(divBody);

        divFooter = document.createElement('div');
        divFooter.setAttribute('id', 'pio-dw-footer');
        divFooter.classList.add('pio-unit');

        button = this.createButton('btn-no', ['negative'], 'Отменить');
        button.addEventListener('click', this.Opts.buttons.btnNo);
        divFooter.appendChild(button);

        button = this.createButton('btn-ok', ['positive'], 'Подтвердить');
        button.addEventListener('click', this.Opts.buttons.btnOk);
        divFooter.appendChild(button);

        divWrapper.appendChild(divFooter);

        dialog = document.getElementById('pio-dialog-' + this.Id);
        var dialog = document.createElement('div');
        dialog.className = 'popup-input-output';
        dialog.setAttribute('id', 'popup-input-output-' + this.Id);
        dialog.appendChild(divWrapper);
        document.body.appendChild(dialog);
    }

    createInputNode(id, classes, text) {

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

    createButton(id, classes, text) {

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

            var month = this.period.month,
                year = this.period.year,
                dialog = document.getElementById('popup-input-output-' + this.id),
                dayin = dialog.querySelector('#dayin input'),
                dayout = dialog.querySelector('#dayout input'),
                days = dialog.querySelector('#days input'),
                room = dialog.querySelector('#room input'),
                baseline = dialog.querySelector('#baseline input'),
                adjustment = dialog.querySelector('#adjustment input'),
                cost = dialog.querySelector('#cost input');

            var begda = dayin.value.split('.'),
                begda = new Date(''.concat(year, '.', (begda[1] ? begda[1] : month), '.', begda[0])),
                endda = dayout.value.split('.'),
                endda = new Date(''.concat(year, '.', (endda[1] ? endda[1] : month), '.', endda[0])),
                totalDays = (endda - begda) / 86400000;

            var rooms = this.rooms.filter(function (el) { return el.room == room.value; });
            (baseline.value == 0) && (baseline.value = rooms[0].price);
            
            var price = (parseInt(baseline.value) || 0) + (parseInt(adjustment.value) || 0),
                mustBePaid = price * totalDays;

            days.value = totalDays;
            cost.value = mustBePaid;
            cost.dispatchEvent(new Event('change'));

        }.bind( { rooms: this.Opts.rooms, period: this.Opts.period, id: this.Id } );

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
                }.bind({ rooms: this.Opts.rooms }),

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

class InputDialog extends Dialog {

    bind() {
        var additionalClass = "";
        switch (this.Opts.flag) {
            case -1:
                additionalClass = "modal-header-negative";
                break;
            case 0:
                additionalClass = "modal-header-neutral";
                break;
            case 1:
                additionalClass = "modal-header-positive";
                break;
            case 2:
                additionalClass = "modal-header-extend";
                break;
            default:
                break;
        }

        this.Dialog =
            '<div class="modal-content modal-input">' +
            '<div class="modal-header ' + additionalClass + '">' +
            '<a>' + this.Opts.dialog.title + '</a>' +
            '</div>' +
            '<div class="modal-body">' +
            '<input id="in-year" class="input" name="year" type="text" size="4" maxlength="4" placeholder="Год">' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" id="btn-no" class="btn negative">Отменить</button>' +
            '<button type="button" id="btn-ok" class="btn positive">Подтвердить</button>' +
            '</div>' +
            '</div>';
        var div = document.createElement('div');
        div.className = 'modal-dialog';
        div.id = 'modal-dialog-' + this.Id;
        div.innerHTML = this.Dialog;
        document.body.appendChild(div);

        var dialog = document.getElementById('modal-dialog-' + this.Id),
            btnOk = dialog.children[0].children[2].children[1],
            btnNo = dialog.children[0].children[2].children[0];

        btnOk.addEventListener('click', this.Opts.buttons.btnOk);
        btnNo.addEventListener('click', this.Opts.buttons.btnNo);
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

    getVal() {
        return {
            year: $('#in-year').val()
        }
    }
}