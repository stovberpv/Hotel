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
        this.time = opts.time || 5000;
        this.text = opts.text;
        this.msgBox;
        this.id = Math.floor(Math.random() * 100000);

        return this;
    }

    build() {
        let msgBoxWrapper = document.createElement('div');
        msgBoxWrapper.setAttribute('id', `msg-box-wrapper-${this.id}`);
        msgBoxWrapper.setAttribute('class', 'msg-box-wrapper');
        this.setStyleDefault(msgBoxWrapper);

        let msgBox = document.createElement('div');
        msgBox.setAttribute('class', 'msg-box');

        let span = document.createElement('span');
        span.setAttribute('class', 'msg-box-text');
        span.appendChild(document.createTextNode(this.text));

        msgBox.appendChild(span);
        msgBoxWrapper.appendChild(msgBox);

        this.msgBox = msgBoxWrapper;

        return this;
    }

    show() {
        let self = this;

        self.setStyleHidden(self.msgBox);
        document.body.appendChild(self.msgBox);
        let msgBox = document.getElementById(`msg-box-wrapper-${self.id}`);
        this.setStyleVisible(msgBox);

        setTimeout(() => {
            self.setStyleHidden(msgBox);
            setTimeout(() => { msgBox.parentElement.removeChild(msgBox); }, 1000);
        }, self.time);
    }

    setStyleDefault(target) {
        // target.style.border = '1px solid #fff';
        target.style.borderRadius = '3px';

        target.style.width = '250px';
        target.style.height = '50px';

        target.style.bottom = '20px';
        target.style.right = '20px';

        target.style.display = 'flex';
        target.style.alignItems = 'center';
        target.style.justifyContent = 'center';
        target.style.position = ' absolute';

        target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        target.style.boxShadow = '0px 0px 5px 5px rgba(255, 255, 255, .5)';

        target.style.transitionDelay = '0s';
        target.style.transition = 'visibility 0s linear 0.5s, opacity 0.5s linear';
    }

    setStyleHidden(target) {
        target.style.visibility = 'hidden';
        target.style.opacity = '0';
    }

    setStyleVisible(target) {
        target.style.visibility = 'visible';
        target.style.opacity = '1';
    }
}