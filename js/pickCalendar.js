class PickCalendar {
    
        constructor(opts) {
            this.Opts = opts;
            this.Id = Math.floor(Math.random() * 100000);
    
            this.btnLeft = function () {
                var year = document.getElementById('pc-' + this.id + '-year'),
                    val = parseInt(year.value);
                val > 0 && val <= 9999 && (val-- , year.value = val);
            }
    
            this.btnRight = function () {
                var year = document.getElementById('pc-' + this.id + '-year'),
                    val = parseInt(year.value);
                val >= 0 && val < 9999 && (val++ , year.value = val);
            }
    
            this.monthSel = function () {
                var sel = document.getElementsByClassName('pc-month-sel');
                for (let i = 0; i < sel.length; i++) {
                    sel[i].classList.remove('pc-month-sel');
                }
                this.setAttribute('class', 'pc-month-sel');
            }
        }
    
        bind() {
            var pick =
                '<div id="pc-content">' +
                '<div id="pc-head"></div>' +
                '<div id="pc-body">' +
                '<table>' +
                '<thead>' +
                '<tr>' +
                '<td><button id="pc-' + this.Id + '-left" type="button" class="pc-btn-left"></button></td>' +
                '<td><input id="pc-' + this.Id + '-year" class="pc-year" name="year" maxlength="4" size="4" min="1900" max="9999" type="number"></input></td>' +
                '<td><button id="pc-' + this.Id + '-right" type="button" class="pc-btn-right"></button></td>' +
                '</tr>' +
                '</thead>' +
                '<tbody id="pc-' + this.Id + '-body">' +
                '<tr>' +
                '<td id="01-pc-' + this.Id + '-month" class="pc-month">Январь</td>' +
                '<td id="02-pc-' + this.Id + '-month" class="pc-month">Февраль</td>' +
                '<td id="03-pc-' + this.Id + '-month" class="pc-month">Март</td>' +
                '</tr>' +
                '<tr>' +
                '<td id="04-pc-' + this.Id + '-month" class="pc-month">Апрель</td>' +
                '<td id="05-pc-' + this.Id + '-month" class="pc-month">Май</td>' +
                '<td id="06-pc-' + this.Id + '-month" class="pc-month">Июнь</td>' +
                '</tr>' +
                '<tr>' +
                '<td id="07-pc-' + this.Id + '-month" class="pc-month">Июль</td>' +
                '<td id="08-pc-' + this.Id + '-month" class="pc-month">Август</td>' +
                '<td id="09-pc-' + this.Id + '-month" class="pc-month">Сентябрь</td>' +
                '</tr>' +
                '<tr>' +
                '<td id="10-pc-' + this.Id + '-month" class="pc-month">Октябрь</td>' +
                '<td id="11-pc-' + this.Id + '-month" class="pc-month">Ноябрь</td>' +
                '<td id="12-pc-' + this.Id + '-month" class="pc-month">Декабрь</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div>' +
                '<div id="pc-footer">' +
                '<button id="pc-' + this.Id + '-no" type="button" class="btn negative">Отменить</button>' +
                '<button id="pc-' + this.Id + '-ok" type="button" class="btn positive">Подтвердить</button>' +
                '</div>' +
                '</div>';
    
            var div = document.createElement('div');
            div.className = 'pick-calendar';
            div.id = 'pick-calendar-' + this.Id;
            div.innerHTML = pick;
            document.body.appendChild(div);
    
            var left = document.getElementById('pc-' + this.Id + '-left'),
                right = document.getElementById('pc-' + this.Id + '-right'),
                ok = document.getElementById('pc-' + this.Id + '-ok'),
                no = document.getElementById('pc-' + this.Id + '-no'),
                td = document.getElementById('pc-' + this.Id + '-body').getElementsByClassName('pc-month');
    
            left.addEventListener('click', this.btnLeft.bind({ id: this.Id }));
            right.addEventListener('click', this.btnRight.bind({ id: this.Id }));
            ok.addEventListener('click', this.Opts.buttons.ok);
            no.addEventListener('click', this.Opts.buttons.no);
            for (let i = 0; i < td.length; i++) {
                td[i].addEventListener('click', this.monthSel);
            }

            var input = $('#pc-' + this.Id + '-year');
            input.keydown(function (e) {
                if (isNaN(e.key)) {
                    return;
                } else {
                    this.value.length >= 4 && e.preventDefault();
                }
            });
            input.keyup(function (e) {
                var val = this.value;
                val.length == 0 && (this.value = 1900);
            });
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