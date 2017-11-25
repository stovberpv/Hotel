class Dialog {

    constructor(opts) {
        this.Opts = opts;
        this.Id = Math.floor(Math.random() * 100000);
        this.Doc = opts.source;
    }

    bind() {}
    setVal() {}
    show() {}
    getVal() {}
    unbind() {}
}

class ConfirmDialog extends Dialog {

    bind() {
        var additionalClass = "";
        switch (this.Opts.flag) {
            case -1:
                additionalClass = "modal-header-negative";
                break;
            case 0:
                additionalClass = "modal-header-neutral";
                break;
            case 1:
                additionalClass = "modal-header-positive";
                break;
            case 2:
                additionalClass = "modal-header-extend";
                break;
            default:
                break;
        }

        this.Dialog =
            '<div class="modal-content modal-confirm">' +
            '<div class="modal-header ' + additionalClass + '">' +
            '<a>' + this.Opts.dialog.title + '</a>' +
            '</div>' +
            '<div class="modal-body">' +
            '<a>' + this.Opts.dialog.body + '</a>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" id="btn-no" class="btn negative">Отменить</button>' +
            '<button type="button" id="btn-ok" class="btn positive">Подтвердить</button>' +
            '</div>' +
            '</div>';

        var div = this.Doc.createElement('div');
        div.className = 'modal-dialog';
        div.id = 'modal-dialog-' + this.Id;
        div.innerHTML = this.Dialog;
        this.Doc.body.appendChild(div);

        var dialog = this.Doc.getElementById('modal-dialog-' + this.Id),
            btnOk = dialog.children[0].children[2].children[1],
            btnNo = dialog.children[0].children[2].children[0];

        btnOk.addEventListener('click', this.Opts.buttons.btnOk);
        btnNo.addEventListener('click', this.Opts.buttons.btnNo);
    }

    show() {
        var dialog = this.Doc.getElementById('modal-dialog-' + this.Id);
        dialog.style.display = 'block';
    }

    unbind() {
        var dialog = this.Doc.getElementById('modal-dialog-' + this.Id);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }
}

class InOutDialog extends Dialog {

    bind() {
        let additionalClass, title;
        switch (this.Opts.flag) {
            case -1:
                additionalClass = "modal-header-negative";
                title = 'Удаление';
                break;
            case 0:
                additionalClass = "modal-header-neutral";
                title = 'Исправление';
                break;
            case 1:
                additionalClass = "modal-header-positive";
                title = 'Добавление';
                break;
            case 2:
                additionalClass = "modal-header-extend";
                title = 'Обработка';
                break;
            default:
                break;
        }

        let td_st1 = 'display:none;',
            td_st2 = '';

        this.Dialog =
            '<div class="modal-content modal-inout">' +
            '<div class="modal-header ' + additionalClass + '">' +
            '<a>' + title + '</a>' +
            '</div>' +
            '<div class="modal-body">' +
            '<table>' +
            '<tbody>' +
            '<tr>' +
            '<td style="' + td_st1 + '"><input id="in_id"     class="input" name="id"     type="text">                                            </td>' +
            '<td style="' + td_st2 + '"><input id="in_dayin"  class="input" name="dayin"  type="text" size="5" maxlength="5" placeholder="Заезд" ></td>' +
            '<td style="' + td_st2 + '"><input id="in_dayout" class="input" name="dayout" type="text" size="5" maxlength="5" placeholder="Выезд" ></td>' +
            '<td style="' + td_st2 + '"><input id="in_room"   class="input" name="room"   type="text" size="5" maxlength="2" placeholder="Номер" ></td>' +
            '<td style="' + td_st2 + '"><input id="in_price"  class="input" name="price"  type="text" size="6" maxlength="6" placeholder="Цена"  ></td>' +
            '<td style="' + td_st2 + '"><input id="in_paid"   class="input" name="paid"   type="text" size="6" maxlength="6" placeholder="Оплата"></td>' +
            '</tr>' +
            '<tr><td colspan="5"><input id="in_name" class="input" name="name" type="text" size="36" placeholder="ФИО"       ></td></tr>' +
            '<tr><td colspan="5"><input id="in_tel"  class="input" name="tel"  type="text" size="36" placeholder="Телефон"   ></td></tr>' +
            '<tr><td colspan="5"><input id="in_info" class="input" name="info" type="text" size="36" placeholder="Примечание"></td></tr>' +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" id="btn-no" class="btn negative">Отменить</button>' +
            '<button type="button" id="btn-ok" class="btn positive">Подтвердить</button>' +
            '</div>' +
            '</div>';
        var div = this.Doc.createElement('div');
        div.className = 'modal-dialog';
        div.id = 'modal-dialog-' + this.Id;
        div.innerHTML = this.Dialog;
        this.Doc.body.appendChild(div);

        var dialog = this.Doc.getElementById('modal-dialog-' + this.Id),
            btnOk = dialog.children[0].children[2].children[1],
            btnNo = dialog.children[0].children[2].children[0];

        btnOk.addEventListener('click', this.Opts.buttons.btnOk);
        btnNo.addEventListener('click', this.Opts.buttons.btnNo);
    }

    show() {
        var dialog = this.Doc.getElementById('modal-dialog-' + this.Id);
        dialog.style.display = 'block';
    }

    unbind() {
        var dialog = this.Doc.getElementById('modal-dialog-' + this.Id);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }

    setVal(val) {
        if (val != undefined) {
            $('#in_id').val(val.id);
            $('#in_dayin').val(val.dayin);
            $('#in_dayout').val(val.dayout);
            $('#in_room').val(val.room);
            $('#in_price').val(val.price);
            $('#in_paid').val(val.paid);
            $('#in_name').val(val.name);
            $('#in_tel').val(val.tel);
            $('#in_info').val(val.info);
        }
    }

    getVal() {
        return {
            id: $('#in_id').val(),
            dayin: $('#in_dayin').val(),
            dayout: $('#in_dayout').val(),
            room: $('#in_room').val(),
            price: $('#in_price').val(),
            paid: $('#in_paid').val(),
            name: $('#in_name').val(),
            tel: $('#in_tel').val(),
            info: $('#in_info').val()
        }
    }
}

class InputDialog extends Dialog {

    bind() {
        var additionalClass = "";
        switch (this.Opts.flag) {
            case -1:
                additionalClass = "modal-header-negative";
                break;
            case 0:
                additionalClass = "modal-header-neutral";
                break;
            case 1:
                additionalClass = "modal-header-positive";
                break;
            case 2:
                additionalClass = "modal-header-extend";
                break;
            default:
                break;
        }

        this.Dialog =
            '<div class="modal-content modal-input">' +
            '<div class="modal-header ' + additionalClass + '">' +
            '<a>' + this.Opts.dialog.title + '</a>' +
            '</div>' +
            '<div class="modal-body">' +
            '<input id="in_year" class="input" name="year" type="text" size="4" maxlength="4" placeholder="Год">' +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" id="btn-no" class="btn negative">Отменить</button>' +
            '<button type="button" id="btn-ok" class="btn positive">Подтвердить</button>' +
            '</div>' +
            '</div>';
        var div = this.Doc.createElement('div');
        div.className = 'modal-dialog';
        div.id = 'modal-dialog-' + this.Id;
        div.innerHTML = this.Dialog;
        this.Doc.body.appendChild(div);

        var dialog = this.Doc.getElementById('modal-dialog-' + this.Id),
            btnOk = dialog.children[0].children[2].children[1],
            btnNo = dialog.children[0].children[2].children[0];

        btnOk.addEventListener('click', this.Opts.buttons.btnOk);
        btnNo.addEventListener('click', this.Opts.buttons.btnNo);
    }

    show() {
        var dialog = this.Doc.getElementById('modal-dialog-' + this.Id);
        dialog.style.display = 'block';
    }

    unbind() {
        var dialog = this.Doc.getElementById('modal-dialog-' + this.Id);
        dialog.style.display = 'none';
        dialog.parentNode.removeChild(dialog);
    }

    getVal() {
        return {
            year: $('#in_year').val()
        }
    }
}