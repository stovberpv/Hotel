/*jshint esversion: 6 */
/*jshint -W030 */

'use strict';

class MessageBox {

    constructor(opts = {}) {
        this.id = Math.floor(Math.random() * 100000);

        this.text = opts.text;
        this.level = opts.level || 'info'; //error info warn debug success
        this.hideOnClick = opts.hideOnClick || false;

        this.control = {
            withControl: opts.control ? opts.control.withControl : false,
            cb: opts.control ? opts.control.cb : undefined
        }
        this.ds = opts.dataset || {};

        return this;
    }

    add() {
        let msgBoxWrapper = document.getElementById(`msg-box-wrapper`);

        let msgBox = document.createElement('div');
        msgBox.id = `msg-box-${this.id}`;
        msgBox.classList.add('msg-box');
        msgBox.classList.add(`msg-box-${this.level}`);

        if (this.hideOnClick) {
            msgBox.addEventListener('click', function(e) {
                e.target.closest('.msg-box').classList.add('animation-hide');
                setTimeout(function() { this.parentNode.removeChild(this); }.bind(e.target.closest('.msg-box')), 1400);
            });
        }

        for(let data in this.ds) { msgBox.dataset[data] = this.ds[data]; }

        this.control.withControl && msgBox.appendChild(new ControlContainer(this.cb));

        let span = document.createElement('span');
        span.classList.add('msg-box-text');
        span.appendChild(document.createTextNode(this.text));

        msgBox.appendChild(span);
        msgBoxWrapper.appendChild(msgBox);

        return this;
    }

    init() {
        let msgBox = document.getElementById(`msg-box-wrapper`);
        if (msgBox) return;
        msgBox = document.createElement('div');
        msgBox.id = 'msg-box-wrapper';
        document.body.appendChild(msgBox);
    }

    stay(time = 5000) {
        let self = this;
        setTimeout(() => {
            let msgBox = document.getElementById(`msg-box-${self.id}`);
            msgBox.parentElement.removeChild(msgBox);
        }, time);
    }
}