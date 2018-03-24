/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */
(function () { "use strict"; })();

class Person {
    constructor(opts = {}) {
        this.id = Math.floor(Math.random() * 100000);
        this._unid = opts.unid || '';
        this._name = opts.name || '';
        this._teln = opts.teln || '';
        this._city = opts.city || '';
        this._info = opts.info || '';

        return this;
    }

    save(async = true) {
        if (async) {
            (async () => {
                try {
                    let insert = await new Insert('', { types: 'ssss', param: [this.name, this.teln, this.city, this.info] }).into('pb001 (name,teln,city,info)').values(`(?,?,?,?)`).connect();
                    if (!insert.insertId) return;
                    let select = await new Select('', { types: 'i', param: [insert.insertId] }).select('*').from('pb001').where('unid = ?').connect();
                    if (!select.status) return;
                    EVENT_BUS.dispatch(GL.CONST.EVENTS.CONTACT.NEW, select.data[0]);
                } catch (error) {
                    return;
                }
            })();
        } else {
            return new Promise((resolve, reject) => {
                (async () => {
                    try {
                        let insert = await new Insert('', { types: 'ssss', param: [this.name, this.teln, this.city, this.info] }).into('pb001 (name,teln,city,info)').values(`(?,?,?,?)`).connect();
                        if (!insert.insertId) reject();
                        let select = await new Select('', { types: 'i', param: [insert.insertId] }).select('*').from('pb001').where('unid = ?').connect();
                        if (!select.status) reject();
                        resolve(select.data[0]);
                    } catch (error) {
                        reject();
                    }
                })();
            });
        }
    }

    load() {
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    let select = await new Select().select('*').from('pb001').connect();
                    if (!select.status) reject();
                    resolve(select.data);
                } catch (error) {
                    reject();
                }
            })();
        });
    }

    check() {
        return new Promise ((resolve, reject) => {
            (async () => {
                try {
                    let select = await new Select('', { types: 's', param: [this.teln] }).select('*').from('pb001').where('teln = ?').connect();
                    if (select.affectedRows && (this.name === select.data[0].name)) reject(true);
                    resolve(false);
                } catch (error) {
                    reject(true);
                }
            })();
        });
    }

    parse(obj) {
        let data = Array.isArray(obj) ? obj[0] : obj;
        try {
            this.name = data.name || '';
            this.teln = data.teln || '';
            this.city = data.city || '';
            this.info = data.fnot || '';
        } catch (error) { return; /* NOTE */ }

        return this;
    }

    set unid(val) { this._unid = val; } get unid() { return this._unid; }
    set name(val) { this._name = val; } get name() { return this._name; }
    set teln(val) { this._teln = val; } get teln() { return this._teln; }
    set city(val) { this._city = val; } get city() { return this._city; }
    set info(val) { this._info = val; } get info() { return this._info; }
}

class Contacts extends DataWrapper {

    constructor() {
        super();

        this.event = {
            new: function(e) {
                let person = [];
                person.push(e.detail.data);
                this.add(person);
            },
            input: function(e) { e.target.closest('tr').dataset.status = GL.CONST.DATA_ATTR.CONTACT.STATUS.EDITED; }
        }

        this.cb = {
            save: function(e) {
                let self = this,
                    tr = e.target.closest('tr'),
                    p = {
                        name: tr.querySelector('.contact-person-name').innerText || '',
                        teln: tr.querySelector('.contact-person-teln').innerText || '',
                        city: tr.querySelector('.contact-person-city').innerText || '',
                        info: tr.querySelector('.contact-person-info').innerText || ''
                    };

                (async () => {
                    try {
                        let update = await new Update('', { types: 'ssssi', param: [p.name,p.teln,p.city,p.info,tr.dataset.unid] }).update('pb001').set('name=?,teln=?,city=?,info=?').where('unid=?').connect();
                        if (!update.affectedRows) {
                            new MessageBox({ text: `${GL.CONST.LOG.ID.B002.TITLE}::${GL.CONST.LOG.ID.B002.GIST}`, level: 'error' }).stay();
                            return;
                        }
                        let select = await new Select('', { types: 'i', param: [tr.dataset.unid] }).select('*').from('pb001').where('unid=?').connect();
                        if (!select.status) {
                            new MessageBox({ text: `${GL.CONST.LOG.ID.B002.TITLE}::${GL.CONST.LOG.ID.B002.GIST}`, level: 'error' }).stay();
                            return;
                        }
                        self.upd(new Person(select.data[0]));
                    } catch (error) {
                        new MessageBox({ text: `${GL.CONST.LOG.ID.B002.TITLE}::${GL.CONST.LOG.ID.B002.GIST}`, level: 'error' }).stay();
                    }
                })();
            },
            reset: function(e) {
                let self = this,
                    ds = e.target.closest('tr').dataset;

                (async () => {
                    try {
                        let select = await new Select('', { types: 'i', param: [ds.unid] }).select('*').from('pb001').where('unid=?').connect();
                        if (!select.status) {
                            new MessageBox({ text: `${GL.CONST.LOG.ID.B002.TITLE}::${GL.CONST.LOG.ID.B002.GIST}`, level: 'error' }).stay();
                            return;
                        }
                        self.upd(new Person(select.data[0]));
                    } catch (error) {
                        new MessageBox({ text: `${GL.CONST.LOG.ID.B002.TITLE}::${GL.CONST.LOG.ID.B002.GIST}`, level: 'error' }).stay();
                    }
                })();
            },
            delete: function(e) {
                let self = this,
                    ds = e.target.closest('tr').dataset;

                (async () => {
                    try {
                        let del = await new Delete('', { types: 'i', param: [ds.unid] }).from('pb001').where('unid=?').connect();
                        if (!del.affectedRows) {
                            new MessageBox({ text: `${GL.CONST.LOG.ID.B002.TITLE}::${GL.CONST.LOG.ID.B002.GIST}`, level: 'error' }).stay();
                            return;
                        }
                        self.del(ds.unid);
                    } catch (error) {
                        new MessageBox({ text: `${GL.CONST.LOG.ID.B002.TITLE}::${GL.CONST.LOG.ID.B002.GIST}`, level: 'error' }).stay();
                    }
                })();
            }
        }
    }

    bind(target) {

        let tree =
            [{ tag: 'table', id: 'contact' },
                [{ tag: 'thead', id: 'contact-thead' },
                    [{ tag: 'tr' },
                        { tag: 'td', class: 'contact-person-el contact-person-name', textNode: 'ФИО' },
                        { tag: 'td', class: 'contact-person-el contact-person-teln', textNode: 'Номер телефона' },
                        { tag: 'td', class: 'contact-person-el contact-person-city', textNode: 'Город' },
                        { tag: 'td', class: 'contact-person-el contact-person-info', textNode: 'Примечание' },
                    ]
                ],
                { tag: 'tbody', id: 'contact-tbody' }
            ];

        tree = new DOMTree(tree).cultivate();
        if (tree) target.appendChild(tree);
        else console.log('tree is ' + tree);

        let qsParent, qsChild, qsParentExcl;

        qsParent = '#contact > tbody'; qsChild = 'tr .control-el.save'; qsParentExcl = `[data-status='${GL.CONST.DATA_ATTR.CONTACT.STATUS.INITIAL}']`;
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.save.bind(this));

        qsParent = '#contact > tbody'; qsChild = 'tr .control-el.reset'; qsParentExcl = `[data-status='${GL.CONST.DATA_ATTR.CONTACT.STATUS.INITIAL}']`;
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.reset.bind(this));

        qsParent = '#contact > tbody'; qsChild = `tr .control-el.delete`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.delete.bind(this));

        qsParent = '#contact > tbody'; qsChild = `tr td`; qsParentExcl = `[data-status='${GL.CONST.DATA_ATTR.CONTACT.STATUS.EDITED}']`;
        UTILS.SET_DELEGATE('input', qsParent, qsChild, qsParentExcl, this.event.input.bind(this));
    }

    init() {

        let self = this;

        EVENT_BUS.register(GL.CONST.EVENTS.CONTACT.NEW, this.event.new.bind(this));

        (async () => {
            try {
                let select = await new Select().select('*').from('pb001').connect();
                if (!select.status) return;
                self.add(select.data);
            } catch (error) {
                return;
            }
        })();
    }

    add(data) {
        var tbody = document.getElementById('contact-tbody');
        if (!tbody) return;

        data.forEach(person => {
            let tree =
                [{ tag: 'tr', attr: {
                        'data-unid': person.unid, 'data-name': person.name, 'data-city': person.city, 'data-info': person.info,
                        'data-status': GL.CONST.DATA_ATTR.CONTACT.STATUS.INITIAL }
                        },
                    { tag: 'td', class: 'contact-person-el contact-person-name', textNode: person.name, attr: { 'contenteditable': 'true' } },
                    { tag: 'td', class: 'contact-person-el contact-person-teln', textNode: person.teln, attr: { 'contenteditable': 'true' } },
                    { tag: 'td', class: 'contact-person-el contact-person-city', textNode: person.city, attr: { 'contenteditable': 'true' } },
                    { tag: 'td', class: 'contact-person-el contact-person-info', textNode: person.info, attr: { 'contenteditable': 'true' } },
                    [{ tag: 'div', class: 'control-wrapper' },
                        [{ tag: 'div', class: 'control-container' },
                            { tag: 'span', class: 'control-el save', textNode: '' },
                            { tag: 'span', class: 'control-el reset', textNode: '' },
                            { tag: 'span', class: 'control-el delete', textNode: '' }
                        ]
                    ]
                ];

            tree = new DOMTree(tree).cultivate();
            if (tree) tbody.appendChild(tree);
            else console.log('tree is ' + tree);
        });
    }

    upd(person) {
        let contact = document.querySelector(`#contact [data-unid='${person.unid}']`);
        if (!contact) {
            new MessageBox({ text: `${GL.CONST.LOG.ID.A001.TITLE}::${GL.CONST.LOG.ID.A001.GIST}`, level: 'error' }).stay();
            return;
        }
        contact.dataset.status = GL.CONST.DATA_ATTR.CONTACT.STATUS.INITIAL;
        contact.dataset.name = person.name;
        contact.dataset.teln = person.teln;
        contact.dataset.city = person.city;
        contact.dataset.info = person.info;
        contact.querySelector('.contact-person-name').innerText = person.name;
        contact.querySelector('.contact-person-teln').innerText = person.teln;
        contact.querySelector('.contact-person-city').innerText = person.city;
        contact.querySelector('.contact-person-info').innerText = person.info;
        new MessageBox({ text: `${GL.CONST.LOG.ID.A003.TITLE}::${GL.CONST.LOG.ID.A003.GIST}`, level: 'success' }).stay();
    }

    del(unid) {
        let contact = document.querySelector(`#contact [data-unid='${unid}']`);
        if (!contact) {
            new MessageBox({ text: `${GL.CONST.LOG.ID.A001.TITLE}::${GL.CONST.LOG.ID.A001.GIST}`, level: 'error' }).stay();
            return;
        }
        contact.parentNode.removeChild(contact);
        new MessageBox({ text: `${GL.CONST.LOG.ID.A003.TITLE}::${GL.CONST.LOG.ID.A003.GIST}`, level: 'success' }).stay();
    }
}