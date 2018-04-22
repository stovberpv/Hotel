/*jshint esversion: 6 */

'use strict';

// FIX  объеденить save & update

class Schema {
    constructor() {
        this._table = '';
        this._field = {};
        this._entity = {};
    }
    get table() { return this._table; }
    get field() { return this._field; }
    get entity() { return this._entity; }
    set entity(obj) { this._entity = obj; }
    save() { }
    load() { }
    update() { }
    delete() { }
}

class CF001 extends Schema {
    constructor() {
        super();
        this._table = 'cf001';
        this._field = { unid: 'unid', year: 'year', moon: 'moon' };

        return this;
    }

    save() { // FIX  настроек может быть много, сохраняя что-то одно можно затереть старые параметры. подумать как сделать!
        /*
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    let select = await new Select().select('unid').from('us001').where('us001.user=?').connect(1);
                    !select.affectedRows && reject();
                    let opts = { types: 'iss', param: [select.data[0], this.year, this.mnth] };
                    let insert = await new Insert('', opts).into('us001(unid,year,mnth)').values('(?,?,?)').connect();
                    !insert.affectedRows && reject();
                    resolve();
                } catch (e) { reject(); }
            })();
        });
        */
    }

    load() {
        return new Promise((resolve, reject) => {
            let select;
            (async () => {
                try { select = await new Select().select('cf001.*').from('cf001').join('us001').on('us001.unid = cf001.unid').where('us001.user=?').connect(1); } catch (e) { reject(); }
                !select.status && reject();
                resolve(select.data[0]);
            })();
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            let update, opts, entity = this.entity;
            (async () => {
                let opts = { types: 'ss', param: [entity.year, entity.moon] };
                try { update = await new Update('', opts).update('cf001').set('cf001.year=?,cf001.moon=?').join('us001').on('us001.unid = cf001.unid').where('us001.user=?').connect(1); } catch (e) { reject(); }
                !update.affectedRows && reject();
                resolve();
            })();
        });
    }

    delete() {}
}

class RM001 extends Schema {
    constructor() {
        super();
        this._table = 'rm001';
        this._field = { unid: 'unid', room: 'room', base: 'base', info: 'info' };

        return this;
    }

    save() {}

    load() {
        return new Promise((resolve, reject) => {
            let select;
            (async () => {
                try { select = await new Select().select('*').from('rm001').connect(); } catch (e) { reject(); }
                !select.status && reject();
                resolve(select.data);
            })();
        });
    }

    update() {}

    delete() {}
}

class US001 extends Schema {
    constructor() {
        super();
        this._table = 'us001';
        this._field = { unid: 'unid', user: 'user', pswd: 'pswd', dbeg: 'dbeg', dend: 'dend', actv: 'actv', seid: 'seid' };

        return this;
    }
    save() { }
    load() { }
    update() { }
    delete() { }
}

class GL001 extends Schema {
    constructor() {
        super();
        this._table = 'gl001';
        this._field = { unid: 'unid', dbeg: 'dbeg', dend: 'dend', days: 'days', room: 'room', base: 'base', adjs: 'adjs', cost: 'cost', paid: 'paid', name: 'name', teln: 'teln', fnot: 'fnot', city: 'city', user: 'user' };

        return this;
    }

    save() {
        return new Promise((resolve, reject) => {
            let insert, opts, entity = this.entity;
            (async () => {
                opts = { types: 'ssiiddddssss', param: [entity.dbeg,entity.dend,entity.days,entity.room,entity.base,entity.adjs,entity.cost,entity.paid,entity.name,entity.teln,entity.fnot,entity.city] };
                try { insert = await new Insert('', opts).into('gl001(dbeg,dend,days,room,base,adjs,cost,paid,name,teln,fnot,city,user)').values('(?,?,?,?,?,?,?,?,?,?,?,?,?)').connect(1); } catch (e) { reject(); }
                !insert.insertId && reject();
                resolve(entity);
            })();
        });
    }

    load() {
        return new Promise((resolve, reject) => {
            let select, opts, entity = this.entity;
            if (entity.unid) {
                (async () => {
                    opts = { types: 'i', param: [entity.unid] };
                    try { select = await new Select('', opts).select('*').from('gl001').where('unid=?').connect(); } catch (e) { reject(); }
                    !select.status && reject();
                    resolve(select.data);
                })();
            } else if (entity.dbeg && entity.dend) {
                (async () => {
                    opts = { types: 'ss', param: [entity.dend, entity.dbeg] };
                    try { select = await new Select('', opts).select('*').from('gl001').where(`dbeg <= ? AND dend >= ?`).connect(); } catch (e) { reject(); }
                    !select.status && reject();
                    resolve(select.data);
                })();
            } else {
                (async () => {
                    try { select = await new Select().select('*').from('gl001').connect(); } catch (e) { reject(); }
                    !select.status && reject();
                    resolve(select.data);
                })();
            }
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            let update, opts, entity = this.entity;
            (async () => {
                opts = { types: 'ssiiddddssssi', param: [entity.dbeg,entity.dend,entity.days,entity.room,entity.base,entity.adjs,entity.cost,entity.paid,entity.name,entity.teln,entity.fnot,entity.city,entity.unid] };
                try { update = await new Update('', opts).update('gl001').set('dbeg=?,dend=?,days=?,room=?,base=?,adjs=?,cost=?,paid=?,name=?,teln=?,fnot=?,city=?').where('unid=?').connect(); } catch (e) { reject(); }
                !update.affectedRows && reject();
                resolve(entity);
            })();
        });
    }

    delete() {
        return new Promise((resolve, reject) => {
            let del, opts, entity = this.entity;
            (async () => {
                opts = { types: 'i', param: [entity.unid] };
                try { del = await new Delete('', opts).from('gl001').where('unid = ?').connect(); } catch (e) { reject(); }
                !del.affectedRows && reject();
                resolve(entity.unid);
            })();
        });
    }
}

// TODO  :
class NT001 extends Schema {
    constructor() {
        super();
        this._table = 'nt001';
        this._field = { unid: 'unid', text: 'text', stat: 'stat', date: 'date', user: 'user' };

        return this;
    }
    save() {
        return new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                let insert, update, opts, entity = this.entity;
                if (entity.unid) {
                    opts = { types: 'ssi', param: [entity.text, entity.stat, entity.unid] };
                    try { update = await new Update('', opts).update('notes').set('text=?,stat=?').where('unid=?').connect(); } catch (e) { reject(); }
                    update.affectedRows ? resolve() : reject();
                } else {
                    opts = { types: 'ss', param: [entity.text, entity.stat] };
                    try { insert = await new Insert('', opts).into('notes(text,stat,user)').values('(?,?,?)').connect(1); } catch (e) { reject(); }
                    insert.affectedRows ? resolve(insert.insertId) : reject();
                }
            });
        });
    }

    load() {
        return new Promise((resolve, reject) => {
            let select, opts, entity = this.entity;
            if (entity.unid) {
                opts = { types: 'i', param: [entity.unid] };
                try { select = await new Select('', opts).select('*').from('notes').where(`id = ?`).connect(); } catch (e) { reject(); }
            } else {
                try { select = await new Select().select('*').from('notes').connect(); } catch (e) { reject(); }
            }
            resolve(select.data);
        });
    }

    delete() {
        return new Promise((resolve, reject) => {
            let del, opts, entity = this.entity;
            if (entity.unid) {
                try {} catch (e) {}
            } else {
                reject();
            }
        });
    }
}

class PB001 extends Schema {
    constructor() {
        super();
        this._table = 'pb001';
        this._field = { unid: 'unid', name: 'name', teln: 'teln', city: 'city', info: 'info' };

        return this;
    }
    save() {
        return new Promise((resolve, reject) => {
            let insert, opts, entity = this.entity;
            (async () => {
                opts = { types: 'ssss', param: [entity.name, entity.teln, entity.city, entity.info] };
                try { insert = await new Insert('', opts).into('pb001 (name,teln,city,info)').values(`(?,?,?,?)`).connect(); } catch (e) { reject(); }
                !insert.insertId && reject();
                entity.unid = insert.insertId;
                resolve(entity);
            })();
        });
    }

    load() {
        return new Promise((resolve, reject) => {
            let select, opts, entity = this.entity;
            if (entity.unid) {
                (async () => {
                    opts = { types: 'i', param: [entity.unid] };
                    try { select = await new Select('', opts).select('*').from('pb001').where('unid=?').connect(); } catch (e) { reject(); }
                    if (!select.status) reject();
                    resolve(select.data[0]);
                })();
            } else {
                (async () => {
                    try { select = await new Select().select('*').from('pb001').connect(); } catch (e) { reject(); }
                    if (!select.status) reject();
                    resolve(select.data);
                })();
            }
        });
    }

    update() {
        return new Promise((resolve, reject) => {
            let update, opts, entity = this.entity;
            (async () => {
                opts = { types: 'ssssi', param: [entity.name, entity.teln, entity.city, entity.info, entity.unid] };
                try { update = await new Update('', opts).update('pb001').set('name=?,teln=?,city=?,info=?').where('unid=?').connect(); } catch (e) { reject(); }
                !update.affectedRows && reject();
                resolve(entity.unid);
            })();
        });
    }

    delete() {
        return new Promise((resolve, reject) => {
            let del, opts, entity = this.entity;
            (async () => {
                opts = { types: 'i', param: [entity.unid] };
                try { del = await new Delete('', opts).from('pb001').where('unid=?').connect(); } catch (e) {reject(); }
                !del.affectedRows && reject();
                resolve(entity.unid);
            })();
        });
    }

    check() {
        return new Promise ((resolve, reject) => {
            let select, opts, entity = this.entity;
            (async () => {
                opts = { types: 's', param: [entity.teln] }
                try { select = await new Select('', opts).select('*').from('pb001').where('teln = ?').connect(); } catch (e) { reject(true); }
                if (select.affectedRows && (entity.name === select.data[0].name)) reject(true);
                resolve(false);
            })();
        });
    }
}

// TODO  :
class TS001 extends Schema {
    constructor() {
        super();
        this._table = 'ts001';
        this._field = { unid: 'unid', text: 'text', stat: 'stat', plnd: 'plnd', crtd: 'crtd', user: 'user' };

        return this;
    }

    save() {
        return new Promise((resolve, reject) => {
            let insert, update, opts, entity = this.entity;
            if (entity.unid) {
                try {} catch (e) {}
            } else {
                try {} catch (e) {}
            }
        });
    }

    load() {
        return new Promise((resolve, reject) => {
            let select, opts, entity = this.entity;
            if (entity.unid) {
                try {} catch (e) {}
            } else {
                try {} catch (e) {}
            }
        });
    }

    delete() {
        return new Promise((resolve, reject) => {
            let del, opts, entity = this.entity;
            if (entity.unid) {
                try {} catch (e) {}
            } else {
                reject();
            }
        });
    }
}