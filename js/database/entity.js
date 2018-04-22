/*jshint esversion: 6 */

'use strict';

class Entity { constructor() { this.id = Math.floor(Math.random() * 100000); } }

class Person extends Entity {

    constructor(person = {}) {
        super();

        this._unid = person.unid || '';
        this._name = person.name || '';
        this._teln = person.teln || '';
        this._city = person.city || '';
        this._info = person.info || '';

        return this;
    }

    set unid(val) { this._unid = val; } get unid() { return this._unid; }
    set name(val) { this._name = val; } get name() { return this._name; }
    set teln(val) { this._teln = val; } get teln() { return this._teln; }
    set city(val) { this._city = val; } get city() { return this._city; }
    set info(val) { this._info = val; } get info() { return this._info; }
}

class Guest extends Entity {

    constructor(guest = {}) {
        super();

        this._unid = guest.unid || '';
        this._dbeg = guest.dbeg || '';
        this._dend = guest.dend || '';
        this._days = guest.days || '';
        this._room = guest.room || '';
        this._base = guest.base || '';
        this._adjs = guest.adjs || '';
        this._cost = guest.cost || '';
        this._paid = guest.paid || '';
        this._name = guest.name || '';
        this._teln = guest.teln || '';
        this._fnot = guest.fnot || '';
        this._city = guest.city || '';

        return this;
    }

    set unid(val) { this._unid = val || ''; } get unid() { return this._unid; }
    set dbeg(val) { this._dbeg = val || ''; } get dbeg() { return this._dbeg; }
    set dend(val) { this._dend = val || ''; } get dend() { return this._dend; }
    set days(val) { this._days = val || ''; } get days() { return this._days; }
    set room(val) { this._room = val || ''; } get room() { return this._room; }
    set base(val) { this._base = val || ''; } get base() { return this._base; }
    set adjs(val) { this._adjs = val || ''; } get adjs() { return this._adjs; }
    set cost(val) { this._cost = val || ''; } get cost() { return this._cost; }
    set paid(val) { this._paid = val || ''; } get paid() { return this._paid; }
    set name(val) { this._name = val || ''; } get name() { return this._name; }
    set teln(val) { this._teln = val || ''; } get teln() { return this._teln; }
    set fnot(val) { this._fnot = val || ''; } get fnot() { return this._fnot; }
    set city(val) { this._city = val || ''; } get city() { return this._city; }
}

class Config extends Entity {
    constructor(config = {}) {
        super();
        this._year = config.year || new Date().getFullYear();
        this._moon = config.moon || new Date().getMonth() + 1;
    }

    set year(val) { this._year = val; } get year() { return this._year; }
    set moon(val) { this._moon = val; } get moon() { return this._moon; }
}

class Room extends Entity {

    constructor(room = {}) {
        super();

        this._unid = room.unid || '';
        this._room = room.room || '';
        this._base = room.base || '';
        this._info = room.info || '';

        return this;
    }

    set unid(val) { this._unid = val; } get unid() { return this._unid; }
    set room(val) { this._room = val; } get room() { return this._room; }
    set base(val) { this._base = val; } get base() { return this._base; }
    set info(val) { this._info = val; } get info() { return this._info; }
}

class Note extends Entity {
    constructor(note = {}) {
        super();

        this._unid = note.unid || '';
        this._text = note.text || '';
        this._stat = note.stat || '';
        this._date = note.date || '';
        this._user = note.user || '';

        return this;
    }

    set unid(val) { this._unid = val;} get () { return this._unid; }
    set text(val) { this._text = val;} get () { return this._text; }
    set stat(val) { this._stat = val;} get () { return this._stat; }
    set date(val) { this._date = val;} get () { return this._date; }
    set user(val) { this._user = val;} get () { return this._user; }
}

class Task extends Entity {
    constructor(task = {}) {
        super();

        this._unid = task.unid || '';
        this._text = task.text || '';
        this._stat = task.stat || '';
        this._plnd = task.plnd || '';
        this._crtd = task.crtd || '';
        this._user = task.user || '';

        return this;
    }

    set unid(val) { this._unid = val;} get () { return this._unid; }
    set text(val) { this._text = val;} get () { return this._text; }
    set stat(val) { this._stat = val;} get () { return this._stat; }
    set plnd(val) { this._plnd = val;} get () { return this._plnd; }
    set crtd(val) { this._crtd = val;} get () { return this._crtd; }
    set user(val) { this._user = val;} get () { return this._user; }
}