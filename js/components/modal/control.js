'use strict';

class ControlContainer {
    constructor(opts = {}) {
        this.cb = {
            el1: opts ? opts.el1 : undefined,
            el2: opts ? opts.el2 : undefined,
            el3: opts ? opts.el3 : undefined
        }
        return this.create();
    }

    create() {

        let wrapper = document.createElement('div'),
            container = document.createElement('div'),
            span;

        container.classList.add('control-container');
        wrapper.classList.add('control-wrapper');

        span = document.createElement('span');
        span.classList.add('control-el');
        span.classList.add('action-1');
        (this.cb.el1) && span.addEventListener('click', this.cb.el1);
        span.appendChild(document.createTextNode(''));
        container.appendChild(span);

        span = document.createElement('span');
        span.classList.add('control-el');
        span.classList.add('action-2');
        (this.cb.el2) && span.addEventListener('click', this.cb.el2);
        span.appendChild(document.createTextNode(''));
        container.appendChild(span);

        span = document.createElement('span');
        span.classList.add('control-el');
        span.classList.add('action-3');
        (this.cb.el3) && span.addEventListener('click', this.cb.el3);
        span.appendChild(document.createTextNode(''));
        container.appendChild(span);

        wrapper.appendChild(container);

        return wrapper;
    }
}