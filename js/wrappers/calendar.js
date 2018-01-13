class Calendar extends DataWrapper {

    constructor() {
        super();

        /** 
         * ID обрабатываемого класса 
         * FIX: при переходе на новую строку начинать отсчет заново
         */
        this.classId;

        this.Listeners = {

            // external called events

            //FIX: rename
            RCMenu: function RCMenu(e) {

                if (!e.detail.EventBus) {
                    console.log('Invalid function call.');
                    return;
                };

                var rcmenu = new RCMenu({
                    data: e.detail.data,
                    btn: {
                        upd: e.detail.btn.upd,
                        del: e.detail.btn.del,
                        add: e.detail.btn.add
                    },
                    x: e.pageX,
                    y: e.pageY
                });

                rcmenu.bind();
                rcmenu.show();
            },

            RCMItemAddGuest: function RCMItemAddGuest(e) {

                var initVal = {
                    intent: gl.intent_add,
                    month: gl.monthNames.indexOf(document.getElementById('month').value),
                    year: document.getElementById('year').value,
                    rooms: gl.rooms
                }

                var inOutDialog = new InOutDialog({
                    data: initVal
                });
                inOutDialog.bind();

                var data = e.detail.data;
                data.intent = initVal.intent;
                inOutDialog.setVal(data);

                inOutDialog.show();
            },

            RCMItemDelGuest: function RCMItemDelGuest(e) {

                var initVal = {
                    id: e.detail.data.id.substring(1),
                }

                var confirmDialog = new ConfirmDialog({
                    data: {
                        data: initVal
                    }
                });
                confirmDialog.bind();
                confirmDialog.show();
            },

            RCMItemUpdGuest: function RCMItemUpdGuest(e) {

                var initVal = {
                    intent: gl.intent_upd,
                    month: gl.monthNames.indexOf(document.getElementById('month').value),
                    year: document.getElementById('year').value,
                    rooms: gl.rooms
                }

                var inOutDialog = new InOutDialog({
                    data: initVal
                });
                inOutDialog.bind();

                var data = e.detail.data;
                data.intent = initVal.intent;
                inOutDialog.setVal(val);

                inOutDialog.show();
            },

            inOutDialogSave: function inOutDialogSave(e) {

                
            },

            // delegate event listeners

            calendarTDmouseDown: function mousedown(e) {

                if (e.which == 2) return;

                var data = {
                        id: '',
                        dayin: '',
                        dayout: '',
                        days: '',
                        room: '',
                        baseline: '',
                        adjustment: '',
                        cost: '',
                        paid: '',
                        name: '',
                        city: '',
                        tel: '',
                        fn: ''
                    },
                    clList = e.target.classList,
                    isAvailableBtn;

                if (e.which == 3) {

                    if (clList.contains(gl.class_selected)) {

                        let filterGroupId = function (el) {
                            return el.match(/\bsel-group-\d+/g);
                        }
                        var groupId = e.target.className.split(' ').filter(filterGroupId).toString(),
                            groupEl = document.querySelectorAll('#calendar > tbody > tr#R' + row + ' > td.' + groupId),
                            begda = groupEl[0].id.split('-'),
                            endda = groupEl[groupEl.length - 1].id.split('-');

                        data.id = '-1';
                        data.room = (e.target.id).substring(2, 4);
                        data.dayin = begda[2] + '.' + begda[1];
                        data.dayout = endda[2] + '.' + endda[1];
                        isAvailableBtn = true;

                    } else if (clList.contains(gl.class_redeemed) || clList.contains(gl.class_reserved)) {

                        let filterId = function (el) {
                            return el.match(/^N\d+$/);
                        }
                        data.id = e.target.className.split(' ').filter(filterId).toString();
                        isAvailableBtn = false;

                    } else if (!clList) {

                        var guest = e.target.closest('.book').querySelector('.book tbody');
                        if (!guest) return;

                        data.id = guest.querySelector('.person-id').value;
                        data.dayin = guest.querySelector('.person-dayin').value.substring(3);
                        data.dayout = guest.querySelector('.person-dayout').valuesubstring(3);
                        data.days = guest.querySelector('.person-days').value;
                        data.room = guest.querySelector('.person-room-num').value;
                        data.baseline = guest.querySelector('.person-baseline').value;
                        data.adjustment = guest.querySelector('.person-adjustment').value;
                        data.cost = guest.querySelector('.person-room-cost').value;
                        data.paid = guest.querySelector('.person-room-paid').value;
                        data.name = guest.querySelector('.person-name').value;
                        data.city = guest.querySelector('.person-city').value;
                        data.tel = guest.querySelector('.person-tel').value;
                        data.fn = guest.querySelector('.person-fn').value;

                        isAvailableBtn = false;

                    } else {
                        return;
                    }

                    EventBus.dispatch(gl.events.rcmenu, {
                        btn: {
                            upd: !isAvailableBtn,
                            del: !isAvailableBtn,
                            add: isAvailableBtn
                        },
                        x: e.pageX,
                        y: e.pageY,
                        data: data
                    });

                    return;
                }

                // Выделение при зажатой мыши
                gl.isMouseDown = true;
                if (e.target.classList.length == 0 || e.target.classList.contains(gl.class_selected)) {
                    e.target.classList.toggle(gl.class_selected);
                }
                gl.isSelected = e.target.classList.contains(gl.class_selected);
                SelectionGroup.del(e);
                gl.isSelected ? SelectionGroup.add(e) : SelectionGroup.free();

                // Переключения CSS класса опредляющего подсвеченный элемент
                let ids = e.target.className.split(' ').filter(function (el) {
                    return el.match(/^N\d+$/g);
                });
                for (let i = 0; i < ids.length; i++) {
                    document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]).forEach(function (el) {
                        el.classList.toggle(ids[i] + '-' + gl.class_viewfix);
                        el.classList.toggle(ids[i] + '-' + gl.class_view);
                    });
                    document.querySelector('.book > tbody > tr#' + ids[i]).classList.toggle(gl.class_viewfix);
                    document.querySelector('.book > tbody > tr#' + ids[i]).classList.toggle(gl.class_view);
                }
            },

            calendarTDmouseOver: function mouseover(e) {

                // Выделение при зажатой мыши
                if (gl.isMouseDown) {
                    if (e.target.classList.length == 0 || e.target.classList.contains(gl.class_selected)) {
                        SelectionGroup.del(e);
                        gl.isSelected && SelectionGroup.add(e);
                        e.target.classList.toggle(gl.class_selected, gl.isSelected);
                    } else {
                        SelectionGroup.free();
                    }
                }

                // Переключения CSS класса опредляющего подсвеченный элемент
                let ids = e.target.className.split(' ').filter(function (el) {
                    return el.match(/^N\d+$/g);
                });
                for (let i = 0; i < ids.length; i++) {
                    var els = document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]),
                        viewfix = ids[i] + '-' + gl.class_viewfix,
                        view = ids[i] + '-' + gl.class_view;
                    for (let i = 0; i < els.length; i++) {
                        if (!els[i].classList.contains(view)) {
                            els[i].classList.add(view);
                        }
                    }
                    document.querySelector('.book > tbody > tr#' + ids[i]).classList.add(ids[i] + '-' + gl.class_view);
                }
                let id = e.target.id.substring(5);
                document.querySelector('#calendar thead tr:nth-child(2) th#D' + id).classList.add(gl.class_view);
            },

            calendarTDmouseOut: function mouseout(e) {

                // Выделение при зажатой мыши
                let ids = e.target.className.split(' ').filter(function (el) {
                    return el.match(/^N\d+$/g);
                });
                for (let i = 0; i < ids.length; i++) {
                    var els = document.querySelectorAll('#calendar > tbody > tr > td.' + ids[i]),
                        viewfix = ids[i] + '-' + gl.class_viewfix,
                        view = ids[i] + '-' + gl.class_view;
                    for (let i = 0; i < els.length; i++) {
                        if (els[i].classList.contains(view)) {
                            els[i].classList.remove(view);
                        }
                    }
                    document.querySelector('.book > tbody > tr#' + ids[i]).classList.remove(ids[i] + '-' + gl.class_view);
                }
                let id = e.target.id.substring(5);
                document.querySelector('#calendar thead tr:nth-child(2) th#D' + id).classList.remove(gl.class_view);
            },

            calendarTDmouseUp: function mouseup(e) {

                SelectionGroup.free();
                gl.isMouseDown = false;
            },

            calendarTHmouseDown: function mousedown(e) {

                e.target.classList.toggle(gl.class_viewfix);
                var book = document.querySelector('#' + e.target.parentNode.id + '-book');
                if (!book) {
                    console.log('Error. No book with id: ' + e.target.parentNode.id + '-book');
                    return;
                }

                var stDisplay = window.getComputedStyle(book).getPropertyValue('display');
                if (book.style.display == 'none' || stDisplay == 'none') {
                    book.style.display = 'table-row';
                } else {
                    book.style.display = 'none';
                }
            },

            bookTRmouseDown: function mousedown(e) {

                if (e.which == 2) return;

                if (e.which == 3) {
                    EventBus.dispatch(gl.events.rcmenu, []);
                    return;
                };

                if (!e.target.closest('.inner-book')) {
                    var personRow = e.target.querySelector('.person-row'); //FIX: ???
                    personRow.classList.toggle(gl.class_viewfix);
                    personRow.classList.toggle(gl.class_view);
                    document.querySelectorAll('#calendar > tbody > tr > td.' + personRow.id).forEach(function (el) {
                        if (that.classList.contains(gl.class_viewfix)) {//FIX: ???
                            el.classList.add(id + '-' + gl.class_viewfix);//FIX: ???
                            el.classList.remove(id + '-' + gl.class_view);//FIX: ???
                        } else {
                            el.classList.add(id + '-' + gl.class_view);//FIX: ???
                            el.classList.remove(id + '-' + gl.class_viewfix);//FIX: ???
                        }
                    });
                }
            },

            bookTRmouseOver: function mouseover(e) {
                var innerBook = e.target.closest('.book');
                if (innerBook) {
                    var personRow = innerBook.querySelector('.person-row');
                    if (!personRow.classList.contains(gl.class_viewfix)) {
                        personRow.classList.add(gl.class_view);
                        document.querySelectorAll('#calendar > tbody > tr > td.' + personRow.id).forEach(function (el) {
                            el.classList.add(personRow.id + '-' + gl.class_view);
                        });
                    }
                }
            },

            bookTRmouseOut: function mouseout(e) {
                var innerBook = e.target.closest('.book');
                if (innerBook) {
                    var personRow = innerBook.querySelector('.person-row');
                    if (!personRow.classList.contains(gl.class_viewfix)) {
                        personRow.classList.remove(gl.class_view);
                        document.querySelectorAll('#calendar > tbody > tr > td.' + personRow.id).forEach(function (el) {
                            el.classList.remove(personRow.id + '-' + gl.class_view);
                        });
                    }
                }
            },

            async: {

                initialization: {

                    success: function success(e) {

                        EventBus.unregister(gl.events.calendar.async.initialization.Success, success);
                        var data = e.detail.data;
                        if (data.status) {
                            this._setData(data);
                            this.init();
                        } else {
                            console.log(data.msg)
                        };
                    },
                    
                    error: function error(e) {

                    }
                },

                month: {

                    prev: function prevMonth(e) {

                        function onSuccess(data) {
                            if (data.status) {
                                this._setYear(data.year);
                                this._setMonth(data.month);
                                this._prepare(data.year, data.month);
                                this.addEntry(data.year, data.month, data.data);
                            } else {
                                console.log(data.msg)
                            };
                        }

                        function onError(xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(errorThrown);
                        }

                        var monthNum = this._getMonth().num;
                        monthNum > 1 ? monthNum-- : monthNum = 12;
                        
                        var newMonth = gl.monthNames[monthNum];
                        db.gl001.select(this._getYear(), newMonth, onSuccess.bind(this), onError);
                    },

                    next: function nextMonth(e) {

                        function onSuccess(data) {
                            if (data.status) {
                                this._setYear(data.year);
                                this._setMonth(data.month);
                                this._prepare(data.year, data.month);
                                this.addEntry(data.year, data.month, data.data);
                            } else {
                                console.log(data.msg)
                            };
                        }

                        function onError(xhr, textStatus, errorThrown) {
                            console.log(textStatus);
                            console.log(errorThrown);
                        }

                        var monthNum = this._getMonth().num;
                        monthNum > 11 ? monthNum = 1 : monthNum++;
                        
                        var newMonth = gl.monthNames[monthNum];
                        db.gl001.select(this._getYear(), newMonth, onSuccess.bind(this), onError);
                    }
                },

                pickCalendar: function pickCalendar(e) {

                    var pickCalendar = new PickCalendar({
                        data: {
                            intent: gl.intent_add,
                            buttons: {
                                ok: btnOk.bind(this)
                            }
                        },
                    });
                    pickCalendar.bind();
                    pickCalendar.setVal({
                        year: this._getYear(),
                        month: this._getMonth().num
                    });
                    pickCalendar.show();    

                    function btnOk(data) {

                        switch (data.intent) {
                            case gl.intent_add:
                                db.gl001.insert(data, glInsertSuccess, glInsertError);
                                break;
        
                            case gl.intent_upd:
                                db.gl001.update(data, glUpdateSuccess, glUpdateError);
                                break;
        
                            case gl.intent_del:
                                db.gl001.delete(data.id, glDeleteSuccess, glDeleteError);
                                break;
        
                            case gl.intent.selCalendar:
                                if (data.year < 1900) return;
                                this._setYear(data.year);
                                this._setMonth(data.month);
                                db.gl001.select(glSelectSuccess, glSelectError);
                                db.cf001.update(cfUpdateSuccess, cfUpdateError);
                                break;
        
                            default:
                                break;
                        }

                        function glInsertSuccess(data) { }
                        function glInsertError(xhr, textStatus, errorThrown) { }

                        function glUpdateSuccess(data) { }
                        function glUpdateError(xhr, textStatus, errorThrown) { }

                        function glDeleteSuccess(data) { }
                        function glDeleteError(xhr, textStatus, errorThrown) { }

                        function glSelectSuccess(data) { }
                        function glSelectError(xhr, textStatus, errorThrown) { }

                        function cfUpdateSuccess(data) { }
                        function cfUpdateError(xhr, textStatus, errorThrown) { }
                    }
                }
            }
        }
    }

    bind(target) {

        var tree =
            [{ tag: 'table', id: 'calendar', class: 'my-table' },
                [{ tag: 'thead' },
                    [{ tag: 'tr', id: 'calendar-row-buttons' },
                        [{tag: 'td'},
                            [{ tag: 'table' },
                                [{ tag: 'tbody' },
                                    [{ tag: 'tr' },
                                        [{ tag: 'td' },
                                            { tag: 'span', id: 'button-prev-month', class: 'month-button', event: { name: 'click', fn: this.Listeners.async.month.prev.bind(this) } },
                                        ],
                                        [{ tag: 'td' },
                                            [{ tag: 'span', id: 'button-pick-calendar', event: { name: 'click', fn: this.Listeners.async.pickCalendar.bind(this) } },
                                                { tag: 'label', id: 'month' },
                                                { tag: 'label', id: 'year' },
                                            ],
                                        ],
                                        [{ tag: 'td' },
                                            { tag: 'span', id: 'button-next-month', class: 'month-button', event: { name: 'click', fn: this.Listeners.async.month.next.bind(this) } },
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
                [{ tag: 'tbody' },
                ],
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) target.appendChild(tree);
        else console.log('tree is ' + tree);

        /** 
         * Регистрация отложенных событий, которые должны быть вызваны на элементах, 
         * которые еще не существуют
         */
        var qsParent, qsChild, qsParentExcl;

        qsParent = '#calendar > tbody'; qsChild = 'td', qsParentExcl = '.book-row';
        this._setDelegate('mousedown', qsParent, qsChild, qsParentExcl, this.Listeners.calendarTDmouseDown);
        this._setDelegate('mouseover', qsParent, qsChild, qsParentExcl, this.Listeners.calendarTDmouseOver);
        this._setDelegate('mouseout', qsParent, qsChild, qsParentExcl, this.Listeners.calendarTDmouseOut);
        this._setDelegate('mouseup', qsParent, qsChild, qsParentExcl, this.Listeners.calendarTDmouseUp);

        qsParent = '#calendar > tbody'; qsChild = 'tr > th', qsParentExcl = '';
        this._setDelegate('mousedown', qsParent, qsChild, qsParentExcl, this.Listeners.calendarTHmouseDown);

        qsParent = '#calendar > tbody'; qsChild = '.book', qsParentExcl = '';
        this._setDelegate('mousedown', qsParent, qsChild, qsParentExcl, this.Listeners.bookTRmouseDown);
        this._setDelegate('mouseover', qsParent, qsChild, qsParentExcl, this.Listeners.bookTRmouseOver);
        this._setDelegate('mouseout', qsParent, qsChild, qsParentExcl, this.Listeners.bookTRmouseOut);

        /** 
         * Регистрация событий которые будут вызываться асинхронно
         */
        //FIX: add unregister
        EventBus.register(gl.events.calendar.DatePick, this.Listeners.datePick);
        EventBus.register(gl.events.calendar.DialogSave, this.Listeners.inOutDialogSave);
        EventBus.register(gl.events.rcMenu.RCMenu, this.Listeners.RCMenu);
        EventBus.register(gl.events.rcMenu.RCMItemAddGuest, this.Listeners.RCMItemAddGuest);
        EventBus.register(gl.events.rcMenu.RCMItemDelGuest, this.Listeners.RCMItemDelGuest);
        EventBus.register(gl.events.rcMenu.RCMItemUpdGuest, this.Listeners.RCMItemUpdGuest);
    }

    init() {

        var data = this._getData();

        if (!data) {
            EventBus.register(gl.events.ajax.calendar.init.Success, this.Listeners.ajax.success.bind(this));

            $.ajax({
                url: '../db/init.php',
                dataType: 'json',
                success: function (data) {
                    EventBus.dispatch(gl.events.ajax.calendar.init.Success, data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            });

            return;
        }
        
        gl.rooms = data.rooms;
        this._prepare(data.year, data.month);
        this.addEntry(data.year, data.month, data.data);
    }

    addEntry(year, month, list) {

        var list = (list === undefined) ? [] : list;

        for (let i = 0; i < list.length; i++) {
            var wa = list[i];

            // calendar begin
            var begda = new Date(wa.dayin),
                endda = new Date(wa.dayout),
                curda = new Date(),
                tmpda = begda;

            while (tmpda <= endda) {
                if (tmpda.format('yyyy-mm') == (year + '-' + month)) {

                    //FIX: replace innerHTML (memory leak)
                    var td = document.querySelector('#calendar tbody tr#R' + wa.room + ' td#RD' + wa.room + '_' + tmpda.format('yyyy-mm-dd'));
                    td.innerHTML = '';

                    // добавляем класс
                    if (td.classList.contains(gl.class_redeemed) || td.classList.contains(gl.class_reserved)) {
                        td.classList.remove(gl.class_redeemed);
                        td.classList.remove(gl.class_reserved);
                        td.classList.add(gl.class_adjacent);
                    } else {
                        td.classList.remove(gl.class_selected);
                        if (tmpda < curda) {
                            td.classList.add(gl.class_redeemed);
                        } else {
                            td.classList.add(gl.class_reserved);
                        }
                    }
                    td.classList.add('N' + wa.id);

                    // добавляем подсказку  
                    var div = td.getElementsByTagName('div'),
                        hintText = '№' + wa.id + ' ' + wa.name + ' с ' + begda.format('dd.mm') + ' по ' + endda.format('dd.mm');
                    if (div.length == 0) {
                        var span = document.createElement('span');
                        span.setAttribute('class', 'hint-text');
                        span.appendChild(document.createTextNode(hintText));
                        div = document.createElement('div');
                        div.setAttribute('class', 'hint');
                        div.appendChild(span);
                        td.append(div);
                    } else {
                        div.children('span').append('<br>' + hintText);
                    }
                }

                begda.setDate(begda.getDate() + 1);
            }
            // calendar end

            // book begin
            var tree,
                days = new Date(year, month, 0).getDate();
            if (!document.getElementById('R' + wa.room + '-book')) {
                tree =
                    [{ tag: 'tr', id: 'R' + wa.room + '-book', class: 'hidden book-row' },
                        [{ tag: 'td', colspan: (days + 1) },
                            [{ tag: 'table', class: 'book' },
                                { tag: 'tbody' }
                            ]
                        ]
                    ];
                tree = new DOMTree(tree).cultivate();
                var tr = document.querySelector('#calendar tbody tr#R' + wa.room);
                tr.parentNode.insertBefore(tree, tr.nextSibling);
            }

            tree =
                [{ tag: 'tr', id: 'N' + wa.id, class: 'person-row' },
                    { tag: 'td', class: 'person-fields person-id', textNode: wa.id },
                    [{ tag: 'td' },
                        [{ tag: 'table', class: 'inner-book' },
                            [{ tag: 'tbody' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: 'person-fields person-base-info' },
                                        { tag: 'a', class: 'person-fields person-name', textNode: wa.name },
                                        { tag: 'a', class: 'person-fields person-tel', textNode: wa.tel },
                                    ],
                                    { tag: 'td', class: 'person-fields person-dates person-dayin', textNode: 'с  ' + (new Date(wa.dayin).format('dd.mm')) },
                                    { tag: 'td', class: 'person-fields person-room-num', rowspan: 2, textNode: wa.room },
                                    { tag: 'td', class: 'person-fields person-room-cost', textNode: wa.cost },
                                ],
                                [{ tag: 'tr' },
                                    [{ tag: 'td', class: 'person-fields person-additional-info' },
                                        { tag: 'a', class: 'person-fields person-city', textNode: wa.city },
                                        { tag: 'a', class: 'person-fields person-fn', textNode: wa.fn },
                                    ],
                                    { tag: 'td', class: 'person-fields person-dates person-dayout', textNode: 'по ' + (new Date(wa.dayout).format('dd.mm')) },
                                    { tag: 'td', class: 'person-fields person-room-paid', textNode: wa.paid },
                                ],
                                [{ tag: 'tr', style: 'display:none;' },
                                    { tag: 'td', class: 'person-fields person-days', textNode: wa.days },
                                    { tag: 'td', class: 'person-fields person-baseline', textNode: wa.baseline },
                                    { tag: 'td', class: 'person-fields person-adjustment', textNode: wa.adjustment }
                                ]
                            ]
                        ]
                    ]
                ];    
            tree = new DOMTree(tree).cultivate();
            document.querySelector('#R' + wa.room + '-book .book tbody').appendChild(tree);
            // book end
        }
    }

    delEntry(list) {

        for (let i = 0; i < list.length; i++) {
            var wa = list[i];

            // calendar begin
            var room = wa.room,
                begda = new Date(wa.dayin),
                endda = new Date(wa.dayout),
                curda = new Date();

            while (begda <= endda) {
                var date = begda.format('yyyy-mm-dd'),
                    td = document.querySelector('#calendar tbody tr#R' + room + ' td#RD' + room + '_' + date);
                if (!td) {
                    begda.setDate(begda.getDate() + 1);
                    continue;
                }
                td.classList.remove('N' + wa.id);
                td.classList.remove('N' + wa.id + '-' + gl.class_viewfix);
                td.classList.remove('N' + wa.id + '-' + gl.class_view);
                if (td.classList.contains(gl.class_adjacent)) {
                    td.classList.remove(gl.class_adjacent);
                    if (begda < curda) {
                        td.classList.add(gl.class_redeemed);
                    } else {
                        td.classList.add(gl.class_reserved);
                    }
                } else {
                    td.classList.remove(gl.class_redeemed);
                    td.classList.remove(gl.class_reserved);
                }
                td.innerHTML = ''; //FIX: memory leak
                begda.setDate(begda.getDate() + 1);
            }
            // calendar end

            // book begin
            var tr = document.querySelector('.book > tbody > tr#N' + wa.id);
            tr.parentNode.removeChild(tr);
            if (this.isEmptyBook(wa.room)) {
                tr = document.querySelector('#calendar > tbody > tr#R' + wa.room + '-book');
                tr.parentNode.removeChild(tr);
            }
            // book end
        }
    }

    updEntry(oldData, newData) {

        this.delGuest(oldData);
        var year = document.getElementById('year').innerHTML,
            monthName = document.getElementById('month').innerHTML,
            month = gl.monthNames.indexOf(monthName);
        this.addGuest(year, month, newData)

        // book sort begin
        var tr = document.querySelectorAll('#R' + newData[0].room + '-book > td > .book > tbody > tr'),
            pos = [];
        for (let i = 0; i < tr.length; i++) {
            pos.push({
                id: parseInt(tr[i].children[0].innerHTML, 10),
                pos: i
            });
        }

        pos.sort(function (a, b) {
            return a.id - b.id;
        });

        var prevRow = document.querySelector('#R' + newData[0].room + '-book tr#N' + pos[0].id);
        for (let i = 0; i < (pos.length - 1); i++) {
            if (pos[i].pos > pos[i + 1].pos) {
                var curRow = document.querySelector('#R' + newData[0].room + '-book tr#N' + pos[i].id),
                    nextRow = document.querySelector('#R' + newData[0].room + '-book tr#N' + pos[i + 1].id);
                nextRow.parentNode.insertBefore(nextRow, curRow);
            }
            prevRow = document.querySelector('#R' + newData[0].room + '-book tbody tr#N' + pos[i].id);
        }
        // book sort end
    }

    _setData(data) {
        this.data = data;
    }

    _getData() {
        return this.data;
    }

    _setMonth(month) {
        document.getElementById('month').innerHTML = month;
    }

    _getMonth() {
        var month = gl.monthNames.indexOf(document.getElementById('month').innerHTML);
        month = utils.overlay(month, '0', 2)
        return {
            name: document.getElementById('month').innerHTML,
            num: month,
        }
    }

    _setYear(year) {
        document.getElementById('year').innerHTML = year;
    }

    _get_year() {
        return document.getElementById('year').innerHTML;
    }

    _prepare(year, month) {

        var monthName = utils.getMonthName(month),
            days = new Date(year, month, 0).getDate();

        //FIX: innerHTMl memory leak
        // thead begin
        //  --- чистим
        //  --- --- тело
        document.querySelector('#calendar > tbody').innerHTML = "";
        // ---- --- дни месяца
        var trdays = document.getElementById('calendar-row-days'),
            childs = trdays.children.length;
        for (let i = 0; i < childs; i++) {
            try {
                trdays.deleteCell(0);
            } catch (e) {}
        }
        //  --- --- название месяца
        document.getElementById('month').innerHTML = "";
        //  --- --- год
        document.getElementById('year').innerHTML = "";

        //  --- добавляем
        //  --- --- год
        document.getElementById('year').innerHTML = year;
        //  --- --- название месяца
        var td = document.getElementById('calendar-row-buttons').getElementsByTagName('td')[0];
        td.setAttribute('colspan', days + 1);
        document.getElementById('month').innerHTML = monthName;
        document.getElementById('month').value = monthName;
        //  --- --- дни месяца
        for (let i = 0; i <= days; i++) {
            var th = document.createElement('th');
            if (i == 0) {
                th.classList.add('blank-cell');
            } else {
                let day = utils.overlay(i, '0', 2),
                    date = year + '-' + utils.overlay(month, '0', 2) + '-' + day;
                th.setAttribute('id', 'D' + date)
                th.appendChild(document.createTextNode(i));
            }
            trdays.appendChild(th);
        }

        //  tbody begin
        var tbody = document.querySelector('#calendar > tbody');
        for (let i = 0; i < gl.rooms.length; i++) {
            var room = gl.rooms[i].room,
                tr = document.createElement('tr');
            tr.setAttribute('id', 'R' + room);
            for (let j = 0; j < days + 1; j++) {
                var node;
                if (0 == j) {
                    node = document.createElement('th');
                    node.appendChild(document.createTextNode(room));
                } else {
                    let day = utils.overlay(j, '0', 2),
                        date = year + '-' + utils.overlay(month, '0', 2) + '-' + day;
                    node = document.createElement('td');
                    node.setAttribute('id', 'RD' + room + '_' + date);
                    node.appendChild(document.createTextNode(""));
                }
                tr.appendChild(node);
            }
            tbody.append(tr);
        }
    }

    _isEmptyBook(room) {
        return !document.querySelector('#R' + room + '-book tbody').childElementCount;
    }

    _setDelegate(eventName, qsParent, qsChild, qsClosestExcl, callback) {

        var parent = document.querySelector(qsParent),
            that = {
                parent: parent,
                qsParent: qsParent,
                qsChild: qsChild,
                qsClosestExcl: qsClosestExcl,
                callback: callback
            };

        parent.addEventListener(eventName, function delegateListener(e) {
            var target = e.target;
            if (this.qsClosestExcl) if (target.closest(this.qsClosestExcl)) return;
            var childs = this.parent.querySelectorAll(this.qsChild);
            if (Array.from(childs).indexOf(target) != -1) return this.callback.call(e, e);
            for (var child of childs) {
                if (child.contains(target)) return this.callback.call(e, e);
            }
        }.bind(that));
    }
}

class SelectionGroup {

    constructor() {
        this.classId = undefined;
    }
    
    /**
     * Очистка ID текущего обрабатываемого класса
     */
    static free() {

        this.classId = undefined;
    }

    /**
     * Формирование ID нового класса
     */
    static gen() {

        this.classId = 'sel-group-' + Math.ceil((Math.random() * 100000));
    }

    /**
     * Добавление класса к объекту.
     * Если ID класса не сформирован то перед добавление будет вызван метод формирующий ID класса
     */
    static add(target) {

        !this.classId && this.gen();
        target.classList.add(this.classId);
        this.enum(this.classId);
    }

    /**
     * Поиск ID класса присвоенного объекту с последующим удалением и пересчетом оставшихся элементов 
     * которым присвоей этот ID
     */
    static del(target) {

        if (target.className === '') return;
        var classId = target.className.split(' ').filter(function (el) {
            return el.match(/\bsel-group-\d+/);
        }).toString();
        if (classId !== '') {
            var group = document.getElementsByClassName(classId);
            //FIX: inner html memory leak
            for (let i = group.length; i > 0; i--) {
                if (group[0].id == target.id) {
                    group[0].innerHTML = '';
                    group[0].classList.remove(gl.class_selected);
                    group[0].classList.remove(classId);
                    break;
                } else {
                    group[0].innerHTML = '';
                    group[0].classList.remove(gl.class_selected);
                    group[0].classList.remove(classId);
                }
            }
            target.classList.remove(classId);
            target.innerHTML = '';
            this.enum(classId);
        }
    }

    /**
     * Пересчет кол-ва объектов класса по ID класса 
     */
    static enum(classId) {

        var group = document.getElementsByClassName(classId);
        for (let i = 0; i < group.length; i++) {
            //FIX: inner html memory leak
            group[i].innerHTML = (i + 1);
        }
    }
}