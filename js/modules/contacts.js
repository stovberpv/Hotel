/*jshint esversion: 6 */
/*jshint -W030 */
/*jshint -W040 */
/*jshint -W083 */
'use strict';

class Contacts extends RootModule {

    constructor() {
        super();

        this.dataAttr = { status: { initial: 'initial', edited: 'edited' }, };

        this.event = {
            new: function(e) {
                let person = [];
                person.push(e.detail.data);
                this.add(person);
            },
            input: function(e) { e.target.closest('tr').dataset.status = this.dataAttr.status.edited; }
        }

        this.cb = {
            save: function(e) {
                let self = this,
                    pb001 = new PB001(),
                    tr = e.target.closest('tr');

                pb001.entity = new Person({
                        unid: tr.dataset.unid,
                        name: tr.querySelector('.contact-person-name').innerText || '',
                        teln: tr.querySelector('.contact-person-teln').innerText || '',
                        city: tr.querySelector('.contact-person-city').innerText || '',
                        info: tr.querySelector('.contact-person-info').innerText || ''
                    });

                (async () => {
                    try { await pb001.update(); } catch (e) { return; }
                    self.upd(pb001.entity);
                })();
            },
            reset: function(e) {
                let self = this,
                    pb001 = new PB001();

                pb001.entity = new Person({ unid: e.target.closest('tr').dataset.unid });
                (async () => {
                    try { pb001 = await pb001.load(); } catch (e) { return; }
                    self.upd(pb001);
                })();
            },
            delete: function(e) {
                let self = this,
                    pb001 = new PB001();

                pb001.entity = new Person({ unid: e.target.closest('tr').dataset.unid });
                (async () => {
                    try { pb001 = await pb001.delete(); } catch (e) { return; }
                    self.del(ds.unid);
                })();
            }
        }
    }

    bind(target) {
        super.bind(target);

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

        qsParent = '#contact > tbody'; qsChild = 'tr .control-el.action-1'; qsParentExcl = `[data-status='${this.status.initial}']`;
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.save.bind(this));

        qsParent = '#contact > tbody'; qsChild = 'tr .control-el.action-2'; qsParentExcl = `[data-status='${thisCT.status.initial}']`;
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.reset.bind(this));

        qsParent = '#contact > tbody'; qsChild = `tr .control-el.action-3`; qsParentExcl = '';
        UTILS.SET_DELEGATE('mousedown', qsParent, qsChild, qsParentExcl, this.cb.delete.bind(this));

        qsParent = '#contact > tbody'; qsChild = `tr td`; qsParentExcl = `[data-status='${this.status.edited}']`;
        UTILS.SET_DELEGATE('input', qsParent, qsChild, qsParentExcl, this.event.input.bind(this));
    }

    init() {
        super.init();
        let self = this;

        EVENT_BUS.register(GL.CONST.EVENTS.CONTACT.NEW, this.event.new.bind(this));

        (async () => {
            let pb001 = new PB001();
            try { pb001 = await pb001.load(); } catch (e) { this.finishDataLoad(); return; }
            self.add(pb001);
            this.finishDataLoad();
        })();
    }

    beginDataLoad() { super.beginDataLoad(); }
    finishDataLoad() { super.finishDataLoad(); }

    add(data) {
        var tbody = document.getElementById('contact-tbody');
        if (!tbody) return;

        data.forEach(person => {

            // FIX  заюзать либу для control-el. убрать отсюда dom
            let tree =
                [{ tag: 'tr', attr: {
                        'data-unid': person.unid, 'data-name': person.name, 'data-city': person.city, 'data-info': person.info,
                        'data-status': this.status.initial }
                        },
                    { tag: 'td', class: 'contact-person-el contact-person-name', textNode: person.name, attr: { 'contenteditable': 'true' } },
                    { tag: 'td', class: 'contact-person-el contact-person-teln', textNode: person.teln, attr: { 'contenteditable': 'true' } },
                    { tag: 'td', class: 'contact-person-el contact-person-city', textNode: person.city, attr: { 'contenteditable': 'true' } },
                    { tag: 'td', class: 'contact-person-el contact-person-info', textNode: person.info, attr: { 'contenteditable': 'true' } },
                    [ { tag: 'td', class: 'td-zero-size' },
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
            if (tree) tbody.appendChild(tree);
            else console.log('tree is ' + tree);
        });
    }

    upd(person) {
        let contact = document.querySelector(`#contact #contact-tbody tr[data-unid='${person.unid}']`);
        if (!contact) {
            new MessageBox({ text: `${GL.CONST.LOG.ID.A001.TITLE}::${GL.CONST.LOG.ID.A001.GIST}`, level: 'error' }).add().stay();
            return;
        }
        contact.dataset.status = this.status.initial;
        contact.dataset.name = person.name;
        contact.dataset.teln = person.teln;
        contact.dataset.city = person.city;
        contact.dataset.info = person.info;
        contact.querySelector('.contact-person-name').innerText = person.name;
        contact.querySelector('.contact-person-teln').innerText = person.teln;
        contact.querySelector('.contact-person-city').innerText = person.city;
        contact.querySelector('.contact-person-info').innerText = person.info;
        new MessageBox({ text: `${GL.CONST.LOG.ID.A003.TITLE}::${GL.CONST.LOG.ID.A003.GIST}`, level: 'success' }).add().stay();
    }

    del(unid) {
        let contact = document.querySelector(`#contact #contact-tbody tr[data-unid='${unid}']`);
        if (!contact) {
            new MessageBox({ text: `${GL.CONST.LOG.ID.A001.TITLE}::${GL.CONST.LOG.ID.A001.GIST}`, level: 'error' }).add().stay();
            return;
        }
        contact.parentNode.removeChild(contact);
        new MessageBox({ text: `${GL.CONST.LOG.ID.A003.TITLE}::${GL.CONST.LOG.ID.A003.GIST}`, level: 'success' }).add().stay();
    }
}