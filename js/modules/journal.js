/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

'use strict';

class Journal extends RootModule {

    constructor() {
        super();

        this.selection;

        this.dataAttr = {
            view: { fix: 'fix', hov: 'hov' },
            status: { selected: 'selected', /*выделен*/ reserved: 'reserved', /*зарезервирован*/ adjacent: 'adjacent', /*смежный*/ redeemed: 'redeemed', /*выкуплен*/ }
        };

        this.cb = {

            rcm: {

                actA: async function (a, e) {
                    let self = this,
                        rooms = [],
                        year = document.getElementById('journal').dataset.year,
                        month = document.getElementById('journal').dataset.month,
                        gl001 = new GL001(),
                        pb001 = new PB001(),
                        title, guestCard, result, rm001, guest, opts;

                    try { rm001 = await new RM001().load(); } catch (e) { return; }
                    rm001.forEach(el => { rooms.push(new Room(el)); });

                    title = (a === 0) ? GL.CONST.LOCALIZABLE.VAR003.ADD : GL.CONST.LOCALIZABLE.VAR003.UPDATE;

                    opts = { intent:'add', title:title, isReadOnly:false, isStrict:true, month:month, year:year, rooms:rooms };
                    guestCard = new GuestCard(opts).bind().setVal(new Guest(e.detail.data)).show();
                    try { result = await guestCard.promise(); } catch (e) { return; }
                    guest = new Guest(result);
                    gl001.entity = guest;

                    if (a === 0) {
                        try { await gl001.save(); } catch (e) { return; }
                        self.mapping(guest);
                    } else {
                        try { await gl001.update(); } catch (e) { return; }
                        self.change(guest);
                    }

                    (async () => {
                        if (a !== 0) return;
                        pb001.entity = new Person(guest);
                        try { result = await pb001.check(); } catch (e) { return; }
                        if (result) return;
                        pb001.save();
                        EVENT_BUS.dispatch(GL.CONST.EVENTS.CONTACT.NEW, pb001.entity);
                    })();
                },

                actB: function (e) {
                    let self = this,
                    gl001 = new GL001(),
                    guest = new Guest({ unid: e.detail.data.unid }),
                    confirmDialog, result, opts;

                    opts = { intent: 'del', title: GL.CONST.LOCALIZABLE.VAR003.DELETE, text: UTILS.FORMAT(GL.CONST.LOCALIZABLE.MSG001, { 1: guest.unid }), };
                    confirmDialog = new ConfirmDialog(opts).bind().show();

                    (async () => {
                        try { await confirmDialog.promise(); } catch (e) { return; }
                        gl001.entity = guest;
                        try { await gl001.delete(); } catch (e) { return; }
                        self.remove(guest.unid);
                    })();
                }
            },

            cell: {

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

                        const ATTR = this.dataAttr;

                        (function toggleSelection() {
                            switch (target.dataset.status) {
                                case undefined:
                                    self.selection = CellSelection.add(target);
                                    break;

                                case ATTR.status.selected:
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
                                document.querySelectorAll(`#journal #journal-tbody [data-unid='${id}']`).forEach(el => {
                                    el.dataset.view = (el.dataset.view === ATTR.view.hov) ? ATTR.view.fix : ATTR.view.hov;
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
                     */
                    async function rightMouse() {
                        let room = target.dataset.room,
                            date = target.dataset.date,
                            opts = { types: 'sss', param: [date, date, room] },
                            select, isAvailableButton, guest;

                        try { select = await new Select('', opts).select('*').from('gl001').where(`dbeg <= ? AND dend >= ? AND room = ?`).connect(); } catch (e) { return; }
                        if (select.data[0]) {
                            guest = new Guest(select.data[0]);
                            isAvailableButton = false;
                        } else {
                            guest = new Guest();
                            (() => {
                                guest.room = room;
                                if (!target.dataset.selection) return;
                                guest.dbeg = CellSelection.getGroup(target.dataset.selection, 'F').dataset.date;
                                guest.dend = CellSelection.getGroup(target.dataset.selection, 'L').dataset.date;
                            })();
                            isAvailableButton = true;
                        }
                        opts = { item: { upd: !isAvailableButton, del: !isAvailableButton, add: isAvailableButton }, x: e.pageX, y: e.pageY, guest };
                        new RCMenu(opts).bind().show();
                    }
                },

                mouseOver: function mouseover(e) {

                    let self = this,
                        target = e.target;

                    const ATTR = self.dataAttr;

                    (function toggleSelection() {
                        if (!GL.DATA.CORE.isMouseDown) return;
                        if (target.dataset.status !== ATTR.status.selected && target.dataset.status !== undefined) return;
                        self.selection ? CellSelection.add(target, self.selection) : CellSelection.del(target);
                    })();

                    (function toggleView() {
                        let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                        for (let id of ids) {
                            document.querySelectorAll(`#journal #journal-tbody [data-unid='${id}']`).forEach(el => {
                                if (el.dataset.view === ATTR.view.fix) return;
                                el.dataset.view = ATTR.view.hov;
                            });
                        }

                        let date = target.dataset.date;
                        if (!date) { return; }
                        document.querySelector(`#journal #journal-thead #days #D${date}`).dataset.view = ATTR.view.hov;
                    })();
                },

                mouseOut: function mouseout(e) {

                    let self = this,
                        target = e.target;

                    const ATTR = self.dataAttr;

                    (function toggleView() {
                        let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                        for (let id of ids) {
                            document.querySelectorAll(`#journal #journal-tbody [data-unid='${id}']`).forEach(el => {
                                (el.dataset.view === ATTR.view.hov) && el.removeAttribute('data-view');
                            });
                        }

                        let date = target.dataset.date;
                        if (!date) { return; }
                        document.querySelector(`#journal #journal-thead #days #D${date}`).removeAttribute('data-view');
                    })();
                },

                mouseUp: function mouseup(e) {

                    this.selection = '';
                    GL.DATA.CORE.isMouseDown = false;
                },
            },

            row: {

                mouseDown: function mousedown(e) {

                    let target = e.target;

                    const ATTR = this.dataAttr;

                    target.dataset.view = target.dataset.view == ATTR.view.fix ? '' : ATTR.view.fix;
                    try { document.querySelector(`#${target.parentNode.id}-records`).classList.toggle('visible') } catch (e) { }
                },
            },

            record: {

                mouseDown: function mousedown(e) {
                    let self = this,
                        target = e.target.closest('.record');

                    if (!target) return;

                    const ATTR = self.dataAttr;

                    switch (e.which) {
                        case 1: leftMouse(); return;
                        case 3: rightMouse(); return;
                        default: return;
                    }

                    function leftMouse() {
                        let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                        for (let id of ids) {
                            document.querySelectorAll(`#journal #journal-tbody [data-unid='${id}']`).forEach(el => {
                                el.dataset.view = (el.dataset.view === ATTR.view.hov) ? ATTR.view.fix : ATTR.view.hov;
                            });
                        }
                    }

                    async function rightMouse() {
                        let guest = new Guest({ unid: target.dataset.unid }),
                            gl001 = new GL001();
                        gl001.entity = guest;
                        try { guest = await gl001.load(); } catch (e) { return; }
                        new RCMenu({ item: { upd: true, del: true, add: false }, x: e.pageX, y: e.pageY, guest }).bind().show();
                    }
                },

                mouseOver: function mouseover(e) {
                    let self = this,
                        target = e.target.closest('.record');

                    if (!target) return;

                    const ATTR = self.dataAttr;

                    let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                    for (let id of ids) {
                        document.querySelectorAll(`#journal #journal-tbody [data-unid='${id}']`).forEach(el => {
                            if (el.dataset.view === ATTR.view.fix) return;
                            el.dataset.view = ATTR.view.hov;
                        });
                    }
                },

                mouseOut: function mouseout(e) {
                    let self = this,
                        target = e.target.closest('.record');

                    if (!target) return;

                    const ATTR = self.dataAttr;

                    let ids = target.dataset.unid ? target.dataset.unid.split(',') : [];
                    for (let id of ids) {
                        document.querySelectorAll(`#journal #journal-tbody [data-unid='${id}']`).forEach(el => {
                            (el.dataset.view === ATTR.view.hov) && el.removeAttribute('data-view');
                        });
                    }
                },
            },

            control: async function(a, e) {
                let self = this,
                    journal = document.getElementById('journal');

                a = parseInt(a);

                if (a === 0) {
                    let dialog = new PickPeriod().bind().setVal({  month: journal.dataset.month, year: journal.dataset.year }).show();
                    try { dialog = await dialog.promise(); } catch (e) { return; }
                    journal.dataset.year = dialog.year;
                    journal.dataset.month = dialog.month.num;
                } else {
                    let date = new Date(journal.dataset.year, (journal.dataset.month - 1), '01');
                    date.setMonth(date.getMonth() + a);
                    journal.dataset.year = date.getFullYear();
                    journal.dataset.month = (date.getMonth() + 1);
                }

                (async () => {
                    let config = new Config({year: journal.dataset.year, moon: journal.dataset.month}),
                        cf001 = new CF001();
                    cf001.entity = config;
                    try { await cf001.update(); } catch (e) { return; }
                })();

                (async () => {
                    let gl001 = new GL001(),
                        guest = new Guest({
                            dbeg: new Date(journal.dataset.year, (journal.dataset.month - 1), 1).format('yyyy-mm-dd'),
                            dend: new Date(journal.dataset.year, journal.dataset.month, 0).format('yyyy-mm-dd')
                        }),
                        select, guests = [];
                    gl001.entity = guest;
                    try { select = await gl001.load(); } catch (e) { return; }
                    select.forEach(g => { guests.push(new Guest(g)); });
                    await self.build();
                    self.mapping(guests);
                })();

                setTimeout(() => { EVENT_BUS.dispatch(GL.CONST.EVENTS.DIAGRAM.UPD, {}); }, 0);
            }
        };
    }

    bind (target) {
        super.bind(target);

        let tree =
            [{ tag: 'table', id: 'journal' },
                [{ tag: 'thead', id: 'journal-thead' },
                    [{ tag: 'tr', class: 'control-row' },
                        [{tag: 'td'},
                            [{ tag: 'table' },
                                [{ tag: 'tr' },
                                    [{ tag: 'td' },
                                        { tag: 'span', class: 'button prev', events: [{ name: 'click', fn: this.cb.control.bind(this, -1) }] },
                                    ],
                                    [{ tag: 'td' },
                                        { tag: 'span', class: 'button pick', events: [{ name: 'click', fn: this.cb.control.bind(this, 0) }] },
                                    ],
                                    [{ tag: 'td' },
                                        { tag: 'span', class: 'button next', events: [{ name: 'click', fn: this.cb.control.bind(this, 1) }] },
                                    ],
                                ],
                            ],
                        ],
                    ],
                    [{ tag: 'tr', id: 'days' },
                        { tag: 'td' },
                    ],
                ],
                { tag: 'tbody', id: 'journal-tbody' }
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) target.appendChild(tree);
        else console.log('tree is ' + tree);

        const L = this.cb;
        let qsParent, qsChild, qsParentExcl;

        qsParent = '#journal #journal-tbody'; qsChild = 'tr td'; qsParentExcl = '.records-wrapper';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, L.cell.mouseDown.bind(this));
        UTILS.SET_DELEGATE('mouseover', qsParent, qsChild, qsParentExcl, L.cell.mouseOver.bind(this));
        UTILS.SET_DELEGATE('mouseout', qsParent, qsChild, qsParentExcl, L.cell.mouseOut.bind(this));
        UTILS.SET_DELEGATE('mouseup', qsParent, qsChild, qsParentExcl, L.cell.mouseUp.bind(this));

        qsParent = '#journal #journal-tbody'; qsChild = 'tr > th'; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, L.row.mouseDown.bind(this));

        qsParent = '#journal #journal-tbody'; qsChild = 'table.records-container'; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, L.record.mouseDown.bind(this));
        UTILS.SET_DELEGATE('mouseover', qsParent, qsChild, qsParentExcl, L.record.mouseOver.bind(this));
        UTILS.SET_DELEGATE('mouseout', qsParent, qsChild, qsParentExcl, L.record.mouseOut.bind(this));

        const E = GL.CONST.EVENTS.JOURNAL;
        EVENT_BUS.register(E.RC_MENU.ADD, L.rcm.actA.bind(this, 0));
        EVENT_BUS.register(E.RC_MENU.DEL, L.rcm.actB.bind(this));
        EVENT_BUS.register(E.RC_MENU.UPD, L.rcm.actA.bind(this, 1));
    }

    async init() {
        super.init();

        let self = this,
            gl001 = new GL001(),
            cf001 = new CF001(),
            guests = [];

        try { cf001 = await cf001.load(); } catch (e) { return; }
        document.getElementById('journal').dataset.year = cf001.year;
        document.getElementById('journal').dataset.month = cf001.moon;

        gl001.entity = new Guest({ dbeg: new Date(cf001.year, (cf001.moon - 1), 1).format('yyyy.mm.dd'), dend: new Date(cf001.year, cf001.moon, 0).format('yyyy.mm.dd') });
        try { gl001 = await gl001.load(); } catch (e) { return; }
        gl001.forEach(g => { guests.push(new Guest(g)); });
        await self.build();
        self.mapping(guests);

        this.finishDataLoad();
    }

    async build() {

        return new Promise((resolve, reject) => {
            let self = this,
                journal = document.getElementById('journal'),
                ds      = journal.dataset,
                tbody   = journal.querySelector('#journal-tbody'),
                daysRow = journal.querySelector('#days'),
                days    = new Date(ds.year, ds.month, 0).getDate(),
                rm001   = new RM001(),
                rooms   = [];

            (() => {
                if (tbody) while (tbody.hasChildNodes()) tbody.removeChild(tbody.firstChild);
                if (daysRow) while (daysRow.hasChildNodes()) daysRow.removeChild(daysRow.firstChild);
            })();

            (() => {
                document.querySelector('#journal .control-row td').setAttribute('colspan', (1 + days));
                journal.querySelector('#journal .control-row .pick').innerText = new Date(ds.year, (ds.month - 1)).toLocaleString(GL.CONST.LOCALE, { month: "long" });
            })();

            (() => {
                for (let day = 0; day <= days; day++) {
                    let th = document.createElement('th');
                    if (day === 0) {
                        th.classList.add('blank-cell');
                    } else {
                        th.id = `D${ds.year}-${UTILS.OVERLAY(ds.month, '0', 2)}-${UTILS.OVERLAY(day, '0', 2)}`;
                        th.appendChild(document.createTextNode(day));
                    }
                    daysRow.appendChild(th);
                }
            })();

            (async () => {
                try { rm001 = await rm001.load(); } catch (e) { return; }
                rm001.forEach(el => { rooms.push(new Room(el)); });

                for (let room of rooms) {
                    let tr = document.createElement('tr');
                    tr.id = `R${room.room}`;
                    for (let day = 0; day <= days; day++) {
                        let node;
                        if (day === 0) {
                            node = document.createElement('th');
                            node.appendChild(document.createTextNode(room.room));
                        } else {
                            let date = new Date(ds.year, (ds.month - 1), day).format('yyyy-mm-dd');
                            node = document.createElement('td');
                            node.id = `R${room.room}D${date}`;
                            node.dataset.room = room.room;
                            node.dataset.date = date;
                            node.appendChild(document.createTextNode(''));
                        }
                        tr.appendChild(node);
                    }
                    tbody.appendChild(tr);
                }
                resolve();
            })();

        });
    }

    mapping(entries) {

        let self = this;

        if (!Array.isArray(entries)) {
           let arr = [];
           arr.push(entries);
           entries = arr;
        }

        entries.forEach(guest => {
            setCell(guest);
            addRecord(guest);
        });

        function setCell(guest) {
            let ds = document.getElementById('journal').dataset,
                begda = new Date(guest.dbeg),
                endda = new Date(guest.dend),
                curda = new Date();

            for (let date = begda; date <= endda; date.setDate(date.getDate() + 1)) {

                if (date.getFullYear() != ds.year || (date.getMonth() + 1) != ds.month) continue;

                let cell = document.querySelector(`#journal #R${guest.room}D${date.format('yyyy-mm-dd')}`);

                (() => { CellSelection.del(cell); })();

                (() => {
                    const STATUS = self.dataAttr.status;
                    switch (cell.dataset.status) {
                        case STATUS.redeemed:
                        case STATUS.reserved:
                            cell.dataset.status = STATUS.adjacent;
                            break;

                        default:
                            cell.dataset.status = (date < curda) ? STATUS.redeemed : STATUS.reserved;
                            break;
                    }
                    let unid = cell.dataset.unid ? cell.dataset.unid.split(',') : [];
                    unid.push(guest.unid)
                    unid = unid.toString();
                    cell.dataset.unid = unid;
                })();

                (() => {
                    let balloon = cell.querySelector('.balloon-wrapper .balloon-content');
                    if (!balloon) {
                        (balloon = document.createElement('div')).classList.add('balloon-wrapper');
                        let b = document.createElement('div');
                        b.classList.add('balloon-content');
                        balloon.appendChild(b);
                        cell.appendChild(balloon);
                        balloon = cell.querySelector('.balloon-wrapper .balloon-content');
                    }

                    let tree =
                        [{ tag: 'div', class: 'balloon', attr: { 'data-balloon-unid': guest.unid } },
                            { tag: 'span', class: 'balloon-el balloon-el-name', textNode: guest.name },
                            { tag: 'span', class: 'balloon-el balloon-el-teln', textNode: guest.teln },
                            { tag: 'span', class: 'balloon-el balloon-el-fnot', textNode: guest.fnot },
                            { tag: 'span', class: 'balloon-el balloon-el-city', textNode: guest.city },
                            { tag: 'span', class: 'balloon-el balloon-el-unid', textNode: guest.unid }
                        ];

                    tree = new DOMTree(tree).cultivate();
                    balloon.appendChild(tree);
                })();
            }
        }

        function addRecord(guest) {
            let ds = document.getElementById('journal').dataset,
                days = new Date(ds.year, ds.month, 0).getDate(),
                field = new GL001().field,
                tree;

            if (!document.querySelector(`#journal R${guest.room}-records`)) {
                tree =
                    [{ tag: 'tr', id: `R${guest.room}-records`, class: 'records-wrapper' },
                        [{ tag: 'td', colspan: (1 + days) },
                            { tag: 'table', class: 'records-container' },
                        ]
                    ];
                tree = new DOMTree(tree).cultivate();
                let tr = document.querySelector(`#journal #journal-tbody tr#R${guest.room}`);
                tr.parentNode.insertBefore(tree, tr.nextSibling);
            }

            tree =
                [{ tag: 'tr', id: `N${guest.unid}`, class: 'record', attr: { 'data-unid': guest.unid } },
                    { tag: 'td', class: `person-field ${field.unid}`, textNode: guest.unid },
                    [{ tag: 'td' },
                        [{ tag: 'table', class: 'detail' },
                            [{ tag: 'tr' },
                                [{ tag: 'td', class: `person-field person-info-basic` },
                                    { tag: 'a', class: `person-field ${field.name}`, textNode: guest.name },
                                    { tag: 'a', class: `person-field ${field.teln}`, textNode: guest.teln },
                                ],
                                { tag: 'td', class: `person-field person-dates ${field.dbeg}`, attr: { 'data-date': guest.dbeg }, textNode: new Date(guest.dbeg.toString()).format('dd.mm') },
                                { tag: 'td', class: `person-field ${field.room}`, rowspan: 2, textNode: guest.room },
                                { tag: 'td', class: `person-field ${field.cost}`, textNode: guest.cost },
                            ],
                            [{ tag: 'tr' },
                                [{ tag: 'td', class: `person-field person-info-extra` },
                                    { tag: 'a', class: `person-field ${field.city}`, textNode: guest.city },
                                    { tag: 'a', class: `person-field ${field.fnot}`, textNode: guest.fnot },
                                ],
                                { tag: 'td', class: `person-field person-dates ${field.dend}`, attr: { 'data-date': guest.dend }, textNode: new Date(guest.dend.toString()).format('dd.mm') },
                                { tag: 'td', class: `person-field ${field.paid}` , textNode: guest.paid },
                            ],
                            [{ tag: 'tr', style: { display: 'none;'} },
                                { tag: 'td', class: `person-field ${field.days}`, textNode: guest.days },
                                { tag: 'td', class: `person-field ${field.base}`, textNode: guest.base },
                                { tag: 'td', class: `person-field ${field.adjs}`, textNode: guest.adjs }
                            ]
                        ]
                    ]
                ];
            tree = new DOMTree(tree).cultivate();
            document.querySelector(`#journal #R${guest.room}-records table.records-container`).appendChild(tree);
        }
    }

    remove(unid) {

        let self = this;
        const CURRENT_DATE = new Date();

        (() => {
            let record = document.querySelector(`#journal .records-container #N${unid}`);
            record.parentNode.removeChild(record);
        })();

        (() => {
            document.querySelectorAll(`#journal #journal-tbody [data-unid*='${unid}']`).forEach(el => {
                const STATUS = self.dataAttr.status;
                el.removeAttribute('data-view');
                if (el.dataset.status === STATUS.adjacent) {
                    el.dataset.status = (new Date(el.dataset.date) < CURRENT_DATE) ? STATUS.redeemed : STATUS.reserved;
                    let unids = el.dataset.unid.split(',');
                    unids.splice(unids.indexOf(unid), 1);
                    el.dataset.unid = unids.toString();
                    let balloon = el.querySelector(`#journal [data-balloon-unid='${unid}']`);
                    (balloon) && balloon.parentNode.removeChild(balloon);
                } else {
                    el.removeAttribute('data-status');
                    el.removeAttribute('data-unid');
                    while (el.hasChildNodes()) el.removeChild(el.firstChild);
                }
            });
        })();
    }

    change(guest) {

        (() => {
            this.remove(guest.unid);
            this.mapping(guest);
        })();

        (() => {
            let i = 0, pos = [];
            document.querySelectorAll(`#journal #R${guest.room}-records .record`).forEach(record => {
                pos.push({ id: parseInt(record.dataset.unid, 10), pos: i }); i++;
            });

            pos.sort((a, b) => { return a.id - b.id; });

            for (let i = 0; i < pos.length - 1; i++) {
                for (let j = 0; j < pos.length; j++) {
                    if (pos[i].pos < pos[j].pos) {
                        let curRow = document.querySelector(`#journal #R${guest.room}-records tr#N${pos[i].id}`),
                            nextRow = document.querySelector(`#journal #R${guest.room}-records tr#N${pos[j].id}`);
                        nextRow.parentNode.insertBefore(nextRow, curRow);
                    }
                }
            }
        })();
    }
}

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
        Array.prototype.slice.call(document.querySelectorAll(`#journal [data-selection='${selection}']`)).some(el => {
            el.innerText = '';
            el.removeAttribute('data-selection');
            el.removeAttribute('data-status');
            return (el.id === target.id);
        });;
        CellSelection.enum(selection);
    }

    static enum(selection) {
        let i = 1;
        document.querySelectorAll(`#journal [data-selection='${selection}']`).forEach(el => {
            while (el.hasChildNodes()) el.removeChild(el.firstChild);
            el.innerText = (i++);
        });;
    }

    static getGroup(selection, pos = 'F;L') {
        let group = document.querySelectorAll(`#journal [data-selection='${selection}']`);
        if (pos === 'F') return group[0];
        else if (pos === 'L') return group[group.length - 1];
        else return group;
    }
}