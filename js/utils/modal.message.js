/*jshint esversion: 6 */
/*jshint -W030 */
(function () { "use strict"; })();

/*
    TODO сообщения
        сделать что бы каждое новое уведомление отображалось выше предыдущего.
        сделать 4 стиля: красное, зеленое, синее, нейтральное
*/
class MessageBox {

    constructor(opts) {
        this.text = opts.text;
        this.level = opts.level || 'info'; //error info warn debug success
        this.id = Math.floor(Math.random() * 100000);

        (() => {
            let msgBox = document.getElementById(`msg-box-wrapper`);
            if (msgBox) return;
            msgBox = document.createElement('div');
            msgBox.id = 'msg-box-wrapper';
            document.body.appendChild(msgBox);
        })();

        (() => {
            let msgBoxWrapper = document.getElementById(`msg-box-wrapper`);

            let msgBox = document.createElement('div');
            msgBox.id = `msg-box-${this.id}`;
            msgBox.classList.add('msg-box');
            msgBox.classList.add(`msg-box-${this.level}`);

            let span = document.createElement('span');
            msgBox.classList.add('msg-box-text');
            span.appendChild(document.createTextNode(this.text));

            msgBox.appendChild(span);
            msgBoxWrapper.appendChild(msgBox);
        })();

        return this;
    }

    stay(time = 5000) {
        let self = this;
        setTimeout(() => {
            let msgBox = document.getElementById(`msg-box-${self.id}`);
            msgBox.parentElement.removeChild(msgBox);
        }, time);
    }
}