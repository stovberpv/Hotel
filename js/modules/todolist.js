/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */

(function () { 'use strict'; })();

class ToDoList extends DataWrapper {
    constructor() {
        super();

        this.cb = {

            notes: {
                add: (e, note) => {

                    const S = GL.CONST.DATA_ATTR.TODOLIST.STATUS;

                    let tbody = document.querySelector('#todo #todo-notes table tbody');
                    !note && (note = { id: 0, text: '', status: S.INITIAL });
                    let isEditable = (note.status === S.INITIAL || note.status === S.EDITED) ? 'true' : 'false';

                    let tree =
                        [{ tag: 'tr', class: 'note-data-row data-row', attr: { 'data-status': note.status, 'data-id': note.id } },
                            { tag: 'td', class: 'note-data-cell data-cell', attr: { 'contenteditable': isEditable }, textNode: note.text },
                            [ { tag: 'td', class: 'td-zero-size', attr: { 'contenteditable': 'false' } },
                                [{ tag: 'div', class: 'control-wrapper' },
                                    [{ tag: 'div', class: 'control-container' },
                                        { tag: 'span', class: 'control-el action-1', textNode: '' },
                                        { tag: 'span', class: 'control-el action-2', textNode: '' },
                                        { tag: 'span', class: 'control-el action-3', textNode: '' }
                                    ]
                                ]
                            ]
                        ];
                    tree = new DOMTree(tree).cultivate();
                    tbody.appendChild(tree);
                },

                operate: (operation, e) => {
                    let self = this,
                        row = e.target.closest('.note-data-row'),
                        textCell = row.querySelector('.note-data-cell'),
                        id = row.dataset.id,
                        insert, select, update, del;

                    const S = GL.CONST.DATA_ATTR.TODOLIST.STATUS;

                    (async () => {
                        try { select = await new Select('', { types: 'i', param: [parseInt(id)] }).select('*').from('notes').where(`id = ?`).connect(); } catch (e) { }
                        let data = select.data.length ? select.data[0] : { id: '', status: row.dataset.status || '' };

                        switch (operation) {

                            case 's':
                                (async () => {
                                    if (data.id) {
                                        try {
                                            if (data.status === S.FINISHED) return;
                                            let opts = { types: 'ssi', param: [textCell.innerText, S.INITIAL, id] };
                                            update = await new Update('', opts).update('notes').set('text=?,status=?').where('id=?').connect();
                                            if (!update.affectedRows && !update.status) return;
                                            row.dataset.status = S.INITIAL;
                                        } catch (e) { }
                                    } else {
                                        try {
                                            let opts = { types: 'ss', param: [textCell.innerText, S.INITIAL] };
                                            insert = await new Insert('', ).into('notes(text,status,user)').values('(?,?,?)').connect(1);
                                            if (!insert.affectedRows) return;
                                            select = await new Select('', { types: 'i', param: [insert.insertId] }).select('*').from('notes').where(`id = ?`).connect();
                                            if (!select.affectedRows) return;
                                            data = select.data[0];
                                            row.dataset.id = data.id;
                                            row.dataset.status = data.status;
                                            row.setAttribute('contenteditable', 'true');
                                        } catch (e) { }
                                    }
                                })();
                                break;

                            case 'f':
                                let status = (data.status === S.FINISHED) ? S.INITIAL : S.FINISHED;
                                row.dataset.status = status;
                                textCell.setAttribute('contenteditable', (status === S.FINISHED) ? 'false' : 'true');
                                (async () => {
                                    if (data.id) {
                                        let opts = { types: 'ssi', param: [textCell.innerText, status, id] };
                                        try { update = await new Update('', opts).update('notes').set('text=?,status=?').where('id=?').connect(); } catch (e) { }
                                    } else {
                                        try {
                                            let opts = { types: 'ss', param: [textCell.innerText, status] };
                                            insert = await new Insert('', opts).into('notes(text,status,user)').values('(?,?,?)').connect(1);
                                            if (!insert.affectedRows) return;
                                            select = await new Select('', { types: 'i', param: [insert.insertId] }).select('*').from('notes').where(`id = ?`).connect();
                                            if (!select.affectedRows) return;
                                            data = select.data[0];
                                            row.dataset.id = data.id;
                                            row.dataset.status = data.status;
                                            row.setAttribute('contenteditable', (data.status === S.FINISHED ? 'false' : 'true'));
                                        } catch (e) { }
                                    }
                                })();
                                break;

                            case 'd':
                                if (data.id) {
                                    (async () => {
                                        try { del = await new Delete('', { types: 'i', param: [id] }).from('notes').where('id=?').connect(); } catch (e) { }
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
            },

            tasks: {
                add: (e, task) => {
                    const S = GL.CONST.DATA_ATTR.TODOLIST.STATUS;

                    let tbody = document.querySelector('#todo #todo-tasks table tbody');
                    !task && (task = { id: 0, text: '', status: S.INITIAL, planned: '' });
                    task.datetime = task.planned ? new Date(task.planned).format('dd.mm.yyyy HH:MM') : '';
                    let isEditable = (task.status === S.INITIAL || task.status === S.EDITED) ? 'true' : 'false';

                    let tree =
                        [{ tag: 'tr', class: 'task-data-row data-row', attr: { 'data-id': task.id, 'data-status': task.status, 'data-planned': task.planned } },
                            { tag: 'td', class: 'task-data-cell data-cell text-data-cell', attr: { 'contenteditable': isEditable }, textNode: task.text },
                            { tag: 'td', class: 'task-data-cell data-cell date-data-cell', attr: { 'contenteditable': 'false' }, textNode: task.datetime, events: [{ name: 'click', fn: this.cb.tasks.dateTimePicker, bind: this }] },
                            [ { tag: 'td', class: 'td-zero-size', attr: { 'contenteditable': 'false' } },
                                [{ tag: 'div', class: 'control-wrapper' },
                                    [{ tag: 'div', class: 'control-container' },
                                        { tag: 'span', class: 'control-el action-1', textNode: '' },
                                        { tag: 'span', class: 'control-el action-2', textNode: '' },
                                        { tag: 'span', class: 'control-el action-3', textNode: '' }
                                    ]
                                ]
                            ]
                        ];
                    tree = new DOMTree(tree).cultivate();
                    tbody.appendChild(tree);
                },

                operate: (operation, e) => { /* `id` `text` `status` `planned` `created` `user` */
                    let self = this,
                        table = 'tasks',
                        row = e.target.closest('.task-data-row'),
                        textCell = row.querySelector('.text-data-cell'),
                        dateCell = row.querySelector('.date-data-cell'),
                        formattedDateTime = UTILS.PARSE_DATE(dateCell.innerText).format.en,
                        date = dateCell.innerText ? new Date(formattedDateTime).getTime() : 0,
                        id = row.dataset.id,
                        insert, select, update, del;

                    const S = GL.CONST.DATA_ATTR.TODOLIST.STATUS;

                    (async () => {
                        try { select = await new Select('', { types: 'i', param: [parseInt(id)] }).select('*').from(table).where(`id = ?`).connect(); } catch (e) { }
                        let data = select.data.length ? select.data[0] : { id: '', status: row.dataset.status || '' };

                        switch (operation) {

                            case 's':
                                (async () => {
                                    if (data.id) {
                                        try {
                                            if (data.status === S.FINISHED) return;
                                            let opts = { types: 'ssii', param: [textCell.innerText, S.INITIAL, date, id] } ;
                                            update = await new Update('', opts).update(table).set('text=?,status=?,planned=?').where('id=?').connect();
                                            if (!update.affectedRows && !update.status) return;
                                            row.dataset.status = S.INITIAL;
                                        } catch (e) { }
                                    } else {
                                        try {
                                            let opts = { types: 'ssi', param: [textCell.innerText, S.INITIAL, date] };
                                            insert = await new Insert('', opts).into(`${table}(text,status,planned,user)`).values('(?,?,?,?)').connect(1);
                                            if (!insert.affectedRows) return;
                                            select = await new Select('', { types: 'i', param: [insert.insertId] }).select('*').from(table).where(`id = ?`).connect();
                                            if (!select.affectedRows) return;
                                            data = select.data[0];
                                            row.dataset.id = data.id;
                                            row.dataset.status = data.status;
                                            row.dataset.planned = data.planned;
                                            row.setAttribute('contenteditable', 'true');
                                        } catch (e) { }
                                    }
                                })();
                                break;

                            case 'f':
                                let status = (data.status === S.FINISHED) ? S.INITIAL : S.FINISHED;
                                row.dataset.status = status;
                                textCell.setAttribute('contenteditable', (status === S.FINISHED) ? 'false' : 'true');
                                (async () => {
                                    if (data.id) {
                                        let opts = { types: 'ssii', param: [textCell.innerText, status, date, id] };
                                        try { update = await new Update('', opts).update(table).set('text=?,status=?,planned=?').where('id=?').connect(); } catch (e) { }
                                    } else {
                                        try {
                                            let opts = { types: 'ssi', param: [textCell.innerText, row.dataset.status, date] };
                                            insert = await new Insert('', opts).into(`${table}(text,status,planned,user)`).values('(?,?,?,?)').connect(1);
                                            if (!insert.affectedRows) return;
                                            select = await new Select('', { types: 'i', param: [insert.insertId] }).select('*').from(table).where(`id = ?`).connect();
                                            if (!select.affectedRows) return;
                                            data = select.data[0];
                                            row.dataset.id = data.id;
                                            row.dataset.status = data.status;
                                            row.dataset.planned = data.planned;
                                            row.setAttribute('contenteditable', (data.status === S.FINISHED ? 'false' : 'true'));
                                        } catch (e) { }
                                    }
                                })();
                                break;

                            case 'd':
                                if (data.id) {
                                    (async () => {
                                        try { del = await new Delete('', { types: 'i', param: [id] }).from(table).where('id=?').connect(); } catch (e) { }
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

                    const S = GL.CONST.DATA_ATTR.TODOLIST.STATUS;

                    (async () => {
                        opts = { types: 'i', param: [parseInt(row.dataset.id)] };
                        try {
                            select = await new Select('', opts).select('*').from('tasks').where(`id=?`).connect();
                        } catch (e) {}
                        data = select.data.length ? select.data[0] : { id: '', status: row.dataset.status || '' };
                        if (data.status === S.FINISHED) return;
                        try {
                            planned = await new DateTimePicker(e.target, e.target, { promise: true, format: 'd.m.Y h:i' }).getPromise();
                        } catch (e) {
                            return;
                        }
                        row.dataset.status = S.EDITED;
                        row.dataset.planned = planned;
                        row.querySelector('td.date-data-cell').innerText = new Date(planned).format('dd.mm.yyyy HH:MM');
                    })();
                }
            },

            event: {
                input: function(e) { e.target.closest('tr').dataset.status = GL.CONST.DATA_ATTR.TODOLIST.STATUS.EDITED; },
                finish: function(e) {
                    let id = e.detail.data;
                    if (!id) return;
                    let row = document.getElementById('todo').querySelector(`#todo-tasks table tbody tr[data-id='${id}']`);
                    row.dataset.status = GL.CONST.DATA_ATTR.TODOLIST.STATUS.FINISHED;
                    self.sort(row.parentNode);
                },
                delay: function(e) {
                    let data = e.detail.data;
                    if (!data.id) return;
                    let task = document.getElementById('todo').querySelector(`#todo-tasks table tbody tr[data-id='${data.id}']`);
                    task.dataset.planned = data.planned;
                    task.querySelector('td.date-data-cell').innerText = new Date(data.planned).format('dd.mm.yyyy HH:MM');
                },
                delete: function(e) {
                    let id = e.detail.data;
                    if (!id) return;
                    let task = document.getElementById('todo').querySelector(`#todo-tasks table tbody tr[data-id='${id}']`);
                    task.parentElement.removeChild(task);
                }
            }
        }
    }
    bind(target) {
        super.bind(target);

        let tree = [{ tag: 'div', id: 'todo' },
            [{ tag: 'div', id: 'todo-notes', class: 'todo-container' },
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
            [{ tag: 'div', id: 'todo-tasks', class: 'todo-container' },
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

        const S = GL.CONST.DATA_ATTR.TODOLIST.STATUS;
        let qsParent, qsChild, qsParentExcl;

        qsParent = '#todo #todo-notes table tbody'; qsChild = 'tr td .control-el.action-1'; qsParentExcl = [`tr[data-status='${S.INITIAL}']`, `tr[data-status='${S.FINISHED}']`];
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.notes.operate.bind(this, 's'));

        qsParent = '#todo #todo-notes table tbody'; qsChild = `tr td .control-el.action-2`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.notes.operate.bind(this, 'f'));

        qsParent = '#todo #todo-notes table tbody'; qsChild = `tr td .control-el.action-3`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.notes.operate.bind(this, 'd'));

        qsParent = '#todo #todo-tasks table tbody'; qsChild = 'tr td .control-el.action-1'; qsParentExcl = [`tr[data-status='${S.INITIAL}']`, `tr[data-status='${S.FINISHED}']`];
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.tasks.operate.bind(this, 's'));

        qsParent = '#todo #todo-tasks table tbody'; qsChild = `tr td .control-el.action-2`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.tasks.operate.bind(this, 'f'));

        qsParent = '#todo #todo-tasks table tbody'; qsChild = `tr td .control-el.action-3`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.tasks.operate.bind(this, 'd'));

        qsParent = '#todo #todo-notes table tbody'; qsChild = `tr td`; qsParentExcl = [`tr[data-status='${S.EDITED}']`];
        UTILS.SET_DELEGATE('input', qsParent, qsChild, qsParentExcl, this.cb.event.input.bind(this));

        qsParent = '#todo #todo-tasks table tbody'; qsChild = `tr td`; qsParentExcl = [`tr[data-status='${S.EDITED}']`];
        UTILS.SET_DELEGATE('input', qsParent, qsChild, qsParentExcl, this.cb.event.input.bind(this));
    }

    init() {
        super.init();

        let self = this,
            todo = document.getElementById('todo');

        const E = GL.CONST.EVENTS.TODOLIST;
        EVENT_BUS.register(E.FINISH, self.cb.event.finish.bind(this));
        EVENT_BUS.register(E.DELAY, self.cb.event.delay.bind(this));
        EVENT_BUS.register(E.DELETE, self.cb.event.delete.bind(this));

        (async ()=>{
            try {

                let select;

                select = await new Select().select('id,text,status').from('notes').connect();
                select.data.forEach(note => { self.cb.notes.add(null, note); });
                self.sort(todo.querySelector(`#todo-notes table tbody`));

                select = await new Select().select('id,text,status,planned').from('tasks').connect();
                select.data.forEach(task => { self.cb.tasks.add(null, task); });
                self.sort(todo.querySelector(`#todo-tasks table tbody`));

                this.finishDataLoad();
            } catch (e) {
                // TODO error
                this.finishDataLoad();
            }
        })();
    }

    sort(tbody) {
        let nodeList = tbody.querySelectorAll('tr');
        let nodes = [];
        nodeList.forEach(tr => { nodes.push({ id: tr.dataset.id, status: tr.dataset.status, node: tr }); });
        nodes.sort((a, b) => {
            if (a.status === b.status) {
                return parseInt(a.id) < parseInt(b.id) ? -1 : 1;
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