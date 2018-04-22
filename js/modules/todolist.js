/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

'use strict';

class ToDoList extends RootModule {
    constructor() {
        super();

        this.dataAttr = { status: { initial: 'initial', edited: 'edited', finished: 'finished' } };

        this.cb = {

            notes: {
                add: (e, note) => { // FIX  првоерить порядок входных переменных. по идее должно быть наоборот

                    const S = this.status;

                    let tbody = document.querySelector('#todo #todo-notes table tbody');
                    !note && (note = { unid: 0, text: '', status: S.initial });
                    let isEditable = (note.status === S.initial || note.status === S.edited) ? 'true' : 'false';

                    // FIX  заюзать либу для control-el. убрать отсюда dom
                    let tree =
                        [{ tag: 'tr', class: 'note-data-row data-row', attr: { 'data-status': note.status, 'data-unid': note.unid } },
                            { tag: 'td', class: 'note-data-cell data-cell', attr: { 'contenteditable': isEditable }, textNode: note.text },
                            [ { tag: 'td', class: 'td-zero-size', attr: { 'contenteditable': 'false' } },
                                /*
                                [{ tag: 'div', class: 'control-wrapper' },
                                    [{ tag: 'div', class: 'control-container' },
                                        { tag: 'span', class: 'control-el action-1', textNode: '' },
                                        { tag: 'span', class: 'control-el action-2', textNode: '' },
                                        { tag: 'span', class: 'control-el action-3', textNode: '' }
                                    ]
                                ]
                                */
                            ]
                        ];
                    tree = new DOMTree(tree).cultivate();
                    tree.querySelector('.td-zero-size').appendChild(new ControlContainer());
                    tbody.appendChild(tree);
                },

                operate: async function (operation, e) {
                    // TODO  сократить код. объеденить s и f
                    let self = this,
                        status = this.status,
                        row = e.target.closest('.note-data-row'),
                        textCell = row.querySelector('.note-data-cell'),
                        unid = row.dataset.unid,
                        nt001 = new NT001(),
                        data, result;

                    nt001.entity = new Note({ unid: parseInt(unid) });
                    try { result = await nt001.load(); } catch (e) { return; }
                    data = result.length ? result[0] : { unid: '', status: row.dataset.status || '' };

                    switch (operation) {

                        case 's':
                            if (data.unid) {
                                if (data.status === status.finished) break;
                                nt001.entity = new Note({ unid: unid, text: textCell.innerText, stat: status.initial});
                                try { result = await nt001.save(); } catch (e) { break; }
                                row.dataset.status = status.initial;
                            } else {
                                nt001.entity = new Note({ text: textCell.innerText, stat: status.initial });
                                try { result = await nt001.save(); } catch (e) { break; }
                                row.dataset.unid = result;
                                row.dataset.status = status.initial;
                                row.setAttribute('contenteditable', 'true');
                            }
                            break;

                        case 'f':
                            let st = (data.status === status.finished) ? status.initial : status.finished;
                            row.dataset.status = st;
                            textCell.setAttribute('contenteditable', (st === status.finished) ? 'false' : 'true');

                            if (data.unid) {
                                nt001.entity = new Note({ unid: unid, text: textCell.innerText, stat: st});
                                try { result = await nt001.save(); } catch (e) { break; }
                            } else {
                                nt001.entity = new Note({ text: textCell.innerText, stat: status.initial });
                                try { result = await nt001.save(); } catch (e) { break; }
                                row.dataset.unid = result;
                                row.dataset.status = st;
                                row.setAttribute('contenteditable', (st === status.finished ? 'false' : 'true'));
                            }
                            break;

                        case 'd':
                            if (data.unid) {
                                nt001.entity = new Note({ unid: unid });
                                try { result = await nt001.delete(); } catch (e) { break; }
                            }
                            row.parentNode.removeChild(row);
                            break;

                        default: break;
                    }
                    row && self.sort(row.parentNode);
                },
            },

            tasks: {
                add: (e, task) => {
                    const S = this.status;

                    let tbody = document.querySelector('#todo #todo-tasks table tbody');
                    !task && (task = { unid: 0, text: '', status: S.initial, planned: '' });
                    task.datetime = task.planned ? new Date(task.planned).format('dd.mm.yyyy HH:MM') : '';
                    let isEditable = (task.status === S.initial || task.status === S.edited) ? 'true' : 'false';

                    // FIX  заюзать либу для control-el. убрать отсюда dom
                    let tree =
                        [{ tag: 'tr', class: 'task-data-row data-row', attr: { 'data-unid': task.unid, 'data-status': task.status, 'data-planned': task.planned } },
                            { tag: 'td', class: 'task-data-cell data-cell text-data-cell', attr: { 'contenteditable': isEditable }, textNode: task.text },
                            { tag: 'td', class: 'task-data-cell data-cell date-data-cell', attr: { 'contenteditable': 'false' }, textNode: task.datetime, events: [{ name: 'click', fn: this.cb.tasks.dateTimePicker, bind: this }] },
                            [ { tag: 'td', class: 'td-zero-size', attr: { 'contenteditable': 'false' } },
                                /*
                                [{ tag: 'div', class: 'control-wrapper' },
                                    [{ tag: 'div', class: 'control-container' },
                                        { tag: 'span', class: 'control-el action-1', textNode: '' },
                                        { tag: 'span', class: 'control-el action-2', textNode: '' },
                                        { tag: 'span', class: 'control-el action-3', textNode: '' }
                                    ]
                                ]
                                */
                            ]
                        ];
                    tree = new DOMTree(tree).cultivate();
                    tree.querySelector('.td-zero-size').appendChild(new ControlContainer());
                    tbody.appendChild(tree);
                },

                operate: (operation, e) => { /* `unid` `text` `status` `planned` `created` `user` */
                    let self = this,
                        table = 'tasks',
                        row = e.target.closest('.task-data-row'),
                        textCell = row.querySelector('.text-data-cell'),
                        dateCell = row.querySelector('.date-data-cell'),
                        formattedDateTime = UTILS.PARSE_DATE(dateCell.innerText).format.en,
                        date = dateCell.innerText ? new Date(formattedDateTime).getTime() : 0,
                        unid = row.dataset.unid,
                        insert, select, update, del;

                    const S = this.status;

                    (async () => {
                        try { select = await new Select('', { types: 'i', param: [parseInt(unid)] }).select('*').from(table).where(`unid = ?`).connect(); } catch (e) { }
                        let data = select.data.length ? select.data[0] : { unid: '', status: row.dataset.status || '' };

                        switch (operation) {

                            case 's':
                                (async () => {
                                    if (data.unid) {
                                        try {
                                            if (data.status === S.finished) return;
                                            let opts = { types: 'ssii', param: [textCell.innerText, S.initial, date, unid] } ;
                                            update = await new Update('', opts).update(table).set('text=?,status=?,planned=?').where('unid=?').connect();
                                            if (!update.affectedRows && !update.status) return;
                                            row.dataset.status = S.initial;
                                        } catch (e) { }
                                    } else {
                                        try {
                                            let opts = { types: 'ssi', param: [textCell.innerText, S.initial, date] };
                                            insert = await new Insert('', opts).into(`${table}(text,status,planned,user)`).values('(?,?,?,?)').connect(1);
                                            if (!insert.affectedRows) return;
                                            select = await new Select('', { types: 'i', param: [insert.insertId] }).select('*').from(table).where(`unid = ?`).connect();
                                            if (!select.affectedRows) return;
                                            data = select.data[0];
                                            row.dataset.unid = data.unid;
                                            row.dataset.status = data.status;
                                            row.dataset.planned = data.planned;
                                            row.setAttribute('contenteditable', 'true');
                                        } catch (e) { }
                                    }
                                })();
                                break;

                            case 'f':
                                let status = (data.status === S.finished) ? S.initial : S.finished;
                                row.dataset.status = status;
                                textCell.setAttribute('contenteditable', (status === S.finished) ? 'false' : 'true');
                                (async () => {
                                    if (data.unid) {
                                        let opts = { types: 'ssii', param: [textCell.innerText, status, date, unid] };
                                        try { update = await new Update('', opts).update(table).set('text=?,status=?,planned=?').where('unid=?').connect(); } catch (e) { }
                                    } else {
                                        try {
                                            let opts = { types: 'ssi', param: [textCell.innerText, row.dataset.status, date] };
                                            insert = await new Insert('', opts).into(`${table}(text,status,planned,user)`).values('(?,?,?,?)').connect(1);
                                            if (!insert.affectedRows) return;
                                            select = await new Select('', { types: 'i', param: [insert.insertId] }).select('*').from(table).where(`unid = ?`).connect();
                                            if (!select.affectedRows) return;
                                            data = select.data[0];
                                            row.dataset.unid = data.unid;
                                            row.dataset.status = data.status;
                                            row.dataset.planned = data.planned;
                                            row.setAttribute('contenteditable', (data.status === S.finished ? 'false' : 'true'));
                                        } catch (e) { }
                                    }
                                })();
                                break;

                            case 'd':
                                if (data.unid) {
                                    (async () => {
                                        try { del = await new Delete('', { types: 'i', param: [unid] }).from(table).where('unid=?').connect(); } catch (e) { }
                                        if (del.affectedRows) { row.parentNode.removeChild(row); }
                                    })();
                                } else {
                                    row.parentNode.removeChild(row);
                                }
                                break;

                            default: break;
                        }
                        self.sort(row.parentNode);
                    })();
                },

                dateTimePicker(e) {
                    let self = this,
                        row = e.target.closest('.task-data-row'),
                        planned, select, data, opts;

                    const S = this.status;

                    (async () => {
                        opts = { types: 'i', param: [parseInt(row.dataset.unid)] };
                        try {
                            select = await new Select('', opts).select('*').from('tasks').where(`unid=?`).connect();
                        } catch (e) {}
                        data = select.data.length ? select.data[0] : { unid: '', status: row.dataset.status || '' };
                        if (data.status === S.finished) return;
                        try {
                            planned = await new DateTimePicker(e.target, e.target, { promise: true, format: 'd.m.Y h:i' }).getPromise();
                        } catch (e) {
                            return;
                        }
                        row.dataset.status = S.edited;
                        row.dataset.planned = planned;
                        row.querySelector('td.date-data-cell').innerText = new Date(planned).format('dd.mm.yyyy HH:MM');
                    })();
                }
            },

            event: {
                input: function(e) { e.target.closest('tr').dataset.status = this.status.edited; },
                finish: function(e) {
                    let unid = e.detail.data;
                    if (!unid) return;
                    let row = document.getElementById('todo').querySelector(`#todo-tasks table tbody tr[data-unid='${unid}']`);
                    row.dataset.status = this.status.finished;
                    self.sort(row.parentNode);
                },
                delay: function(e) {
                    let data = e.detail.data;
                    if (!data.unid) return;
                    let task = document.getElementById('todo').querySelector(`#todo-tasks table tbody tr[data-unid='${data.unid}']`);
                    task.dataset.planned = data.planned;
                    task.querySelector('td.date-data-cell').innerText = new Date(data.planned).format('dd.mm.yyyy HH:MM');
                },
                delete: function(e) {
                    let unid = e.detail.data;
                    if (!unid) return;
                    let task = document.getElementById('todo').querySelector(`#todo-tasks table tbody tr[data-unid='${unid}']`);
                    task.parentElement.removeChild(task);
                }
            }
        }
    }
    bind(target) {
        super.bind(target);

        let tree = [{ tag: 'div', unid: 'todo' },
            [{ tag: 'div', unid: 'todo-notes', class: 'todo-container' },
                [{ tag: 'table', },
                    [{ tag: 'thead' },
                        [{ tag: 'tr' },
                            [{ tag: 'td' },
                                { tag: 'label', textNode: 'Заметки' }
                            ]
                        ]
                    ],
                    [{ tag: 'tfoot' },
                        [{ tag: 'tr' },
                            [{ tag: 'td' },
                                { tag: 'button', class: 'button', type: 'button', textNode: 'Добавить', events: [{ name: 'click', fn: this.cb.notes.add, bind: this }] }
                            ]
                        ]
                    ],
                    { tag: 'tbody' }
                ]
            ],
            [{ tag: 'div', unid: 'todo-tasks', class: 'todo-container' },
                [{ tag: 'table', },
                    [{ tag: 'thead' },
                        [{ tag: 'tr' },
                            [{ tag: 'td' },
                                { tag: 'label', textNode: 'Задачи' }
                            ]
                        ]
                    ],
                    [{ tag: 'tfoot' },
                        [{ tag: 'tr' },
                            [{ tag: 'td' },
                                { tag: 'button', class: 'button', type: 'button', textNode: 'Добавить', events: [{ name: 'click', fn: this.cb.tasks.add, bind: this }] }
                            ]
                        ]
                    ],
                    { tag: 'tbody' }
                ]
            ]
        ];
        tree = new DOMTree(tree).cultivate();
        if (tree) target.appendChild(tree);
        else console.log('tree is ' + tree);

        const S = this.status;
        let qsParent, qsChild, qsParentExcl;

        qsParent = '#todo #todo-notes table tbody'; qsChild = 'tr td .control-el.action-1'; qsParentExcl = [`tr[data-status='${S.initial}']`, `tr[data-status='${S.finished}']`];
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.notes.operate.bind(this, 's'));

        qsParent = '#todo #todo-notes table tbody'; qsChild = `tr td .control-el.action-2`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.notes.operate.bind(this, 'f'));

        qsParent = '#todo #todo-notes table tbody'; qsChild = `tr td .control-el.action-3`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.notes.operate.bind(this, 'd'));

        qsParent = '#todo #todo-tasks table tbody'; qsChild = 'tr td .control-el.action-1'; qsParentExcl = [`tr[data-status='${S.initial}']`, `tr[data-status='${S.finished}']`];
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.tasks.operate.bind(this, 's'));

        qsParent = '#todo #todo-tasks table tbody'; qsChild = `tr td .control-el.action-2`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.tasks.operate.bind(this, 'f'));

        qsParent = '#todo #todo-tasks table tbody'; qsChild = `tr td .control-el.action-3`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.tasks.operate.bind(this, 'd'));

        qsParent = '#todo #todo-notes table tbody'; qsChild = `tr td`; qsParentExcl = [`tr[data-status='${S.edited}']`];
        UTILS.SET_DELEGATE('input', qsParent, qsChild, qsParentExcl, this.cb.event.input.bind(this));

        qsParent = '#todo #todo-tasks table tbody'; qsChild = `tr td`; qsParentExcl = [`tr[data-status='${S.edited}']`];
        UTILS.SET_DELEGATE('input', qsParent, qsChild, qsParentExcl, this.cb.event.input.bind(this));
    }

    init() {
        super.init();

        let self = this,
            todo = document.getElementById('todo')
            nt001 = new NT001(),
            ts001 = new TS001(),
            e = GL.CONST.EVENTS.TODOLIST;

        EVENT_BUS.register(e.FINISH, self.cb.event.finish.bind(this));
        EVENT_BUS.register(e.DELAY, self.cb.event.delay.bind(this));
        EVENT_BUS.register(e.DELETE, self.cb.event.delete.bind(this));

        (async () => {
            try { nt001 = await nt001.load(); } catch (e) { return; }
            try { ts001 = await ts001.load(); } catch (e) { return; }

            nt001.forEach(note => { self.cb.notes.add(null, note); });
            ts001.forEach(task => { self.cb.tasks.add(null, task); });

            self.sort(todo.querySelector(`#todo-notes table tbody`));
            self.sort(todo.querySelector(`#todo-tasks table tbody`));

            this.finishDataLoad();
        })();
    }

    sort(tbody) {
        let nodeList = tbody.querySelectorAll('tr');
        let nodes = [];
        nodeList.forEach(tr => { nodes.push({ unid: tr.dataset.unid, status: tr.dataset.status, node: tr }); });
        nodes.sort((a, b) => {
            if (a.status === b.status) {
                return parseInt(a.unid) < parseInt(b.unid) ? -1 : 1;
            } else if (a.status === 'finished') {
                return 1;
            } else {
                return -1;
            }
        });
        nodes.forEach(node => { tbody.appendChild(node.node); });
    }

    beginDataLoad() { super.beginDataLoad(); }
    finishDataLoad() { super.finishDataLoad(); }
}